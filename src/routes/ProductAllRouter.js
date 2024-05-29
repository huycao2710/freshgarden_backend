const express = require("express");
const router = express.Router()
const ProductAllController = require('../controller/ProductAllController');
const { authenticationMiddleWare } = require("../middleware/authenticationMiddleware");

router.post('/create-newproduct', ProductAllController.createNewProduct)
router.put('/update-infoproduct/:id', authenticationMiddleWare, ProductAllController.updateInfoProduct)
router.delete('/delete-product/:id', authenticationMiddleWare, ProductAllController.deleteInfoProduct)
router.get('/get-allproduct', ProductAllController.getAllInfoProduct)
router.get('/get-detailproduct/:id', ProductAllController.getDetailsInfoProduct)
router.post('/delete-manyproduct', authenticationMiddleWare, ProductAllController.deleteManyProduct)

module.exports = router