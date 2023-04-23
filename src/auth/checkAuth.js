'use strict'

const { findById } = require("../services/apiKey.service")
const { HEADER, HTTP_STATUS } = require("../utils/common")

const apiKey = async (req, res, next) => {
    try{
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(HTTP_STATUS.FORBIDDEN)
                .json({
                    message: 'Forbidden Error!',
                })
        }

        // check objKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(HTTP_STATUS.FORBIDDEN)
                .json({
                    message: 'Forbidden Error!',
                })
        }

        req.objKey = objKey
        return next()
    } catch (err){
        console.log(err)
    }
}

const permission = ( permission ) => {
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(HTTP_STATUS.FORBIDDEN)
                .json({
                    message: 'Permission denied!',
                })  
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(HTTP_STATUS.FORBIDDEN)
                .json({
                    message: 'Permission denied!',
                })  
        }

        return next()
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler
}
