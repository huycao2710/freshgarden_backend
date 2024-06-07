const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const axios = require('axios');

dotenv.config();

const app = express()
const port = process.env.PORT || 3002

app.use(cors({
    origin: 'https://huycao2710.id.vn/'
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(bodyParser.json())
app.use(cookieParser())

routes(app);

// Proxy endpoint
// app.post('/api/payment/vnpay', (req, res) => {
//     const url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
//     const params = new URLSearchParams(req.body).toString();
//     axios.post(`${url}?${params}`)
//         .then(response => {
//             res.send(response.data);
//         })
//         .catch(error => {
//             res.status(error.response ? error.response.status : 500).send(error.message);
//         });
// });

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connect Db success');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(port, () => {
    console.log('Server is running on port:', port);
});
