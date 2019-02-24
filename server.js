const express = require("express");
logger = require("morgan");
mongoose = require("mongoose");
cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const articleRouter = require('./routes/apiRoutes/articleRoutes')(db);
const commentRouter = require('./routes/apiRoutes/commentRoutes')(db);
const scrapeRouter = require('./routes/apiRoutes/scrapeRoutes')(db);

app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/scrape', scrapeRouter);

require('./routes/htmlRoutes')(app, db);



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
