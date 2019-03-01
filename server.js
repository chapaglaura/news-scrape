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

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
