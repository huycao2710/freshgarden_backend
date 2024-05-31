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
        const attachImage = []
        orderItems.forEach((order) => {
            listItem += `<div>
                <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với Số lượng: <b>${order.amount}</b> và Giá là: <b>${order.price} VND</b></div>
                <div>Bên dưới là hình ảnh của sản phẩm</div>
            </div>`
            attachImage.push({ path: order.image })
        });

        let info = await transporter.sendMail({
            from: process.env.MAIL_ACCOUNT,
            to: "caovanhuy2710@gmail.com",
            subject: "Bạn đã đặt hàng tại FreshCake",
            text: "Cảm ơn bạn nhiều <3",
            html: `<div><b>Bạn đã đặt hàng thành công tại FreshCake</b></div> ${listItem}`,
            attachments: attachImage,
        });
    } catch (error) {
        console.error('Error in sendEmailCreateOrder:', error.message);
    }
};

// const sendVerificationEmail = async (email, token) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.MAIL_ACCOUNT,
//                 pass: process.env.MAILPASSWORD,
//             },
//         });

//         const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;

//         let info = await transporter.sendMail({
//             from: process.env.MAIL_ACCOUNT,
//             to: email,
//             subject: "Email Verification",
//             text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
//             html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`
//         });

//         console.log('Message sent: %s', info.messageId);
//     } catch (error) {
//         console.error('Error in sendVerificationEmail:', error.message);
//     }
// };

module.exports = {
    sendEmailCreateOrderService,

};
