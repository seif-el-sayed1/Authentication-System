const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyToken = require("../middlewares/verifyToken")


router.route('/register').post(userController.register)

router.route('/login').post(userController.login)

router.route('/logout').post(userController.logout)

router.route('/send-verify-otp').post(verifyToken, userController.sendVerifyOtp)
router.route('/verify-email').post(verifyToken, userController.verifyEmail)

router.route('/send-reset-otp').post(userController.sendResetOtp)
router.route('/reset-password').post(verifyToken, userController.resetPassword)

router.route('/user').get(verifyToken, userController.userData)

router.route('/is-auth').get(verifyToken, userController.isAuthenticated)


module.exports = router;