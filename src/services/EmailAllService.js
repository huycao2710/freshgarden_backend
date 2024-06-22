const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmailCreateOrderService = async (email, orderItems) => {
    try {
        if (!Array.isArray(orderItems)) {
            throw new Error('orderItems must be an array');
        }

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_ACCOUNT,
                pass: process.env.MAILPASSWORD,
            },
        });

        let listItem = '';
        const attachImage = [];

        orderItems.forEach((order) => {
            // Convert price and amount to numbers, and handle NaN cases
            const price = parseFloat(order.price);
            const amount = parseInt(order.amount);
            if (isNaN(price) || isNaN(amount)) {
                throw new Error(`Invalid price or amount for product ${order.nameProduct}`);
            }

            // Calculate total price
            const totalPrice = price * amount;

            // Format totalPrice to currency
            const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(totalPrice);

            // Build the email content
            listItem += `<div>
                <div>Bạn đã đặt sản phẩm <b>${order.nameProduct}</b> với Số lượng: <b>${order.amount}</b> và Giá là: <b>${formattedPrice}</b></div>
                <div>Bên dưới là hình ảnh của sản phẩm</div>
            </div>`;

            // Push image paths to attachments array
            attachImage.push({ path: order.imageProduct });
        });

        // Send email using Nodemailer
        let info = await transporter.sendMail({
            from: process.env.MAIL_ACCOUNT,
            to: email,
            subject: "Bạn đã đặt hàng tại FreshCake",
            text: "Cảm ơn bạn nhiều <3",
            html: `<div><b>Bạn đã đặt hàng thành công tại FreshCake</b></div> ${listItem}`,
            attachments: attachImage,
        });

        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error in sendEmailCreateOrder:', error.message);
    }
};

module.exports = {
    sendEmailCreateOrderService,
};