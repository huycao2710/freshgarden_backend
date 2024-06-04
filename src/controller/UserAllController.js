const UserAllService = require("../services/UserAllService");
const JwtAllService = require('../services/JwtAllService');

const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phone, address, city } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!fullName || !email || !password || !phone || !address || !city) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Cần nhập đầy đủ thông tin'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Định dạng email không hợp lệ'
            });
        }

        const response = await UserAllService.registerUserService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Cần nhập đầy đủ thông tin'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Định dạng email không hợp lệ'
            });
        }

        const response = await UserAllService.loginUserService(req.body);

        // if (response.data && !response.data.isVerified) {
        //     return res.status(200).json({
        //         status: 'ERR',
        //         message: 'Please verify your email before logging in'
        //     });
        // }

        const { refresh_token, ...newResponse } = response;
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        return res.status(200).json({ ...newResponse, refresh_token });
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

// const verifyEmail = async (req, res) => {
//     try {
//         const { token } = req.query;
//         if (!token) {
//             return res.status(400).json({
//                 status: 'ERR',
//                 message: 'Token is required'
//             });
//         }

//         const response = await UserAllService.verifyEmailService(token);
//         if (!response) {
//             return res.status(400).json({
//                 status: 'ERR',
//                 message: 'Invalid token'
//             });
//         }

//         return res.status(200).json({
//             status: 'OK',
//             message: 'Email verified successfully'
//         });
//     } catch (e) {
//         return res.status(404).json({
//             message: e.message
//         });
//     }
// };

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({
            status: 'OK',
            message: 'Đăng xuất thành công'
        });
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

const updateInfoUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            });
        }
        const response = await UserAllService.updateInfoUserService(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

const deleteInfoUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            });
        }
        const response = await UserAllService.deleteInfoUserService(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

const getAllInfoUser = async (req, res) => {
    try {
        const response = await UserAllService.getAllInfoUserService();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

const getDetailsInfoUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            });
        }
        const response = await UserAllService.getDetailsInfoUserService(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            });
        }
        const response = await JwtAllService.refreshTokenService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

const deleteManyUser = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids are required'
            });
        }
        const response = await UserAllService.deleteManyUserService(ids);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    updateInfoUser,
    deleteInfoUser,
    getAllInfoUser,
    getDetailsInfoUser,
    refreshToken,
    deleteManyUser,
    // verifyEmail
};
