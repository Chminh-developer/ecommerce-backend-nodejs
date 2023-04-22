'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')

const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keytoken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { ROLE_SHOP } = require('../utils/common')

class AccessService {

    static signUp = async ({name, email, password}) => {
        try{
            // step 1: check exist email
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop){
                return {
                    code: '500',
                    message: 'Shop already registed!',
                }
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
                    return {
                        code: 'XXX',
                        message: 'publicKey error!',
                    }
                }

                const tokens = await createTokenPair({ userId: newShop._id, email}, publicKey, privateKey)
                console.log('Created Token Success', tokens)

                return {
                    code: '201',
                    metadata: {
                        shop: getInfoData({
                            fields:['_id', 'name', 'email'],
                            object: newShop,
                        }),
                        tokens
                    }
                }
            }

            return {
                code: '200',
                metadata: null,
            }
            
        } catch (err){
            return {
                code: 'XXX',
                message: err.message,
                status:'ERROR',
            }
        }
    }
}

module.exports = AccessService
