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
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))

// init db
require('./dbs/init.mongodb');
//checkOverload();

// int router
app.use('/', require('./routes'))

// handling error
app.use((req, res, next) => {
    const error = new Error('NOT FOUND')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode)
        .json({
            status: 'ERROR',
            code: statusCode,
            message: error.message || 'Internal Server Error'
        })
})

module.exports = app;