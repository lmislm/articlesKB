/**
 * Created by lmislm on 2018/2/10.
 * Github：https://github.com/lmislm/
 */
const mongoose = require('mongoose');

//user schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);
