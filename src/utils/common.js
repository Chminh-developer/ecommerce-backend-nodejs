'use strict'

const ROLE_SHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization', 
    REFRESH_TOKEN: 'x-rtoken-id'
}

const DOCUMENTS = {
    API_KEY: 'ApiKey',
    TOKEN_KEY: 'Key',
    SHOP: 'Shop',
    PRODUCT: 'Product',
    CLOTHES: 'Clothes',
    ELECTRONIC: 'Electronic',
    FURNITURE: 'Furniture',
}

const COLLECTIONS = {
    API_KEY: 'ApiKeys',
    TOKEN_KEY: 'Keys',
    SHOP: 'Shops',
    PRODUCT: 'Products',
    CLOTHES: 'Clothes',
    ELECTRONICS: 'Electronics',
    FURNITURES: 'Furnitures',
}

module.exports = {
    ROLE_SHOP,
    HEADER,
    DOCUMENTS,
    COLLECTIONS,
}
