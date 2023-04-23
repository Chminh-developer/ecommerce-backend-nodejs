'use strict'

const keyTokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose')

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try{
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // })

            // return tokens ? tokens.publicKey : null

            const filter = { user: userId }
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken}
            const options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (err){
            return err
        }
    }

    static findByUserId = async ( userId ) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId)})       
    }

    static findByRefreshToken = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshToken })     
    }

    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id)
    }
    
    static deleteKeyById = async ( userId ) => {
        return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) })
    }
}

module.exports = KeyTokenService
