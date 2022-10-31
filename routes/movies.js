const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  postMovies,
  checkId,
  deleteMovies,
} = require('../controllers/movies');
const { regularLink } = require('../utils/regEx');

moviesRouter.get('/movies', getMovies);
moviesRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(regularLink),
      trailerLink: Joi.string().required().pattern(regularLink),
      thumbnail: Joi.string().required().pattern(regularLink),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  postMovies,
);
moviesRouter.delete(
  '/movies/:moviesId',
  celebrate({
    params: Joi.object().keys({
      moviesId: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  checkId,
  deleteMovies,
);

module.exports = { moviesRouter };
