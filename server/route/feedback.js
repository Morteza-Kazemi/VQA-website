import Query from "../db/model/query";
import fs from "fs";
import moment from "moment";

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


