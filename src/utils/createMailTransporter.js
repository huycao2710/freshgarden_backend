const nodemailer = require("nodemailer");

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "caovanhuy2710@gmail.com",
            pass: process.env.MY_MAIL_PASSWORD,
        },
    });

    return transporter;
}

module.exports = { createMailTransporter }