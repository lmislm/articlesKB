/**
 * Created by lmislm on 2018/2/10.
 * Github：https://github.com/lmislm/
 */
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/kb');
let db = mongoose.connection;

//Check connection
db.once('open', function () {
    console.log('MongoDB opened');
});
//check for DB
db.on('error', function (err) {
    console.log(err)
});
//Bring to Models
let Article = require('./models/article');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));
//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Home Route
app.get('/',function (req, res) {
    Article.find({},function (err, articles) {
        if(err) {
            console.log(err);
        }else {
            res.render('index', {
                title: '文章',
                articles: articles
            });
        }
    });
    // let articles = [
    //...
    // ];
});
//Get single Article from Database
app.get('/articles/:id',function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        });
    });
});
//Add Router
app.get('/articles/add',function (req, res) {
    res.render('add_article', {
        title: '添加文章'
    });
});

// POST Router
app.post('/articles/add', function (req, res) {
   let article =  new Article();
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;

   article.save(function (err) {
       if(err) {
           console.log(err)
           return
       }else {
           res.redirect('/');
       }
   })
    // return;
});

//Load Edit Form
app.get('/articles/edit/:id',function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('edit_article', {
            title:'文章编辑',
            article: article
        });
    });
});

//Update Submit POST Route To Database
 app.post('/articles/edit/:id', function (req, res) {
    let article =  {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id: req.params.id}


    Article.update(query, article, function (err) {
        if(err) {
            console.log(err)
            return
        }else {
            res.redirect('/');
        }
    })
    // return;
});

 app.delete('/article/:id', function (req, res) {
     let query = {_id: req.params.id}

     Article.remove(query, function (err) {
         if(err) {
             console.log(err);
         }
         res.send('成功删除');
     });
 });


app.listen(3000, function () {
    console.log('Server started on port :');
});