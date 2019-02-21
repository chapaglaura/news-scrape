$(document).ready(() => {

  $('.scrape-articles').click(scrapeArticles);

  $('.clear-articles').click(emptyArticles);

  $('.article-info').click(loadComments($(this).attr('data-id')));

});



function emptyArticles() {
  console.log('deleting');

  $('.article-container').empty();
  $.ajax({
    method: 'DELETE',
    url: '/clear'
  }).then(function () {
  });
}

function scrapeArticles() {
  console.log('scraping');
  $.get('/scrape').then((data) => {
    console.log(data);
    $('.article-container').empty();
    getArticles();
  });
}

function getArticles() {
  console.log('getting')
  $.get('/articles').then(data => {
    data.forEach((el, i) => {
      showArticles(el);
    });
  });
}

function showArticles(data) {

  console.log('showing');

  const { title, link, summary, _id } = data;

  const row = $('<div class="row">');
  col10 = $('<div class="col-10">');
  col2 = $('<div class="col-2">');
  a = $('<a class="article-link">');
  div = $('<div class="article-info" data-toggle="modal" data-target="#commentModal">');
  h3 = $('<h3 class="article-headline">');
  p = $('<p class="article-summary">');
  button = $('<button class="btn btn-secondary article-button">');

  h3.text(title);
  p.text(summary);
  button.text('SAVE ARTICLE').attr('data-id', _id);
  div.attr('data-id', _id).append(h3, p);
  a.attr('href', link).text('Go to article');
  col10.append(div, a);
  col2.append(button);
  row.append(col10, col2);

  $('.article-container').append(row);
}

function loadComments(id) {
  console.log('clicking for comments');

  $.get('/comments' + id)
  .then(function (data) {

  });
}


/*

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the comments from the note section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the comments section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
*/