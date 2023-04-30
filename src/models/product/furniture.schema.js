'use strict'

const { Schema, model} = require('mongoose'); // Erase if already required

const { DOCUMENTS, COLLECTIONS } = require('../../utils/common');

const furnitureSchema = new Schema({
    branch: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENTS.SHOP },
}, {
    collection: COLLECTIONS.FURNITURES,
    timestamps: true,
})

module.exports = furnitureSchema;
