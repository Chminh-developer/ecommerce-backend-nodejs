'use strict'

const { product, clothes, electronic, furniture } = require("../product.model")
const { Types } = require('mongoose')
const { getSelectData } = require('../../utils/index')

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find( query )
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null

    const { modifiedCount } = await product.updateOne({ _id: foundShop._id }, { $set:{
        isDraft: false,
        isPublished: true
    }})
    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null

    const { modifiedCount } = await product.updateOne({ _id: foundShop._id }, { $set:{
        isDraft: true,
        isPublished: false
    }})
    return modifiedCount
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllProducts = async ({ sort, limit, page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1} : {_id: 1};
    const products = await product.find( filter )
    .sort( sortBy )
    .skip( skip )
    .limit( limit )
    .select(getSelectData(select))
    .lean()

    return products
}

const findAllProduct = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isDraft: false,
        isPublished: true,
        $text: { $search: regexSearch }
    },{
        score: { $meta: 'textScore' }
    })
    .sort( { score: { $meta: 'textScore' } })
    .lean()

    return results
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findAllProduct
}