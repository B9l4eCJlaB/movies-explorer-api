const { ERROR_INTERNAL_SERVER } = require('../utils/errors');

module.exports.handleError = (err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_INTERNAL_SERVER
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
