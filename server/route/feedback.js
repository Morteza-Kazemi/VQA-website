const Query = require("../db/model/query");
const fs = require("fs");
const moment = require("moment");
const multer = require("multer");

const express = require("express");
const app = express();

const image_save_dir = 'db/temp/images'; //todo this folder is not a very good idea!
const image_file = image_save_dir + "/image.png";

function save_query_to_database(question, answer, liked, correction) {
    let query = new Query({
        image: {
            data: fs.readFileSync(image_file), //todo check if you can retrieve and show the image store with this in the DB
            contentType: 'image/png'
        },
        question: question,
        answer: answer,
        date_uploaded: moment(),
        liked: liked,
        user_correction: correction
    });

    query.save(); //todo: do I need to add await? or is it saved later?
    console.log('adding the query to database completed')
}

// handle storage using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, image_save_dir);
    },
    filename: function (req, file, cb) {
        //save the image as a .png file. works fine with the following extensions: .jpg, .jfif, .webp, .jpeg, .png
        cb(null, `${file.fieldname}.png`);//${path.extname(file.originalname)}
    }
});
const upload = multer({storage: storage});


app.post('/feedback',upload.single('image'),(req, res, next) => {
    //todo edit this part!
    const question = req.body.question !== ""? req.body.question : "no data";
    const answer = req.body.answer !== ""? req.body.answer : "no data";
    const correction = req.body.correction !== ""? req.body.correction : "no data";
    const liked = req.body.liked !== ""? req.body.liked : "no data";


    save_query_to_database(question, answer, liked, correction);
    console.log('query saved to database.')
});

module.exports = app;

