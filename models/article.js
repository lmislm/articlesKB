/**
 * Created by lmislm on 2018/2/10.
 * Github：https://github.com/lmislm/
 */
let mongoose = require('mongoose');


//article schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
});

let Article = module.exports = mongoose.model('Article', articleSchema);