(function() {
  'use strict';

  var movies = [];

  var renderMovies = function() {
    $('#listings').empty();

    for (var movie of movies) {
      var $col = $('<div class="col s6">');
      var $card = $('<div class="card hoverable">');
      var $content = $('<div class="card-content center">');
      var $title = $('<h6 class="card-title truncate">');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50, });
      $title.text(movie.title);

      var $poster = $('<img class="poster">');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      var $action = $('<div class="card-action center">');
      var $plot = $('<a class="waves-effect waves-light btn modal-trigger">');

      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      var $modal = $(`<div id="${movie.id}" class="modal">`);
      var $modalContent = $('<div class="modal-content">');
      var $modalHeader = $('<h4>').text(movie.title);
      var $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      var $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // ADD YOUR CODE HERE

  // Listen for submissions on the search form. Remember to prevent the default action.
  $('button').on('click', function (event) {
    event.preventDefault();
    // console.log('search text: ', $('#search').val());

    // Validate the user input is not blank.
    var searchValue = $('#search').val();
    if(searchValue.length === 0){
      return;
    }

    // Clear the previous search results.
    $('#listings').html('');

    // Send an HTTP request to the OMDB API search endpoint.
    var $xhr = $.getJSON('http://www.omdbapi.com/?s=' + searchValue);

    // Handle the HTTP response by pushing a new, well-formed movie object into the global movies array.
    $xhr.done(function(data) {
      if ($xhr.status !== 200) {
        return;
      }
      console.log('The data: ', data);
      console.log('The data search: ', data["Search"]);
      var results = data.Search;
      var movie = {};
      // for (var i = 0; i < results.length; i++) {
      for (var result of results) {
        // console.log("Result: ", results[i]['Title']);
        // console.log(result.Title);
        movie = {
          id: result.imdbID,
          poster: result.Poster,
          title: result.Title,
          year: result.Year,
          // plot: result.Plot
        }
        movies.push(movie);
      }
      console.log("Global movies array: ", movies);

      // Render the movies array to the page by calling the renderMovies() function with no arguments.
      renderMovies();

      movies = [];
    });
  })
});
