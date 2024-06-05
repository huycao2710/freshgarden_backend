const Order = require("../models/OrderProductModel");
const Product = require("../models/ProductModel");
const EmailAllService = require("../services/EmailAllService");
const { v4: uuidv4 } = require('uuid');
const querystring = require('querystring');
const crypto = require('crypto');

const createNewOrderService = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results.filter((item) => item.status === "ERR");
      if (newData.length) {
        const arrId = newData.map((item) => item.id);
        resolve({
          status: "ERR",
          message: `Sản phẩm với id: ${arrId.join(",")} không đủ hàng`,
        });
      } else {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: { fullName, address, city, phone },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user,
          isPaid,
          paidAt,
        });
        if (createdOrder) {
          await EmailAllService.sendEmailCreateOrderService(email, orderItems);
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: createdOrder,
          });
        }
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const getAllInfoOrderService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetailsInfoService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ user: id }).sort({
        createdAt: -1,
        updatedAt: -1,
      });
      if (orders.length === 0) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: orders,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const getDetailsInfoOrderService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrderDetailsInfoService = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const promises = data.map(async (orderItem) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: orderItem.product,
            selled: { $gte: orderItem.amount },
          },
          {
            $inc: {
              countInStock: +orderItem.amount,
              selled: -orderItem.amount,
            },
          },
          { new: true }
        );
        if (!productData) {
          return {
            status: "ERR",
            id: orderItem.product,
          };
        }
      });

      const results = await Promise.all(promises);
      const errors = results.filter((item) => item && item.status === "ERR");
      if (errors.length) {
        const arrId = errors.map((item) => item.id);
        resolve({
          status: "ERR",
          message: `Sản phẩm với id: ${arrId.join(
            ","
          )} không tồn tại hoặc không đủ hàng để hủy`,
        });
      } else {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
          resolve({
            status: "ERR",
            message: "The order is not defined",
          });
        } else {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: order,
          });
        }
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

module.exports = {
  createNewOrderService,
  getAllInfoOrderService,
  getAllOrderDetailsInfoService,
  getDetailsInfoOrderService,
  cancelOrderDetailsInfoService,
};
