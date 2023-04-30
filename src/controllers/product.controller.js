'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")

class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product published success!',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product unPublished success!',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }


    // QUERY 
    /**
     * @description Get list drafts for shop
     * @param {JSON} 
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Published success!',
            metadata: await ProductService.findAllPublishedForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    getAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all products success!',
            metadata: await ProductService.findAllProducts(req.body)
        }).send(res)
    }

    getListSearchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search success!',
            metadata: await ProductService.searchProducts({
                keySearch: req.params.keySearch,
            })
        }).send(res)
    }
    //ENDQUERY
}

module.exports = new ProductController()
