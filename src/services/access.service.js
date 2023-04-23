'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')

const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keytoken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { ROLE_SHOP } = require('../utils/common')
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

class AccessService {

    static handlerRefreshToken = async (refreshToken) => {

        const foundToken = await KeyTokenService.findByRefreshTokenUsed( refreshToken )
        if(foundToken){
            const { userId, email } = await verifyJWT( refreshToken, foundToken.privateKey)

            console.log({userId, email})
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend !! Please relogin')
        }

        const holderToken = await KeyTokenService.findByRefreshToken( refreshToken )
        if(!holderToken){
            throw new AuthFailureError('Shop not registered!')
        }

        const { userId, email } = await verifyJWT( refreshToken, holderToken.privateKey)
        const foundShop = await findByEmail({ email })
        if(!foundShop){
            throw new AuthFailureError('Shop not registered!')
        }

        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
        
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: { userId, email },
            tokens,
        }
    }

    static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend !! Please relogin')
        }

        if(keyStore.refreshToken !== refreshToken){
            throw new AuthFailureError('Shop not registered!')
        }

        const foundShop = await findByEmail({ email })
        if(!foundShop){
            throw new AuthFailureError('Shop not registered!')
        }

        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens,
        }
    }


    static signIn = async ({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({ email })
        if(!foundShop){
            throw new BadRequestError('Shop not registered!')
        }

        const match = bcrypt.compare( password, foundShop.password)
        if(!match){
            throw new AuthFailureError('Authentication error')
        }

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const tokens = await createTokenPair({ userId: foundShop._id, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })

        return {
            shop: getInfoData({
                fields:['_id', 'name', 'email'],
                object: foundShop,
            }),
            tokens
        } 
    }

    static signUp = async ({name, email, password}) => {
        
        const holderShop = await shopModel.findOne({ email }).lean()
        if(holderShop){
            throw new ConflictRequestError('Error: Shop already registered!')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, 
            email, 
            password: passwordHash, 
            roles: [ROLE_SHOP.SHOP],
        })

        if(newShop){
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            })

            if(!keyStore){
                throw new BadRequestError('Error: keyStore Error!')
            }

            const tokens = await createTokenPair({ userId: newShop._id, email}, publicKey, privateKey)

            return {
                shop: getInfoData({
                    fields:['_id', 'name', 'email'],
                    object: newShop,
                }),
                tokens
            }
        }

        return null
    }

    static signOut = async ( keyStore ) => {
        return await KeyTokenService.removeKeyById(keyStore._id)
    }
}

module.exports = AccessService
