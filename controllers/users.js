const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const RepetitionError = require('../utils/RepetitionError');
const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');

exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id).then((user) => res.send({ user }))
    .catch(next);
};

module.exports.patchUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь с таким id не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
      return;
    }
    if (err.code === 11000) {
      next(new RepetitionError('Такой email уже занят'));
      return;
    }
    next(err);
  }
};

exports.createUser = (req, res, next) => {
  const { name } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create(
      {
        email: req.body.email,
        password: hash,
        name,
      },
    ))
    .then((user) => res.send(
      {
        user: {
          email: user.email,
          name: user.name,
          _id: user._id,
        },
      },
    ))
    .catch((err) => {
      if (err.code === 11000) {
        next(new RepetitionError('Пользователь с таким Email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Неправельно введены данные'));
      } else {
        next(err);
      }
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
