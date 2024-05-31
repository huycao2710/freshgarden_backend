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
router.get('/get-all-category', ProductAllController.getAllCategory)
router.get('/get-products-by-category/:categoryName', ProductAllController.getProductsByCategory)
router.get('/get-featured-products', ProductAllController.getFeaturedProducts);

module.exports = router