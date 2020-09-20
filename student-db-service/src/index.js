const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const middlewares = require('./middlewares');
const students = require('./api/students');
const generateStudents = require('./models/generate-students');

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Successfully connected to MongoDB.');
    if (process.env.NODE_ENV === 'development') {
      await generateStudents({ empty: process.env.EMPTY_STUDENTS });
    }
  }).catch((err) => {
    console.log(`Could not connect to MongoDB. ${err.message}`);
    process.exit();
  });

app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/students', students);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
