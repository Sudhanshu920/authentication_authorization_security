const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const connectDB = require('./db/connect');
const userRoute = require('./route/user');

app.use(express.json());

const DB = process.env.DB_URI.replace('<password>', process.env.DB_PASSWORD);

app.use('/api/v1/user', userRoute);

const port = process.env.port || 3000;

const start = async () => {
  try {
    await connectDB(DB);
    app.listen(port, console.log(`server is listening on port ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
