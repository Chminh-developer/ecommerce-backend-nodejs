'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {

    signIn = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.signIn( req.body )
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp( req.body )
        }).send(res)
    }

    signOut = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await AccessService.signOut( req.keyStore )
        }).send(res)
    }

    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get token success',
        //     metadata: await AccessService.handlerRefreshToken( req.body.refreshToken )
        // }).send(res)

        //V2
        new SuccessResponse({
            message: 'Get token success',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)

    }
}

module.exports = new AccessController()
