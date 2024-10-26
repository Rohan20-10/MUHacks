const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  Source: { type: String, required: true },
  Value: { type: String, required: true }
});

const MovieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Year: { type: String, required: true },
  Rated: { type: String, required: true },
  Released: { type: String, required: true },
  Runtime: { type: String, required: true },
  Genre: { type: String, required: true },
  Director: { type: String, required: true },
  Writer: { type: String, required: true },
  Actors: { type: String, required: true },
  Plot: { type: String, required: true },
  Language: { type: String, required: true },
  Country: { type: String, required: true },
  Awards: { type: String, required: true },
  Poster: { type: String, required: true },
  Ratings: [RatingSchema],
  Metascore: { type: String, required: true },
  imdbRating: { type: String, required: true },
  imdbVotes: { type: String, required: true },
  imdbID: { type: String, required: true },
  Type: { type: String, required: true },
  DVD: { type: String },
  BoxOffice: { type: String },
  Production: { type: String },
  Website: { type: String },
  Response: { type: String, required: true },
  movieUrl: { type: String, required: true }, // URL of the uploaded movie file
  subtitleUrl: { type: String, required: true } // URL of the uploaded subtitle file
});

module.exports = mongoose.model('Movie', MovieSchema);