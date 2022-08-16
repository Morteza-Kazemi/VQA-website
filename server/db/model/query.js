const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const querySchema = new Schema({
    // todo add giving answers by the user and save them for further use
    //todo add answer_rate: { // users rate for the answer(none, like, dislike)
    //     type: Number, //-1 for dislike, 1 for like and 0 for none (not rated)
    //     required: true,
    // },
    image: {
        // type: String, //todo!
        data: Buffer,
        contentType: String, //"image/png" for example
        // required: true, //todo its required!
    },
    question: {
        type: String,
        required: true,
    },
    answer: { // model's answer to the question
        type: String,
        required: true,
    },
    date_uploaded: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('Query', querySchema)

