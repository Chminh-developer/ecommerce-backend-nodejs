'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required
const { DOCUMENTS, COLLECTIONS } = require('../utils/common')

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type: String,
        trim: true,
        maxLength: 150,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['active', 'unactive' ],
        default: 'unactive',
    },
    verify:{
        type: Schema.Types.Boolean,
        default: false,
    },
    roles:{
        type: Array,
        default: [],
    },
},     {
    timestamps: true,
    collection: COLLECTIONS.SHOP,
},);

//Export the model
module.exports = model(DOCUMENTS.SHOP, shopSchema);
