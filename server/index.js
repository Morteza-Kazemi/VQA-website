var express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require("path");
const {spawn} = require('child_process');

var app = express();
var port = process.env.PORT || 4000;


app.use(cors()); // enable CORS
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
// app.use(bodyParser.raw());
app.use('/uploads', express.static('uploads'));// serving static files

// request handlers
app.get('/', (req, res) => {
    res.send('Node js file upload rest apis');
});

// handle storage using multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// var upload = multer({ storage: storage }); //todo
var upload = multer(); //todo


// handle single file upload
app.post('/upload-file',upload.single('image'),(req, res, next) => {

    const image = req.file; //todo this is experimental and might not have a good browser compatibility
    const question = req.body;

    if (!image) {
        return res.status(400).send({message: 'Please upload an image.'});
    }
    if (!question){
        return res.status(400).send({ message: 'Please upload a question.' });
    }
    //todo run the python code here and send the result!
    let answer;
    const python = spawn('python', ['../vqa/script1.py']); // spawn new child process to call the python script
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        answer = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        // res.send(dataToSend)
        console.log(answer)
        return res.send({message: 'upload successful.', question, answer, image});
    });

});

app.listen(port, () => {
    console.log('Server started on: ' + port);
});