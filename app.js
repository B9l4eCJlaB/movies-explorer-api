require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { handleError } = require('./middlewares/handleError');
const { cors } = require('./middlewares/cors');
const { indexRouter } = require('./routes/index');

const { PORT = 3000, MONGO_URL, NODE_ENV } = process.env;

const app = express();

app.use(cors);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(indexRouter);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);

  if (NODE_ENV === 'production') {
    console.log(process.env.JWT_SECRET);
  }
});
