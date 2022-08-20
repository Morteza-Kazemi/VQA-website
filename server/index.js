//todo delete the image and question when you are done! overwriting it works however!

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const config = require("./db/config/config");


const app = express();
const port = process.env.PORT || 5000;// todo!
// const port = 4000;


app.use(cors()); // enable CORS
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
// app.use('/uploads', express.static('uploads'));// serving static files //todo should I use this?!
//todo uncomment in production and building
// app.use(express.static(path.join(__dirname + "/public"))) // the build from the client

app.use(require("./route/feedback"));
app.use(require("./route/uploadFile"));
// app.use(require("./route/history"));

const db = mongoose.connection;
mongoose.connect( config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true} );
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () { console.log("database Connected successfully"); });


app.listen(port, () => {
    console.log('Server started on: ' + port);
});
