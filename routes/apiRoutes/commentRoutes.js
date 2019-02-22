const express = require('express');
axios = require("axios");
const commentRouter = express.Router();



module.exports = (db) => {

    commentRouter.route('/:id')
        .get((req, res) => {
            console.log('getting comments');
            db.Article.findOne({ _id: req.params.id })
                .populate('comments')
                .then(dbArticle => {
                    console.log('got article comments');
                    res.json(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    commentRouter.route('/:id')
        .post((req, res) => {
            console.log('posting comment');
            db.Comment.create(req.body)
                .then(dbComment => {
                    return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id } }, { new: true })
                })
                .then(dbArticle => {
                    console.log('posted comment in article', dbArticle);
                    res.json(dbArticle);
                }).catch(err => {
                    console.log(err);
                });

        });

    commentRouter.route('/remove/:id')
        .delete((req, res) => {
            console.log('about to delete comment');
            db.Article.findOneAndUpdate({ comments: req.params.id }, { $pull: { comments: req.params.id } })
                .then(() => {
                    db.Comment.findOneAndDelete({ _id: req.params.id })
                        .then(deleted => {
                            console.log('deleted comment', deleted);
                            res.json(deleted);
                        });
                }).catch(err => {
                    console.log(err);
                });
        })




    return commentRouter;
}