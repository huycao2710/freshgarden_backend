const express = require("express");
const router = express.Router()
const OrderAllController = require('../controller/OrderAllController');
const { authenticationMiddleWare, authenticationUserMiddleWare } = require("../middleware/authenticationMiddleware");

router.post('/create-neworder/:id', OrderAllController.createNewOrder)
//authenticationUserMiddleWare
router.get('/get-allorder', authenticationMiddleWare, OrderAllController.getAllInfoOrder)
router.get('/get-detailorder/:id', OrderAllController.getDetailsInfoOrder)
router.get('/get-alldetailorder/:id', OrderAllController.getAllOrderDetailsInfo)
//authenticationUserMiddleWare,
router.delete('/cancel-order/:id', OrderAllController.cancelOrderDetailsInfo)
//authenticationUserMiddleWare,

module.exports = router