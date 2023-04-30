'use strict'

const express = require('express');
const productController = require('../controllers/product.controller');
const { asyncHandler } = require('../helpers/asyncHandler');
const { authentication } = require('../auth/authUtils');

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProducts))
router.get('', asyncHandler(productController.getAllProducts))

// authentication
router.use(authentication)
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

//QUERY 
router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop))

//ENQUERY

module.exports = router;
