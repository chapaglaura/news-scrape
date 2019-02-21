var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get('/scrape', function (req, res) {
  axios.get('https://www.dailymail.co.uk/news/index.html')
  .then(function (response) {
    var $ = cheerio.load(response.data);

    $('.article').each(function (i, el) {
      var result = {};
      
      result.title = $(this).find('h2 a').text();
      result.summary = $(this).find('.articletext p').text();
      result.link = 'https://www.dailymail.co.uk/' + $(this).find('h2 a').attr('href');

      result.summary = result.summary.replace('\n', '').trim();
      
      result.summary = result.summary.replace('\\', '').trim();

      if (i < 10) {
        db.Article.create(result).then(function (dbArticle) {
          console.log('successfully scraped');
        }).catch(function (err) {
          console.log(err);
        });
      }
    });
    console.log('Holis');
    res.send('Scrape complete');

  });
});

app.get('/', function(req, res) {
  console.log('homepage loading!!');
  db.Article.find({}).then(function (dbArticle) {
    var obj = {
      article: dbArticle
    }
    res.render('index', obj);
  }).catch(function (err) {
    console.log(err);
  });
});

app.get('/articles', function(req, res) {
  db.Article.find({}).then(function (dbArticle) {
    console.log('finding articles from scraping');
    res.json(dbArticle);
  }).catch(function (err) {
    console.log(err);
  });
});

app.delete('/clear', function(req, res) {
  console.log('about to delete');
  db.Article.deleteMany({}).then(function(deleted) {
    console.log(deleted)
  }).catch(err => {
    console.log(err);
  });
})

app.get('/comments/:id', function(req, res) {
  
})

/*
// Route for grabbing a specific Article by id, populate it with its note
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included

  db.Article.findOne({ _id: req.params.id }).populate('note')
    .then(function (dbArticle) {
      res.json(dbArticle);
    }).catch(function (err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note

  db.Note.create(req.body).then(function (dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
  })
    .then(function (dbArticle) {
      res.json(dbArticle);
    }).catch(function (err) {
      res.json(err);
    });

});
*/
// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
