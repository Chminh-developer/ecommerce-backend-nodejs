const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');

const app = express();
// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db

// int router
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome NodeJS',
    });
})

// handling error

module.exports = app;