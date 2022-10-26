const Movies = require('../models/movie');

const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const AccessError = require('../utils/AccessError');

exports.checkId = (req, res, next) => {
  Movies.findById(req.params.moviesId)
    .then((movies) => {
      if (movies === null) {
        throw new NotFoundError('Фильма с данным _id не существует');
      }
      next();
    }).catch(next);
};

exports.postMovies = (req, res, next) => {
  const owner = req.user._id;
  Movies.create({ ...req.body, owner })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неправельно введены данные'));
      } else {
        next(err);
      }
    });
};

exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movies.find({ owner: userId })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неправельно введены данные'));
      } else {
        next(err);
      }
    });
};

exports.deleteMovies = (req, res, next) => {
  Movies.findById(req.params.moviesId)
    .then((movies) => {
      if (movies.owner._id.toString() === req.user._id) {
        Movies.findByIdAndRemove(req.params.moviesId)
          .then((moviesDel) => res.send({ moviesDel }))
          .catch(next);
      } else {
        const accessError = new AccessError('Удаление чужого фильма запрещено');
        next(accessError);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Фильма с данным _id не существует'));
      } else {
        next(err);
      }
    });
};
