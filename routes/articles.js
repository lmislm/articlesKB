/**
 * Created by lmislm on 2018/2/10.
 * Github：https://github.com/lmislm/
 */
const express = require('express');
const router = express.Router();


//Article Models
let Article = require('../models/article');
//User Models
let User = require('../models/user');


router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_article', {
        title:'添加文章'
    });
});

//Post Route
router.post('/add', function (req, res) {
    req.checkBody('title','请添加标题').notEmpty();
    // req.checkBody('author','请添加作者').notEmpty();
    req.checkBody('body','请添加内容').notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if(errors) {
        res.render('add_article', {
            title:'添加文章',
            errors: errors
        });
    }else{
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;
        article.save(function (err) {
            if(err) {
                console.log(err);
                return;
            }else {
                req.flash('success','添加成功');
                res.redirect('/');
            }
        });
    }
});

//Load Edit form
router.get('/edit/:id',ensureAuthenticated, function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if(article.author != req.user._id) {
            req.flash('danger', '没有权限');
            res.redirect('/');
        }else{
            res.render('edit_article', {
                title: '编辑文章',
                article: article
            })
        }
    });
});

//update submit
router.post('/edit/:id', function (req, res) {
    // console.log(req+'res :'+ res);
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    let query = {_id:req.params.id};
    Article.update(query, article, function (err) {
        if(err) {
            console.log('somthing is wrong:'+err);
            return;
        }else {
            req.flash('success','更新成功');
            res.redirect('/');
        }
    });
});
//Article Delete
router.delete('/:id', function (req, res) {
    if(!req.user._id) {
        res.status(500).send;
    }

    let query = {_id:req.params.id};

    Arcticle.findById(req.params.id, function (err, article) {
        if(article.author != user._id) {
            res.status(500).send();
        }else {

        }
    });

    Article.remove(query, function (err) {
        if(err) {
            console.log(err)
        }
        res.send('删除成功')
    });
});

//Get Single Article
router.get('/:id',function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        User.findById(article.author, function (err, user) {
            // cant see the article
            // if(article.author != req.user._id) {
            //     req.flash('danger', '没有权限');
            //     res.redirect('/');
            // }
            res.render('article', {
                article: article,
                author: user.name
            })
        });
    });
});

//Access Control

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }else {
        req.flash('danger', '请登录');
        res.redirect('/users/login');
    }
}

module.exports = router;