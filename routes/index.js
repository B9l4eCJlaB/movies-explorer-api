const indexRouter = require('express').Router();
const { errors } = require('celebrate');
const auth = require('../middlewares/auth');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { userRouter } = require('./users');
const { moviesRouter } = require('./movies');
const NotFoundError = require('../utils/NotFoundError');
const limiter = require('../utils/limiter');

indexRouter.use(requestLogger);
indexRouter.use(limiter);

indexRouter.use(userRouter);
indexRouter.use(auth);
indexRouter.use(moviesRouter);

indexRouter.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

indexRouter.use(errorLogger);

indexRouter.use(errors());

module.exports = { indexRouter };
