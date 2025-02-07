const nodemailer = require('nodemailer');

module.exports.sendMail = async function sendMail(str, data, domain) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "varshney.deepshikha10@gmail.com",
            pass: "cumreuzpkyuwrwsi", // App password
        },
    });

    let Osubject, Ohtml;
    if (str === "login") {
        Osubject = `Thank you for Registering!`;
        Ohtml = `
            <h2>Welcome to MediConnect</h2><br>
            <h3>Dear ${data.name},</h3>
            We are thrilled to have you join our healthcare community!
            <br>
            <h3>Thank you for registering with MediConnect! Your support helps us bridge the gap between patients and healthcare professionals.</h3><br>

            <h4>Here are your registration details:<br></h4>
            <ul>
                <li><strong>Name:</strong> ${data.name}</li>
                <li><strong>Email:</strong> ${data.email}</li>
            </ul>

            <h4>Please keep your account secure and never share your password with anyone.</h4>
            <h4>If you have any questions or require assistance, feel free to reach out to our support team.</h4>
            <h4>Together, we are making healthcare more accessible and efficient!</h4>
            <br>
            <h4>Best regards,</h4>
            <h4>The MediConnect Team</h4>
        `;
    } else if (str == "resetpassword") {
        Osubject = `Reset Password`;
        const resetPasswordLink = `http://${domain}:5500/mediconnect/resetPassword.html?token=${data.resetPasswordLink}`;
        console.log(resetPasswordLink);
        Ohtml = `
            <h2>Forgot your Password? No problem!</h2>
            <h4>Now you can set a new one! Click on the link below -</h4>
            <button style="background-color: #007bff; color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-bottom: 10px; cursor: pointer;">
                <a href="${resetPasswordLink}" style="color: white; text-decoration: none;">Reset Password</a>
            </button>
            <h4>If you didn't request a password reset, you can delete this email.</h4>
        `;
    }

    try {
        const info = await transporter.sendMail({
            from: '"MediConnect💡 " <varshney.deepshikha10@gmail.com>', // Sender address
            to: data.email, // Receiver's email
            subject: Osubject, // Subject line
            html: Ohtml, // Email body
        });

        console.log("✅ Message sent: %s", info.messageId);
        return true; // ✅ Return true if email is sent successfully
    } catch (error) {
        console.error("❌ Error Sending Email:", error);
        return false; // ❌ Return false if email fails
    }
};
