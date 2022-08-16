const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require("path");
const {spawn} = require('child_process');
const fs = require('fs');
const mongoose = require("mongoose");
const config = require("./db/config/config");
const Query = require("./db/model/query");
const moment = require('moment');


const app = express();
const port = process.env.PORT || 5000;// todo!
// const port = 4000;


app.use(cors()); // enable CORS
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
// app.use('/uploads', express.static('uploads'));// serving static files //todo should I use this?!
//todo uncomment in production and building
// app.use(express.static(path.join(__dirname + "/public"))) // the build from the client

const db = mongoose.connection;
mongoose.connect( config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true} );
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () { console.log("database Connected successfully"); });


// handle storage using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'vqa/input');
    },
    filename: function (req, file, cb) {
        //save the image as a .png file. works fine with the following extensions: .jpg, .jfif, .webp, .jpeg, .png
        cb(null, `${file.fieldname}.png`);//${path.extname(file.originalname)}
    }
});

//todo delete the image and question when you are done! overwriting it works however!

const upload = multer({storage: storage});


function write_question_to_file(question) {
    fs.writeFileSync("vqa/input/question.txt", question, function (err) { //synchronous file write! (program execution waits...)
        if (err) {
            return console.log(err);
        }
        console.log("Question file was saved!"); //todo this is in err function! :)
    });
}

function save_query_to_database(question, answer) {
    let query = new Query({
        image: {
            data: fs.readFileSync("vqa/input/image.png"), //todo check if you can retrieve and show the image store with this in the DB
            contentType: 'image/png'
        },
        question: question,
        answer: answer,
        date_uploaded: moment()
    });

    query.save(); //todo: do I need to add await? or is it saved later?
    console.log('adding the query to database completed')
}

// handle single file upload
app.post('/upload-file',upload.single('image'),(req, res, next) => {
    console.log('server received a request')
    //todo this is experimental and might not have a good browser compatibility
    const image = req.file;
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
    let answer;
    //todo change to script.py for production
    const python = spawn('python', ['vqa/script.py']); // spawn new child process to call the python script
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
        save_query_to_database(question, answer);
        return res.status(200).send({message: 'successful', answer});
    });
});

app.listen(port, () => {
    console.log('Server started on: ' + port);
});

app.get( "/history", async (req, res) => {
        try {
            let queries = await Query.find({}); //todo .select("_id name description");
            res.status(200).json({queries});
        } catch (error) {
        }
    }
);

    // <img src="data:image/<%=image.img.contentType%>;base64,
    //                  <%=image.img.data.toString('base64')%>">
    //
    // }