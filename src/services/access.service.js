'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')

const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keytoken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { ROLE_SHOP } = require('../utils/common')
const { BadRequestError, ConflictRequestError } = require('../core/error.response')

class AccessService {

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
}

module.exports = AccessService
