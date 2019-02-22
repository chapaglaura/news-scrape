const express = require('express');
axios = require("axios");
const articleRouter = express.Router();



module.exports = (db) => {

    articleRouter.route('/')
        .get((req, res) => {
            console.log('about to get articles');
            db.Article.find({ saved: false })
                .then(dbArticle => {
                    console.log('found articles from database');
                    res.json(dbArticle);
                }).catch(err => {
                    console.log(err);
                });
        });
    articleRouter.route('/save/:id')
        .put((req, res) => {
            console.log('saving article');
            db.Article.findByIdAndUpdate(req.params.id, { saved: true }, { new: true }, (err, updated) => {
                if (err) console.log(err);
                else {
                    console.log('saved article', updated);
                    res.send('saved');
                }
            });
        });

    articleRouter.route('/unsave/:id')
        .put((req, res) => {
            console.log('unsaving article');
            db.Article.findByIdAndUpdate(req.params.id, { saved: false }, { new: true }, (err, updated) => {
                if (err) console.log(err);
                else {
                    console.log('unsaved article', updated);
                    res.send('unsaved');
                }
            });
        });

    articleRouter.route('/clear')
        .delete((req, res) => {
            console.log('about to delete articles');
            db.Article.deleteMany({})
                .then(deleted => {
                    console.log('deleted articles')
                    res.send('deleted');
                }).catch(err => {
                    console.log(err);
                });
        });




    return articleRouter;
}