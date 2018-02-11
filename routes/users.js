/**
 * Created by lmislm on 2018/2/10.
 * Github：https://github.com/lmislm/
 */const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in User Models
let User = require('../models/user');

//Register form
router.get('/register', function (req, res) {
    res.render('register');
});

//register process
router.post('/register', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', '请填写姓名').notEmpty();
    req.checkBody('email', '请填写邮件').notEmpty();
    req.checkBody('email', '无效邮件格式').notEmpty();
    req.checkBody('username', '请填写用户名').notEmpty();
    req.checkBody('password', '请填写密码').notEmpty();
    req.checkBody('password2', '两次密码不一致').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors
        });
    }else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if(err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if(err) {
                        console.log(err);
                        return;
                    }else{
                        req.flash('success', '注册成功，请登录');
                        res.redirect('/users/login');
                    }
                })
            });
        })
    }
});
//Login form
router.get('/login', function (req, res) {
    res.render('login');
});

//Login Process
router.post('/login', function (req, res, next) {
 passport.authenticate('local', {
     successRedirect:'/',
     failureRedirect: '/users/login',
     failureFlash: true
 })(req, res, next);
});

//Logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('danger', '您已经退出');
    res.redirect('/users/login');
});
module.exports = router;