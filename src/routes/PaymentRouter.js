const OrderAllController = require("../controller/OrderAllController");
const express = require("express");
const cors = require("cors");
const router = express.Router();
const dotenv = require("dotenv");
const moment = require("moment");
dotenv.config();
const axios = require("axios");
const qs = require("qs");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
let $ = require("jquery");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Stripe = require("stripe")(
  "sk_test_51PNyemGKPYTOEQ9eu2Ps0qD6H3MewItIyG9K7e9rntcOcwpiBDu6pIWcDFCQmKM7GlrO96SZU0N7Uw8JmbVyCvbo00kxInzBbN"
);

let app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());

router.get("/config", (req, res) => {
  return res.status(200).json({
    status: "OK",
    data: process.env.CLIENT_ID,
  });
});
//vnpay
router.post("/vnpay", OrderAllController.paymentOrderVnpay);
router.get("/vnpay-return", OrderAllController.confirmOrderVnpay);

//zalopay
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

router.use(bodyParser.json());

router.post("/zalopay", async (req, res) => {
  const { orderItems, totalPrice, user, email } = req.body;

  const embed_data = {
    redirectUrl: `${process.env.BASE_URL}/zalopay-success`,
  };

  const items = [{}];

  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: totalPrice,
    description: `Thanh toán hoá đơn #${transID}`,
    bank_code: "",
  };

  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  const result = await axios.post(config.endpoint, null, { params: order });
  return res.status(200).json({
    status: "OK",
    app_trans_id: order.app_trans_id,
    data: result.data,
  });
});
router.post("/check_zalopay", async (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where apptransid =",
        dataJson["apptransid"]
      );

      result.returncode = 1;
      result.returnmessage = "success";
    }
  } catch (ex) {
    result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.returnmessage = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});
// router.post('/check_zalopay', async (req, res) => {
//     const { trans_id } = req.body;

//     const postData = {
//         app_id: config.app_id,
//         app_trans_id: trans_id,
//     };

//     let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
//     postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//     const postConfig = {
//         method: 'post',
//         url: 'https://sb-openapi.zalopay.vn/v2/query',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data: qs.stringify(postData)
//     };

//     const result = await axios(postConfig);
//     return res.status(200).json({
//         status: 'OK',
//         data: result.data
//     });
// });

//momo
var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var partnerCode = "MOMO";

router.post("/momo", async (req, res) => {
  try {
    const { totalPrice } = req.body;

    const orderInfo = "pay with MoMo";
    const redirectUrl = `${process.env.BASE_URL}/zalopay-success`;
    const ipnUrl = `${process.env.BASE_URL}`;
    const requestType = "captureWallet";
    const amount = totalPrice;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = "";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: "vi",
      requestType,
      extraData,
      signature,
    };

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    const result = await axios(options);

    return res.status(200).json({
      status: "OK",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in /momo:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Internal Server Error",
    });
  }
});

router.post("/check_momo", async (req, res) => {
  try {
    const { orderId } = req.body;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      requestId: orderId,
      orderId,
      signature,
      lang: "vi",
    };

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/query",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    const result = await axios(options);

    return res.status(200).json({
      status: "OK",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in /check_momo:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Internal Server Error",
    });
  }
});

//stripe
router.post("/stripe", async (req, res) => {
  const { totalPrice } = req.body;
  console.log(totalPrice);

  try {
    const session = await Stripe.checkout.sessions.create({
      success_url: `http://localhost:3000/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "cake",
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    });

    return res.status(200).json({
      status: "OK",
      data: session,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
});

router.post("/check_stripe", async (req, res) => {
  try {
    const session = await Stripe.checkout.sessions.retrieve(req.body.id);
    return res.status(200).json({
      status: "OK",
      data: session,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
});

module.exports = router;
