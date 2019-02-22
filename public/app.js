$(document).ready(() => {

  $('.scrape-articles').click(article.scrape);
  $('.clear-articles').click(article.clear);
  $('.article-container').on('click', '.save-article', article.save);
  $('.delete-saved').click(article.deleteSaved);
  $('.article-comments').click(comment.getAll);
  $('.modal-form').on('submit', comment.post);
  $('.comment-container').on('click', '.delete-comment', comment.delete);

});

const article = {
  scrape() {
    $.get('/scrape').then((data) => {
      $('.article-container').empty();
      article.getAll();
    });
  },

  getAll() {
    $.get('/articles').then(data => {
      data.forEach((el, i) => {
        article.show(el);
      });
    });
  },

  show(data) {

    const { title, link, summary, _id } = data;

    const row = $('<div class="row">');
    col10 = $('<div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 col-xl-11">');
    col2 = $('<div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-1">');
    a = $('<a class="article-link">');
    div = $('<div class="article-info" data-toggle="modal" data-target="#commentModal">');
    h3 = $('<h3 class="article-headline">');
    p = $('<p class="article-summary">');
    button = $('<button class="btn btn-secondary save-article">');

    h3.text(title);
    p.text(summary);
    button.text('SAVE ARTICLE').attr('data-id', _id);
    div.attr('data-id', _id).append(h3, p);
    a.attr('href', link).text('Go to article');
    col10.append(div, a);
    col2.append(button);
    row.append(col10, col2);

    $('.article-container').append(row);
  },

  clear() {

    $('.article-container').empty();
    $.ajax({
      method: 'DELETE',
      url: '/articles/clear'
    }).then(data => {
    });
  },

  save() {
    const id = $(this).attr('data-id');

    $(this).parent('div').parent('.row').remove();

    $.ajax({
      method: "PUT",
      url: "/articles/save/" + id
    })
      .then(data => {
      });
  },

  deleteSaved() {
    const id = $(this).attr('data-id');

    $(this).parent('div').parent('.row').remove();

    $.ajax({
      method: "PUT",
      url: "/articles/unsave/" + id
    })
      .then(function (data) {
      })
  }

}

const comment = {
  getAll() {
    const id = $(this).attr('data-id');
    $('#commentModal').attr('data-id', id);
    $.get('/comments/' + id)
      .then(function (data) {
        $('.comment-container').empty();
        if (data.comments.length) {
          data.comments.forEach(el => {
            comment.display(el.body, el._id);
          })
        }
      });
  },

  post(event) {

    event.preventDefault();

    const id = $('#commentModal').attr('data-id');

    $.ajax({
      method: "POST",
      url: "/comments/" + id,
      data: {
        body: $('#commentBody').val().trim()
      }
    }).then(function (data) {
      comment.display($('#commentBody').val(), data.comments[data.comments.length - 1]);
      $('#commentBody').val('');
    });
  },

  display(commentBody, commentId) {

    const row = $('<div class="row">');
    col10 = $('<div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 col-xl-11">');
    col2 = $('<div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-1">');
    i = $('<i class="fas fa-times"></i>');
    p = $('<p class="article-summary">');
    button = $('<button class="btn btn-warning delete-comment" data-comment-id="' + commentId + '">');

    p.append(commentBody);
    col10.append(p);
    button.append(i);
    col2.append(button);
    row.append(col10, col2);
    $('.comment-container').append(row);
  },

  delete() {
    const id = $(this).attr('data-comment-id');

    $.ajax({
      method: 'DELETE',
      url: '/comments/remove/' + id
    });
  }
}


