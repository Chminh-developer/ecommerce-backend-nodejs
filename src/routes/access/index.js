'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

const router = express.Router()

router.post('/signin', asyncHandler(accessController.signIn))
router.post('/signup', asyncHandler(accessController.signUp))

// authentication
router.use(authenticationV2)
router.post('/signout', asyncHandler(accessController.signOut))
router.post('/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router;
