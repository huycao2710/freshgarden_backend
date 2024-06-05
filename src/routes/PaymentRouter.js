const express = require("express");
const router = express.Router()
const { authenticationMiddleWare} = require("../middleware/authenticationMiddleware");
const OrderAllController = require('../controller/OrderAllController');
const dotenv = require('dotenv');
dotenv.config()

router.get('/config', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        data: process.env.CLIENT_ID
    })
})

router.post('/payment-order-vnpay-success', OrderAllController.paymentOrderVnpay)
router.post('/payment-order-vnpay', OrderAllController.paymentOrderVnpay)
router.post('/vnpay_return', OrderAllController.confirmOrderVnpay)

module.exports = router