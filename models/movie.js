const mongoose = require('mongoose');
const { regularLink } = require('../utils/regEx');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        return regularLink.test(v);
      },
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validator(v) {
      return regularLink.test(v);
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validator(v) {
      return regularLink.test(v);
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
