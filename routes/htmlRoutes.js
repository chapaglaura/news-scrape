
module.exports = function (app, db) {

    app.get('/', (req, res) => {
        db.Article.find({ saved: false })
            .then(dbArticle => {
                const obj = {
                    article: dbArticle
                }
                res.render('index', obj);
            }).catch(err => {
                console.log(err);
            });
    });

    app.get('/saved', (req, res) => {
        db.Article.find({ saved: true })
            .then(function (dbArticle) {
                const obj = {
                    article: dbArticle
                }
                res.render('saved', obj);
            }).catch(err => {
                console.log(err)
            });
    });
}