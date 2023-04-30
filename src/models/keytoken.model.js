'use strict'

const { Schema, model} = require('mongoose'); // Erase if already required
const { DOCUMENTS, COLLECTIONS } = require('../utils/common')

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: DOCUMENTS.SHOP,
    },
    privateKey:{
        type: String,
        required:true,
    },
    publicKey:{
        type: String,
        required:true,
    },
    refreshTokensUsed:{
        type: Array,
        default: [],
    },
    refreshToken:{
        type: String,
        required: true,
    },
},{
    collection: COLLECTIONS.TOKEN_KEY,
    timestamps: true,
});

//Export the model
module.exports = model(DOCUMENTS.TOKEN_KEY, keyTokenSchema);