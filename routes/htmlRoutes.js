var path = require('path');

module.exports = function(app) {

    app.get('/', function(req, res) {
        app.get('/articles', function(requ, resp) {
            console.log(resp);
            res.render('index', resp);
        })
    });
}