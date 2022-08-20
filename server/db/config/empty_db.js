// run: node .\server\db\config\empty_db.js

const config = require("./config");
const mongoose = require("mongoose");
const Query = require("../model/query");

mongoose.connect( config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true} );

Query.deleteMany({}).then(function(){
    console.log("All queries deleted"); // Success
}).catch(function(error){
    console.log(error); // Failure
});
