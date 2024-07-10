const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
// const EXAMPLEROUTER = require('./controllers/EXAMPLE ROUTER')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose');


mongoose.set('strictQuery',false)

const url = config.MONGO_URI

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// app.use('/', EXAMPLE ROUTER)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});