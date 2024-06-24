const express = require("express");
const router = express.Router()
const UserAllController = require('../controller/UserAllController');
const { authenticationMiddleWare, authenticationUserMiddleWare } = require("../middleware/authenticationMiddleware");

router.post('/register', UserAllController.registerUser)
router.post('/login', UserAllController.loginUser)
router.post('/log-out', UserAllController.logoutUser)
router.put('/update-infouser/:id', authenticationUserMiddleWare, UserAllController.updateInfoUser)
router.delete('/delete-user/:id', UserAllController.deleteInfoUser)
//authenticationMiddleWare
router.get('/get-alluser', authenticationMiddleWare, UserAllController.getAllInfoUser)
//
router.get('/get-detailuser/:id', UserAllController.getDetailsInfoUser)
//authenticationUserMiddleWare,
router.post('/refresh-token', UserAllController.refreshToken)
router.post('/delete-manyuser', authenticationMiddleWare, UserAllController.deleteManyUser)

module.exports = router