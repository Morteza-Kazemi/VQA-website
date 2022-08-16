// run node .\config\empty_db.js in the cmd

const config = require("./config");
const mongoose = require("mongoose");
const Query = require("../model/query");

mongoose.connect( config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true} );

Query.deleteMany({}).then(function(){
    console.log("Courses deleted"); // Success
}).catch(function(error){
    console.log(error); // Failure
});
