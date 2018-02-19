/**
 * Created by lmislm on 2018/2/10.
 * Github：https://github.com/lmislm/
 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');


mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function () {
    console.log('connected to db');
});

db.on('error', function (err) {
    console.log(err);
});

const app = express();

//Bring in Models
let Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//--https://github.com/expressjs/
//Express session Middleware
app.use(session({
    secret: 'keyboard cat',
    //resave: Forces the session to be saved back to the session stor
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

//Express messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validation Middleware
//--https://github.com/andrewkeig/express-validation
//different release
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            ,   root    = namespace.shift()
            ,   formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param   :   formParam,
            msg     :   msg,
            value   :   value
        };
    }
}));

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
   res.locals.user = req.user || null;
   next();
});

//home route
app.get('/',function (req, res) {
    Article.find({}, function (err, articles) {
        if(err) {
            console.log(err);
        }else{
            res.render('index',{
                title: 'Articles',
                articles: articles
            });
        }
    });
});

//Router Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

app.listen(3002,function () {
    console.log('Server started on port :');

});

