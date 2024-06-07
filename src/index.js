const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

dotenv.config()

const app = express()
const port = process.env.PORT || 3002

const corsOptions = {
    origin: 'https://huycao2710.id.vn', // Thay đổi thành domain bạn cần cho phép
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions))
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(bodyParser.json())
app.use(cookieParser())

routes(app);

app.post('/api/payment/vnpay', (req, res) => {
    axios({
        method: 'post',
        url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        data: req.body,
        headers: {
            // Add necessary headers here
        }
    })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.status(error.response ? error.response.status : 500).send(error.message);
        });
});

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect Db success')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log('Server is running in port: ', + port)
})