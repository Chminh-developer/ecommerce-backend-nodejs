'use strict'

const { Schema, model} = require('mongoose'); // Erase if already required

const { DOCUMENTS, COLLECTIONS } = require('../../utils/common');

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENTS.SHOP },
}, {
    collection: COLLECTIONS.ELECTRONICS,
    timestamps: true,
})

module.exports = electronicSchema;
