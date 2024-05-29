const express = require("express");
const router = express.Router()
const CategoryAllController = require('../controller/CategoryAllController');
const { authenticationMiddleWare } = require("../middleware/authenticationMiddleware");

router.post('/create-newcategory', CategoryAllController.createNewCategory)
router.put('/update-infoproduct/:id', authenticationMiddleWare, CategoryAllController.updateInfoCategory)
router.delete('/delete-category/:id', authenticationMiddleWare, CategoryAllController.deleteInfoCategory)
router.get('/get-allcategory', CategoryAllController.getAllInfoCategory)
router.post('/delete-manycategory', authenticationMiddleWare, CategoryAllController.deleteManyCategory)
router.get('/get-categorydetails/:id', CategoryAllController.getCategoryDetails)

module.exports = router