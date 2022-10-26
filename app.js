require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const auth = require('./middlewares/auth');
const NotFoundError = require('./utils/NotFoundError');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const limiter = require('./utils/limiter');
const { userRouter } = require('./routes/users');
const { moviesRouter } = require('./routes/movies');

const { PORT, MONGO_URL, NODE_ENV } = process.env;

const app = express();

app.use(cors);
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(requestLogger);

app.use(userRouter);
app.use(auth);
app.use(moviesRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);

  if (NODE_ENV === 'production') {
    console.log(process.env.JWT_SECRET);
  }
});
