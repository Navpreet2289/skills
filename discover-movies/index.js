const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const { discoverMovie } = require('./movieApi');
const constants = require('./constants');

const app = express();

app.use(bodyParser.json());

app.post('/discover-movies', function(req, res) {
  console.log('[GET] /discover-movies');
  const movie = req.body.conversation.memory['movie'];
  const tv = req.body.conversation.memory['tv'];

  const kind = movie ? 'movie' : 'tv';

  const genre = req.body.conversation.memory['genre'];
  const genreId = constants.getGenreId(genre.value);

  const language = req.body.conversation.memory['language'];
  const nationality = req.body.conversation.memory['nationality'];

  const isoCode = language ? language.short.toLowerCase() : nationality.short.toLowerCase();

  return discoverMovie(kind, genreId, isoCode)
    .then(function(carouselle) {
      res.json({
        replies: carouselle,
      });
    })
    .catch(function(err) {
      console.error('movieApi::discoverMovie error: ', err);
    });
});

const port = config.PORT;
app.listen(port, function() {
  console.log(`App is listening on port ${port}`);
});
