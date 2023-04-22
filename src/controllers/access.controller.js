'use strict'

const AccessService = require("../services/access.service")
const { HTTP_STATUS } = require("../utils/common")

class AccessController {

    signUp = async (req, res, next) => {
        try{
            console.log('[P]::singup::', req.body)
            
            return res.status(HTTP_STATUS.CREATED)
                .json(await AccessService.signUp(req.body))
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AccessController()
