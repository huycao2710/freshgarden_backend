const OrderAllService = require('../services/OrderAllService')

const createNewOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, phone } = req.body
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderAllService.createNewOrderService(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.error(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getAllInfoOrder = async (req, res) => {
    try {
        const data = await OrderAllService.getAllInfoOrderService()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrderDetailsInfo = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderAllService.getAllOrderDetailsInfoService(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsInfoOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderAllService.getDetailsInfoOrderService(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetailsInfo = async (req, res) => {
    try {
        const orderId = req.params.id
        const data = req.body
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderAllService.cancelOrderDetailsInfoService(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createNewOrder,
    getAllInfoOrder,
    getAllOrderDetailsInfo,
    getDetailsInfoOrder,
    cancelOrderDetailsInfo
}

