const nodemailer = require('nodemailer');
// password - hvas xzzt pjja decu

module.exports.sendMail = async function sendMail(str, data, domain){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "varshney.deepshikha10@gmail.com",
          pass: "hvasxzztpjjadecu", // first set up the app password
        },
      })
    

    var Osubject, Otext, Ohtml;
    if(str==="login"){
      Osubject=`Thank you for Registering!`;
      Ohtml=`
          <h2>Welcome to Khoya Paya Portal</h2><br>
          <h3>Dear ${data.name}</h3>
          Hope you have a great time!!!!
          <br>
          <h3>Thank you for registering with us! We are delighted to have you as part of our community.</h3><br>
          <h4> Here are your details -<br></h4>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
          </ul>
          <h4>Please keep your password secure and do not share it with anyone.</h4>
          <h4>If you have any questions or need assistance, feel free to contact our support team.</h4>
          <h4>We hope you have a great experience!</h4>
          <br>
          <h4>Best regards,</h4>
          <h4>The Khoya Paya Portal Team</h4>
          `
    }
    else if(str=="resetpassword"){
      Osubject=`Reset Password`
      const resetPasswordLink = `http://${domain}:5501/resetpassword.html?token=${data.resetPasswordLink}`;
      console.log(resetPasswordLink);
      Ohtml=`
          <h2>Forgot your Password? No problem!</h2>
          <h4>Now you can set a new one now! Click on the link below -</h4>
         <button style="background-color: #007bff; color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-bottom: 10px; cursor: pointer;">
            <a href="${resetPasswordLink}" style="color: white; text-decoration: none;">Reset Password</a>
        </button>
          <h4>If you didn't request a password reset, you can delete this email.</h4>

      `
    }

    const info = await transporter.sendMail({
        from: '"Khoya Paya portal" <varshney.deepshikha10@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: Osubject, // Subject line
        //text: "Hello world?", // plain text body
        html: Ohtml, // html body
      });

      console.log("Message sent: %s", info.messageId);
    }