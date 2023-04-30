'use strict'

const { Schema } = require('mongoose'); // Erase if already required
const { DOCUMENTS, COLLECTIONS } = require('../../utils/common');

const clothesSchema = new Schema({
    branch: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENTS.SHOP },
}, {
    collection: COLLECTIONS.CLOTHES,
    timestamps: true,
})

module.exports = clothesSchema;
