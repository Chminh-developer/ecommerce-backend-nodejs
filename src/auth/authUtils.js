'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { HEADER } = require('../utils/common')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keytoken.service')

const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try{
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign( payload, privateKey, {
            expiresIn: '7 days'
        })

        return { accessToken, refreshToken }
    } catch (err){
        return err
    }
}

const authentication = asyncHandler(async( req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId){
        throw new AuthFailureError('Invalid Request')
    }

    const keyStore = await findByUserId(userId)
    if(!keyStore){
        throw new NotFoundError('Not found keyStore')
    }

    if(req.headers[HEADER.REFRESH_TOKEN]){
        try{
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decodeUser = JWT.verify( refreshToken, keyStore.privateKey)
            if(userId !== decodeUser.userId){
                throw new AuthFailureError('Invalid User') 
            }

            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (err){
            throw err
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken){
        throw new AuthFailureError('Invalid Request') 
    }

    try{
        const decodeUser = JWT.verify( accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId){
            throw new AuthFailureError('Invalid User') 
        }

        req.keyStore = keyStore
        return next()
    } catch (err){
        throw err
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify( token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
}
