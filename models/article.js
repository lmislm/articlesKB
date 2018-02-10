/**
 * Created by lmislm on 2018/2/10.
 * Github：https://github.com/lmislm/
 */
let mongoose = require('mongoose');

//Article schema
let articleSchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    author:{
        type: String,
        require: true
    },
    body:{
        type: String,
        require: true
    }

});

let Article = module.exports = mongoose.model('Articles', articleSchema);