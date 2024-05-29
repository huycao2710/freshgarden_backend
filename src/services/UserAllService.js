const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { AccessToken, RefreshToken } = require("./JwtAllService")

const registerUserService = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { fullName, email, password, phone, address, city } = newUser;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại'
                });
            }

            const hash = bcrypt.hashSync(password, 10);
            const createdNewUser = await User.create({
                fullName,
                email,
                password: hash,
                phone,
                address,
                city
            });

            if (createdNewUser) {
                resolve({
                    status: 'OK',
                    message: 'Tạo người dùng thành công',
                    data: createdNewUser
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const loginUserService = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const access_token = await AccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await RefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'Đăng nhập thành công',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateInfoUserService = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Cập nhật thông tin thành công!',
                data: updateUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteInfoUserService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Xoá người dùng thành công',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllInfoUserService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({ createAt: -1, updateAt: -1 })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsInfoUserService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUserService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user SUCCESS',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    registerUserService,
    loginUserService,
    updateInfoUserService,
    deleteInfoUserService,
    getAllInfoUserService,
    getDetailsInfoUserService,
    deleteManyUserService
};
