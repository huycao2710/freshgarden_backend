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

//vnpay
let paymentOrderVnpaySuccess = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create the new order
      let createdOrder = new Order({
        orderItems: data.arrDataShopCart.map(item => ({
          nameProduct: item.nameProduct,
          amount: item.quantity, // Assuming 'quantity' is the equivalent of 'amount'
          imageProduct: item.imageProduct,
          price: item.price,
          discount: item.discount,
          product: item.productId
        })),
        shippingAddress: {
          fullName: data.shippingAddress.fullName,
          address: data.shippingAddress.address,
          city: data.shippingAddress.city,
          phone: data.shippingAddress.phone
        },
        paymentMethod: data.paymentMethod,
        itemsPrice: data.itemsPrice,
        shippingPrice: data.shippingPrice,
        totalPrice: data.totalPrice,
        user: data.userId,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false
      });

      await createdOrder.save();

      // Update the stock of products
      const updateStockPromises = data.arrDataShopCart.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }
        if (product.countInStock < item.quantity) {
          throw new Error(`Not enough stock for product with id ${item.productId}`);
        }
        product.countInStock -= item.quantity;
        await product.save();
      });
      await Promise.all(updateStockPromises);

      resolve({
        errCode: 0,
        errMessage: "ok",
        data: createdOrder
      });
    } catch (error) {
      console.error("Error in paymentOrderVnpaySuccess:", error);
      reject({
        errCode: 1,
        errMessage: error.message
      });
    }
  });
};

const paymentOrderVnpay = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

      const tmnCode = process.env.VNP_TMNCODE;
      const secretKey = process.env.VNP_HASHSECRET;
      let vnpUrl = process.env.VNP_URL;
      const returnUrl = process.env.VNP_RETURNURL;

      console.log("VNP_TMNCODE:", tmnCode);
      console.log("VNP_HASHSECRET:", secretKey);
      console.log("VNP_URL:", vnpUrl);
      console.log("VNP_RETURNURL:", returnUrl);

      const createDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
      const orderId = uuidv4();

      const { amount, orderDescription, orderType, language } = req.body;
      const locale = language || "vn";
      const currCode = "VND";

      let vnp_Params = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": tmnCode,
        "vnp_Locale": locale,
        "vnp_CurrCode": currCode,
        "vnp_TxnRef": orderId,
        "vnp_OrderInfo": orderDescription,
        "vnp_OrderType": orderType,
        "vnp_Amount": amount * 100,
        "vnp_ReturnUrl": returnUrl,
        "vnp_IpAddr": ipAddr,
        "vnp_CreateDate": createDate,
      };

      vnp_Params = sortObject(vnp_Params);

      const signData = querystring.stringify(vnp_Params, { encode: false });

      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;

      vnpUrl += "?" + querystring.stringify(vnp_Params);
      resolve({ errCode: 200, link: vnpUrl });

    } catch (error) {
      console.error("Error in paymentOrderVnpay:", error);
      reject({ errCode: 500, errMessage: "Internal Server Error" });
    }
  });
};

const confirmOrderVnpay = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      var vnp_Params = data;

      var secureHash = vnp_Params['vnp_SecureHash'];

      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      vnp_Params = sortObject(vnp_Params);


      var tmnCode = process.env.VNP_TMNCODE;
      var secretKey = process.env.VNP_HASHSECRET


      var signData = querystring.stringify(vnp_Params, { encode: false });

      var hmac = crypto.createHmac("sha512", secretKey);
      var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

      if (secureHash === signed) {
        resolve({
          errCode: 0,
          errMessage: 'Success'
        })
      } else {
        resolve({
          errCode: 1,
          errMessage: 'failed'
        })
      }
    } catch (error) {
      console.error("Error in confirmOrderVnpay:", error);
      reject({ errCode: 500, errMessage: "Internal Server Error" });
    }
  });
};

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

module.exports = {
  createNewOrderService,
  getAllInfoOrderService,
  getAllOrderDetailsInfoService,
  getDetailsInfoOrderService,
  cancelOrderDetailsInfoService,
  //vnpay
  paymentOrderVnpay: paymentOrderVnpay,
  confirmOrderVnpay: confirmOrderVnpay,
  paymentOrderVnpaySuccess: paymentOrderVnpaySuccess,
};
