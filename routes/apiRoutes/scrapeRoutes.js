const express = require('express');
axios = require("axios");
const scrapeRouter = express.Router();



module.exports = (db) => {

    scrapeRouter.route('/')
    .get((req, res) => {
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




    return scrapeRouter;
}