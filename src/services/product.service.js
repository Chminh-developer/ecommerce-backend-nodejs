'use strict'

const { product, clothes, electronic, furniture } = require("../models/product.model")
const { BadRequestError } = require('../core/error.response')
const enumProductTypes = require('../models/product/productType.enum')
const { 
    findAllDraftsForShop, 
    findAllPublishedForShop, 
    publishProductByShop, 
    unPublishProductByShop, 
    searchProductByUser,
    findAllProducts,
    findAllProduct
} = require('../models/repositories/product.repo.js')

// define Factory pattern
class ProductFactory {
    /*
        type: 'clothes',
        payload,
    */

    static productRegistry = {}
    static registerProduct( type, classRef ){
        ProductFactory.productRegistry[type] = classRef
    }
    
    static async createProduct( type, payload ){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass){
            throw new BadRequestError(`Invalid Product Types: ${type}`)
        }
        
        return new productClass( payload).createProduct()
    }

    // PUT 
    static async publishProductByShop({ product_shop, product_id }){
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unPublishProductByShop({ product_shop, product_id }){
        return await unPublishProductByShop({ product_shop, product_id })
    }
    //ENDPUT
    
    // QUERY 
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static async searchProducts({ keySearch }){
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ sort='ctime', limit = 50, page = 1, filter = { isPublished: true }}){
        return await findAllProducts({ sort, limit, page, filter,
        select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findAllProduct({ product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }
    //ENDQUERY
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quanlity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quanlity = product_quanlity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct( product_id ){
        return await product.create({
            ...this,
            _id: product_id,
        })
    }
}

// define sub-class for different product type clothes
class Clothes extends Product{
    async createProduct(){
        const newClothes = await clothes.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if(!newClothes) throw new BadRequestError('create new clothes error')

        const newProduct = await super.createProduct( newClothes._id)
        if(!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

// define sub-class for different product type Electronics
class Electronic extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if(!newElectronic) throw new BadRequestError('create new Electronics error')

        const newProduct = await super.createProduct( newElectronic._id )
        if(!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

// define sub-class for different product type clothes
class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if(!newFurniture) throw new BadRequestError('create new Furniture error')

        const newProduct = await super.createProduct( newFurniture._id)
        if(!newProduct) throw new BadRequestError('create new Furniture error')

        return newProduct;
    }
}

// register product types
ProductFactory.registerProduct(enumProductTypes.CLOTHES, Clothes)
ProductFactory.registerProduct(enumProductTypes.ELECTRONICS, Electronic)
ProductFactory.registerProduct(enumProductTypes.FURNITURE, Furniture)

module.exports = ProductFactory
