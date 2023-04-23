'use strict'

const { findById } = require("../services/apiKey.service")
const { HEADER } = require("../utils/common")
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")

const apiKey = async (req, res, next) => {
    try{
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(StatusCodes.FORBIDDEN)
                .json({
                    message: ReasonPhrases.FORBIDDEN,
                })
        }

        // check objKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(StatusCodes.FORBIDDEN)
                .json({
                    message: ReasonPhrases.FORBIDDEN,
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
            return res.status(StatusCodes.FORBIDDEN)
                .json({
                    message: 'Permission denied!',
                })  
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(StatusCodes.FORBIDDEN)
                .json({
                    message: 'Permission denied!',
                })  
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permission,
}
