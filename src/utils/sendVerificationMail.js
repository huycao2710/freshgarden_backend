const { createMailTransporter } = require("./createMailTransporter");

const sendVerificationEmail = (user) => {
    return new Promise((resolve, reject) => {
        const transporter = createMailTransporter();

        const mailOptions = {
            from: '"Gửi từ" <caovanhuy2710@gmail.com>',
            to: user.email,
            subject: "Xác thực email của bạn",
            html: `<p>Xin chào ${user.fullName}, xác thực email của bạn bằng cách bấm vào liên kết sau:</p>
            <a href="${process.env.CLIENT_URL}/verify-email?emailToken=${user.emailToken}">Xác thực email của bạn</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // Use a logger to log errors
                console.error("Error sending verification email:", error);
                reject(error);
            } else {
                // Use a logger to log success messages
                console.log("Verification email sent successfully");
                resolve();
            }
        });
    });
};

module.exports = { sendVerificationEmail };
