const OrderAllController = require("../controller/OrderAllController");
const express = require("express");
const cors = require("cors");
const router = express.Router()
const { authenticationMiddleWare } = require("../middleware/authenticationMiddleware");
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config()
const axios = require('axios')
const qs = require('qs')
const CryptoJS = require('crypto-js');
const crypto = require('crypto')
let $ = require('jquery');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Stripe = require('stripe')('sk_test_51PNyemGKPYTOEQ9eu2Ps0qD6H3MewItIyG9K7e9rntcOcwpiBDu6pIWcDFCQmKM7GlrO96SZU0N7Uw8JmbVyCvbo00kxInzBbN')

let app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(bodyParser.json())
app.use(cookieParser())
router.get('/config', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        data: process.env.CLIENT_ID
    })
})
//vnpay
router.post('/vnpay', OrderAllController.paymentOrderVnpay)
//router.get('/vnpay-return', OrderAllController.confirmOrderVnpay)

//zalopay
const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

router.post('/zalopay', async (req, res) => {
    try {
        const { orderItems, totalPrice, user, email } = req.body;

        const embed_data = {
            redirect_url: "https://freshgarden-backend.onrender.com/callback"
        };

        const items = orderItems.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_price: item.price,
            item_quantity: item.quantity,
        }));

        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: user,
            app_time: Date.now(),
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: totalPrice,
            description: `Thanh toán hoá đơn #${transID}`,
            bank_code: "",
        };

        const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const result = await axios.post(config.endpoint, null, { params: order });

        return res.status(200).json({
            status: 'OK',
            app_trans_id: order.app_trans_id,
            order_url: result.data.order_url
        });
    } catch (error) {
        console.error("Error in /zalopay:", error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Internal Server Error'
        });
    }
});

router.post('/callback', async (req, res) => {
    try {
        const { data } = req.body;

        if (data.return_code === 1) {
            // Chuyển hướng đến trang "success" khi thanh toán thành công
            return res.redirect(`https://huycao2710.id.vn//success?trans_id=${data.app_trans_id}`);
        } else {
            // Chuyển hướng đến trang "failure" khi thanh toán không thành công
            return res.redirect(`https://huycao2710.id.vn//failure?trans_id=${data.app_trans_id}`);
        }
    } catch (error) {
        console.error("Error in /callback:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.post('/check_zalopay', async (req, res) => {
    try {
        const { trans_id } = req.body;

        const postData = {
            app_id: config.app_id,
            app_trans_id: trans_id,
        };

        const data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const postConfig = {
            method: 'post',
            url: 'https://sb-openapi.zalopay.vn/v2/query',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(postData)
        };

        const result = await axios(postConfig);

        return res.status(200).json({
            status: 'OK',
            data: result.data
        });
    } catch (error) {
        console.error("Error in /check_zalopay:", error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Internal Server Error'
        });
    }
});

//momo
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var partnerCode = 'MOMO';
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var partnerCode = 'MOMO';

router.post('/momo', async (req, res) => {
    try {
        const { totalPrice } = req.body;

        const orderInfo = 'pay with MoMo';
        const redirectUrl = 'http://localhost:3002/callback';
        const ipnUrl = 'http://localhost:3002/callback';
        const requestType = "captureWallet";
        const amount = totalPrice;
        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const extraData = '';

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

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
            lang: 'vi',
            requestType,
            extraData,
            signature
        };

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestBody
        };

        const result = await axios(options);

        return res.status(200).json({
            status: 'OK',
            order_url: result.data.payUrl
        });
    } catch (error) {
        console.error("Error in /momo:", error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Internal Server Error'
        });
    }
});


router.post('/callback', async (req, res) => {
    try {
        const { data } = req.body;

        // Kiểm tra và xác thực dữ liệu từ MoMo
        if (data.resultCode === 0) {
            return res.redirect(`http://localhost:3000/success?trans_id=${data.orderId}`);
        } else {
            return res.redirect(`http://localhost:3000/failure?trans_id=${data.orderId}`);
        }
    } catch (error) {
        console.error("Error in /callback:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.post('/check_momo', async (req, res) => {
    try {
        const { orderId } = req.body;

        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode,
            requestId: orderId,
            orderId,
            signature,
            lang: 'vi'
        };

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestBody
        };

        const result = await axios(options);

        return res.status(200).json({
            status: 'OK',
            data: result.data
        });
    } catch (error) {
        console.error("Error in /check_momo:", error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Internal Server Error'
        });
    }
});

//stripe
router.post('/stripe', async (req, res) => {
    const { line_items } = req.body;
    console.log(line_items);

    try {
        const session = await Stripe.checkout.sessions.create({
            success_url: `${process.env.BASE_URL}`,
            line_items: line_items.map(item => ({
                price: item.price_id,
                quantity: item.quantity,
            })),
            mode: 'payment',
        });

        return res.status(200).json({
            status: 'OK',
            data: session
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        return res.status(400).json({
            status: 'ERR',
            message: error.message
        });
    }
});

router.post('/check_stripe', async (req, res) => {
    try {
        const session = await Stripe.checkout.sessions.retrieve(req.body.id);
        return res.status(200).json({
            status: 'OK',
            data: session
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        return res.status(400).json({
            status: 'ERR',
            message: error.message
        });
    }
});

module.exports = router