const express = require('express');
const path = require('path');
const router = express.Router();
const Movie = require('../models/movies');
const upload = require('../config/multer');

// Create a new movie
router.post('/movies', async (req, res) => {
  try {
    console.log('Received POST request to /movies with data:', req.body);
    const movie = new Movie(req.body);
    await movie.save();
    console.log('Movie saved:', movie);
    res.status(201).send(movie);
  } catch (error) {
    console.error('Error saving movie:', error);
    res.status(400).send(error);
  }
});

// Get all movies
router.get('/movies', async (req, res) => {
  try {
    console.log('Received GET request to /movies');
    const movies = await Movie.find();
    console.log('Movies retrieved:', movies);
    res.status(200).send(movies);
  } catch (error) {
    console.error('Error retrieving movies:', error);
    res.status(500).send(error);
  }
});

// Serve the upload form
router.get('/movies/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '../uploadForm.html'));
});

// Upload full-length movie and subtitles
router.post('/movies/upload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'subtitle', maxCount: 1 }]), async (req, res) => {
  try {
    console.log('Received POST request to /movies/upload with files:', req.files);
    const movieUrl = req.files.file[0].path;
    const subtitleUrl = req.files.subtitle[0].path;

    const movieData = {
      Title: req.body.title,
      Year: req.body.year,
      Rated: req.body.rated,
      Released: req.body.released,
      Runtime: req.body.runtime,
      Genre: req.body.genre,
      Director: req.body.director,
      Writer: req.body.writer,
      Actors: req.body.actors,
      Plot: req.body.plot,
      Language: req.body.language,
      Country: req.body.country,
      Awards: req.body.awards,
      Poster: req.body.poster,
      Metascore: req.body.metascore,
      imdbRating: req.body.imdbRating,
      imdbVotes: req.body.imdbVotes,
      imdbID: req.body.imdbID,
      Type: req.body.type,
      DVD: req.body.dvd,
      BoxOffice: req.body.boxOffice,
      Production: req.body.production,
      Website: req.body.website,
      Response: req.body.response,
      movieUrl: movieUrl,
      subtitleUrl: subtitleUrl
    };

    const movie = new Movie(movieData);
    await movie.save();
    console.log('Movie and subtitle saved:', movie);
    res.status(201).send(movie);
  } catch (error) {
    console.error('Error uploading movie and subtitle:', error);
    res.status(400).send(error);
  }
});

module.exports = router;