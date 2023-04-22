const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/check.connect');
const configMongodb = require('./configs/config.mongodb');

const app = express();
// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db

// int router
app.use('/', require('./routes'))

// handling error

module.exports = app;