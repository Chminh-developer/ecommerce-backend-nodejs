'use strict'

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
}

const REASON_HTTP_STATUS = {
    OK: 'Success',
    CREATED: 'Created!',
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 'Bad request error',
    NOT_FOUND: 404,
    CONFLICT: 'Conflict error',
    INTERNAL_SERVER_ERROR: 500
}

const ROLE_SHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization', 
}


module.exports = {
    HTTP_STATUS,
    REASON_HTTP_STATUS,
    ROLE_SHOP,
    HEADER
}
