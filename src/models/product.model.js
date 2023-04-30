'use strict'

const { Schema, model} = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const { DOCUMENTS, COLLECTIONS } = require('../utils/common');
const enumProductTypes = require('./product/productType.enum');
const clothesSchema = require('./product/clothes.schema');
const electronicSchema = require('./product/electronic.schema');
const furnitureSchema = require('./product/furniture.schema');


const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quanlity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: enumProductTypes },
    product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENTS.SHOP },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTIONS.PRODUCT,
    timestamps: true,
})

// create index for search product
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middleware: runs before save()
productSchema.pre('save', function ( next ) {
    this.product_slug = slugify(this.product_name, { lower: true })  
    next()
})

module.exports = {
    product: model(DOCUMENTS.PRODUCT, productSchema),
    clothes: model(DOCUMENTS.CLOTHES, clothesSchema),
    electronic: model(DOCUMENTS.ELECTRONIC, electronicSchema),
    furniture: model(DOCUMENTS.FURNITURE, furnitureSchema),
}
