const Order = require("../models/OrderProductModel");
const Product = require("../models/ProductModel");
const EmailAllService = require("../services/EmailAllService");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

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
        reject({
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
        } else {
          reject({
            status: "ERR",
            message: "Không thể tạo đơn hàng",
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
let paymentOrderVnpay = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      var ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      var tmnCode = process.env.VNP_TMNCODE;
      var secretKey = process.env.VNP_HASHSECRET;
      var vnpUrl = process.env.VNP_URL;
      var returnUrl = process.env.VNP_RETURNURL;;

      let date = new Date();
      var createDate = moment(date).format("YYYYMMDDHHmmss");

      var orderId = uuidv4();

      console.log("createDate", createDate);
      console.log("orderId", orderId);
      var amount = req.body.amount;
      var bankCode = req.body.bankCode;

      var orderInfo = req.body.orderDescription;
      var orderType = req.body.orderType;
      var locale = req.body.language;
      if (locale === null || locale === "") {
        locale = "vn";
      }
      var currCode = "VND";
      var vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      // vnp_Params['vnp_Merchant'] = ''
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = orderInfo;
      vnp_Params["vnp_OrderType"] = orderType;
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      let querystring = require("qs");
      var signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      var hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;

      var paymentUrl =
        vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });
      console.log(paymentUrl);
      resolve({
        errCode: 200,
        link: paymentUrl,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let confirmOrderVnpay = (req, res, next) => {
  // return new Promise(async (resolve, reject) => {
  //     try {
  //       var vnp_Params = req.query;

  //       var secureHash = vnp_Params['vnp_SecureHash'];

  //       delete vnp_Params['vnp_SecureHash'];
  //       delete vnp_Params['vnp_SecureHashType'];

  //       vnp_Params = sortObject(vnp_Params);

  //       var tmnCode = process.env.VNP_TMNCODE;
  //       var secretKey =  process.env.VNP_HASHSECRET;

  //       var querystring = require('qs');
  //       var signData = querystring.stringify(vnp_Params, { encode: false });
  //       var crypto = require("crypto");
  //       var hmac = crypto.createHmac("sha512", secretKey);
  //       let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  //       if(secureHash === signed){
  //           //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

  //           res.render('success', {code: vnp_Params['vnp_ResponseCode']})
  //       } else{
  //           res.render('success', {code: '97'})
  //       }

  //     } catch (error) {
  //         reject(error)
  //     }
  // })
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  var tmnCode = process.env.VNP_TMNCODE;
  var secretKey = process.env.VNP_HASHSECRET;

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success", { code: "97" });
  }
};

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
module.exports = {
  createNewOrderService,
  getAllInfoOrderService,
  getAllOrderDetailsInfoService,
  getDetailsInfoOrderService,
  cancelOrderDetailsInfoService,
  //vnpay
  paymentOrderVnpay,
  //paymentOrderVnpaySuccess,
  confirmOrderVnpay,
};
