'use strict'

const { REASON_HTTP_STATUS, HTTP_STATUS } = require("../utils/common")

class ErrorResponse extends Error {

    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse{

    constructor( message = REASON_HTTP_STATUS.CONFLICT, statusCode = HTTP_STATUS.CONFLICT){
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse{

    constructor( message = REASON_HTTP_STATUS.FORBIDDEN, statusCode = HTTP_STATUS.FORBIDDEN){
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
}
