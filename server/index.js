const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require("path");
const {spawn} = require('child_process');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4000;


app.use(cors()); // enable CORS
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
// app.use('/uploads', express.static('uploads'));// serving static files //todo should I use this?!

// handle storage using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../vqa/input');
    },
    filename: function (req, file, cb) {
        // cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        cb(null, `${file.fieldname}${path.extname(file.originalname)}`);
    }
});

//todo delete the image and question when you are done! image extension may differ -> overwriting it won't work!

const upload = multer({storage: storage});


// handle single file upload
app.post('/upload-file',upload.single('image'),(req, res, next) => {

    const image = req.file; //todo this is experimental and might not have a good browser compatibility
    const question = req.body.question;

    if (!image) {
        return res.status(400).send({message: 'Please upload an image.'});
    }
    if (!question){
        return res.status(400).send({ message: 'Please upload a question.' });
    }

    fs.writeFileSync("../vqa/input/question.txt", question, function(err) { //synchronous file write! (program execution waits...)
        if(err) {
            return console.log(err);
        }
        console.log("Question file was saved!");
    });

    //run the python code and send the result!
    let answer;
    const python = spawn('python', ['../vqa/script.py']); // spawn new child process to call the python script

    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        answer = data.toString();
    });
    
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        console.log(answer)
        return res.send({message: 'upload successful.', question, answer, image});
    });
});

app.listen(port, () => {
    console.log('Server started on: ' + port);
});