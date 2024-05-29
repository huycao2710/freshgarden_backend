const UserAllRouter = require('./UserAllRouter');
const CategoryAllRouter = require('./CategoryAllRouter');
const ProductAllRouter = require('./ProductAllRouter');
const OrderAllRouter = require('./OrderAllRouter');
const PaymentRouter = require('./PaymentRouter');

const routes = (app) => {
    app.use('/api/user', UserAllRouter)
    app.use('/api/category', CategoryAllRouter)
    app.use('/api/product', ProductAllRouter)
    app.use('/api/order', OrderAllRouter)
    app.use('/api/payment', PaymentRouter)
}

module.exports = routes