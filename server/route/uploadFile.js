import fs from "fs";
import multer from "multer";
import {spawn} from "child_process";

const express = require("express");
const app = express();

//todo these addresses should change!
const python_script = 'vqa/script.py';     //todo change to script.py for production
const image_file = "vqa/input/image.png";
const question_file = "vqa/input/question.txt";
const image_save_dir = 'vqa/input';

function write_question_to_file(question) {
    fs.writeFileSync(question_file, question, function (err) { //synchronous file write! (program execution waits...)
        if (err) {
            return console.log(err);
        }
        console.log("Question file was saved!"); //todo this is in err function! :)
    });
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


function send_answer(question, res) {
    let answer;
    const python = spawn('python', [python_script]); // spawn new child process to call the python script
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        answer = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code} answer is ${answer}`);
        //todo this should be done after the result is sent! so the response time is not increased! -> how about without await?
        console.log('adding the query to database')
        // save_query_to_database(question, answer); //todo should be handled in feedback
        return res.status(200).send({message: 'successful', answer});
    });
}

// handle single file upload
app.post('/upload-file',upload.single('image'),(req, res, next) => {
    console.log('server received a request')

    const image = req.file; //todo this is experimental and might not have a good browser compatibility
    const question = req.body.question

    if (!image) {
        return res.status(400).send({message: 'Please upload an image.'});
    }
    if (!question){
        return res.status(400).send({ message: 'Please upload a question.' });
    }

    write_question_to_file(question); //todo is it OK? or does it need asynch-await?

    console.log('server starting the python script...')

    //run the python code and send the result!
    send_answer(question, res);
});

module.exports = app;