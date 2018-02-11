/**
 * Created by lmislm on 2018/2/10.
 * Github：https://github.com/lmislm/
 */
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    //Local Strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        //Match Username
        let query = {username:username};
        User.findOne(query, function (err, user) {
            if(err) throw err;
            if(!user){
                // return done(null, false, {message: '用户名找不到'});
                return done(null, false, {message: '用户名或密码错误'});
            }

            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user);
                }else {
                    //其实只是密码错误
                    return done(null, false, {message: '用户名或密码错误'});
                }
            });
        });
    }));
    //Doc Configure > Sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

}
