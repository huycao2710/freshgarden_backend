const express = require("express");
const router = express.Router()
const OrderAllController = require('../controller/OrderAllController');
const { authenticationMiddleWare, authenticationUserMiddleWare } = require("../middleware/authenticationMiddleware");

router.post('/create-neworder/:id', authenticationUserMiddleWare, OrderAllController.createNewOrder)
router.get('/get-allorder', authenticationMiddleWare, OrderAllController.getAllInfoOrder)
router.get('/get-detailorder/:id', OrderAllController.getDetailsInfoOrder)
router.get('/get-alldetailorder/:id', authenticationUserMiddleWare, OrderAllController.getAllOrderDetailsInfo)
router.post('/cancel-order/:id', authenticationUserMiddleWare, OrderAllController.cancelOrderDetailsInfo)

module.exports = router