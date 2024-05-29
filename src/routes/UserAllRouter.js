const express = require("express");
const router = express.Router()
const UserAllController = require('../controller/UserAllController');
const { authenticationMiddleWare, authenticationUserMiddleWare } = require("../middleware/authenticationMiddleware");

router.post('/register', UserAllController.registerUser)
router.get('/verify-email', UserAllController.verifyEmail)
router.post('/login', UserAllController.loginUser)
router.post('/log-out', UserAllController.logoutUser)
router.put('/update-infouser/:id', authenticationUserMiddleWare, UserAllController.updateInfoUser)
router.delete('/delete-user/:id', authenticationMiddleWare, UserAllController.deleteInfoUser)
router.get('/get-alluser', authenticationMiddleWare, UserAllController.getAllInfoUser)
router.get('/get-detailuser/:id', authenticationUserMiddleWare, UserAllController.getDetailsInfoUser)
router.post('/refresh-token', UserAllController.refreshToken)
router.post('/delete-manyuser', authenticationMiddleWare, UserAllController.deleteManyUser)

module.exports = router