'use strict'

const { REASON_HTTP_STATUS, HTTP_STATUS } = require("../utils/common")

class SuccessResponse{

    constructor({ message, statusCode = HTTP_STATUS.OK, 
            reasonStatusCode = REASON_HTTP_STATUS.OK, metadata = {} }){
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}){
        return res.status( this.status ).json( this )
    }
}

class OK extends SuccessResponse{

    constructor({ message, metadata }){
        super({ message, metadata })
    }
}

class CREATED extends SuccessResponse{

    constructor({ message, statusCode = HTTP_STATUS.CREATED,
            reasonStatusCode = REASON_HTTP_STATUS.CREATED, metadata }){
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}

module.exports = {
    OK,
    CREATED,
}
