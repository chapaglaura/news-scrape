const axios = require("axios");
module.exports = function (app, db) {

    //JOIN COMMENT WITH ARTICLE RELATIONSHIP
    app.post("/comments/:id", (req, res) => {
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

    //SCRAPE ARTICLES FROM SITE
    app.get('/scrape', function (req, res) {
        console.log('about to scrape articles');
        axios.get('https://www.dailymail.co.uk/news/index.html')
            .then(response => {
                const $ = cheerio.load(response.data);

                $('.article').each(function (i, el) {
                    const result = {};

                    result.title = $(this).find('h2 a').text();
                    result.summary = $(this).find('.articletext p').text();
                    result.link = 'https://www.dailymail.co.uk/' + $(this).find('h2 a').attr('href');

                    result.summary = result.summary.replace('\n', '').trim();

                    if (i < 10) {
                        db.Article.create(result)
                            .then(dbArticle => {
                                console.log('successfully scraped', i + 1);
                            }).catch(err => {
                                console.log(err);
                            });
                    }
                });
                res.send('scrape complete');

            });
    });

    //GET ARTICLES FROM DATABASE
    app.get('/articles', (req, res) => {
        console.log('about to get articles');
        db.Article.find({ saved: false })
            .then(dbArticle => {
                console.log('found articles from database');
                res.json(dbArticle);
            }).catch(err => {
                console.log(err);
            });
    });

    //GET ARTICLE COMMENTS AND SEND THEM TOGETHER
    app.get("/comments/:id", (req, res) => {
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

    //SAVE ARTICLE
    app.put('/articles/save/:id', (req, res) => {
        console.log('saving article');

        db.Article.findByIdAndUpdate(req.params.id, { saved: true }, { new: true }, (err, updated) => {
            if (err) console.log(err);
            else {
                console.log('saved article', updated);
                res.send('saved');
            }
        });
    });

    //UNSAVE ARTICLE
    app.put('/articles/unsave/:id', (req, res) => {
        console.log('unsaving article');

        db.Article.findByIdAndUpdate(req.params.id, { saved: false }, { new: true }, (err, updated) => {
            if (err) console.log(err);
            else {
                console.log('unsaved article', updated);
                res.send('unsaved');
            }
        });
    });

    //CLEAR ALL ARTICLES AND DELETE THEM FROM DATABASE
    app.delete('/articles/clear', (req, res) => {
        console.log('about to delete articles');
        db.Article.deleteMany({})
            .then(deleted => {
                console.log('deleted articles')
                res.send('deleted');
            }).catch(err => {
                console.log(err);
            });
    });

    //DELETE COMMENT FROM ARTICLE AND IN DATABASE
    app.delete('/comments/remove/:id', function (req, res) {
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
}