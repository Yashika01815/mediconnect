const mongoose = require('mongoose');
const {sendMail} = require('../nodeMailer');
const jwt = require('jsonwebtoken');
const JWT_KEY = 'heuiwyr8934y2quxi';
const cookieParser = require('cookie-parser');


// ✅ Get `userModel` directly from Mongoose (Avoid Circular Dependency)
const userModel = mongoose.model('userModel');

module.exports.postSignUp = async function postSignUp(req, res) {
    try {
        console.log("🟢 Received signup request:", req.body);

        let { name, email, password, confirmPassword } = req.body;
        let dataObj = req.body;

        // ✅ Check if any field is empty
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // ✅ Ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }

        let existingUser = await userModel.findOne({ email: dataObj.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists. Enter a new email." });
        }

        let user = await userModel.create({ name, email, password, confirmPassword });

        console.log("✅ User Created:", user);
        return res.json({
            message: "User created",
            data: user
        });
    } catch (err) {
        console.error("❌ Error in postSignUp:", err); // ✅ Log full error
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: err.message // ✅ Send error message to frontend
        });
    }
};

module.exports.forgotPassword = async function forgotPassword(req, res) {
    let { email, domain } = req.body;
    console.log("🔵 Received forgot password request for:", email, domain);

    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            const resetToken = user.createResetToken();
            console.log("🔑 Generated Reset Token:", resetToken);

            user.resetToken = resetToken;
            await user.save();

            let obj = {
                resetPasswordLink: resetToken,
                email: email
            };

            console.log("📧 Sending email with:", obj, domain);
            
            // Send email to the user through nodemailer
            let emailSent = await sendMail("resetpassword", obj, domain);

            if (emailSent) {
                console.log("✅ Email Sent Successfully");
                return res.json({ message: "Password reset email sent." });
            } else {
                console.log("❌ Email Sending Failed");
                return res.json({ message: "Failed to send email. Please try again." });
            }
        } else {
            console.log("⚠️ User not found with email:", email);
            return res.json({ message: "Enter correct email." });
        }
    } catch (err) {
        console.error("❌ Error in forgotPassword:", err);
        return res.json({ message: "Internal Server Error", error: err.message });
    }
};


module.exports.resetPassword = async function resetPassword(req, res) {
    try{
        let {password, confirmPassword, token} = req.body;
        console.log("from frontend",password,confirmPassword,token);
        const user = await userModel.findOne({resetToken:token});
         console.log(user);

         if(user){
              // to reset user password in DB
              user.resetPasswordHandler(password, confirmPassword);   
              await user.save();
              return res.json({message:"credentials updated successfully"}); 
         }else{
            return res.json({
                message:"Link has expired now"
            })
         }
    }catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.loginUser = async function loginUser(req, res){
    try{
        let data = req.body;
        if(data.email){
            let user = await userModel.findOne({email:data.email});

            if(user){
                if(user.password == data.password){
                    const uid = user._id;
                    const token = jwt.sign({_id:uid}, JWT_KEY);
                    res.cookie('token', token, {httpOnly:true,secure:false, 
                        sameSite: 'Lax' , path:'/'});
             
                    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                    res.header('Expires', '-1');
                    res.header('Pragma', 'no-cache');

                    const cookies  = req.cookies;
                    //console.log(cookies);
                    const isFirstLogin = user.firstLogin;
                    if (isFirstLogin) {
                        sendMail("login", user);
                        // Update the user's firstLogin field to false
                        user.firstLogin = false;
                        await user.save();
                       // console.log("First login email sent and user updated:", user);  // Debug log
                    } 
                    return res.json({
                        message :"user has logged in",
                        userDetails : data,
                        firstLogin: isFirstLogin
                    })

                }else{
                    return res.json({
                        message:"wrong password"
                    })
                }
            }else{
                return res.json({
                    message:"User not found. Enter correct email or create your account first!"
                })
            }
        }
        
    }catch(err){
        console.log(err);
    }
}

module.exports.checkLogin = async function checkLogin(req, res) {
    if(req.cookies.token){
        let isVerified = jwt.verify(req.cookies.token,JWT_KEY )
        if(isVerified){
           const userId = isVerified._id;
         //  console.log("userId", userId);

           const user = await userModel.findById(userId);
          // console.log("user", user);
           if(user){
              // console.log("after line 134");
               const userName = user.name; // Extract the username
              // console.log("userName", userName);
               res.json({
                   message:"user has logged in",
                   data:userName
               })
           }
           
            
        }else{
            return res.json({
                message:"Please login first."
            })
        }
    }else {
        return res.json({
            message:"Please login first."
        })
    }
}

module.exports.logoutUser = async function logoutUser(req, res) {
    const token = req.cookies.token;
    //console.log('Token:', token); // Debug log
    if (token) {
        try {
            let isVerified = jwt.verify(token, JWT_KEY);
            //console.log('Token Verified:', isVerified); 
            if (isVerified) {
                res.clearCookie('token', '', {
                    httpOnly: true, 
                    secure: false, 
                    sameSite: 'Lax', 
                    path:'/', 
                    maxAge: 0
                });
                return res.json({message: "User logout successfully"});
            }
        } catch (err) {
            // If the token is not valid (e.g., expired), it will throw an error
            return res.json({message: "Invalid token, please login first."});
        }
    } 
    
    return res.json({message: "Please login first."});
}

module.exports.sendContactMsg = async function sendContactMsg(req, res) {
    try {
        const { name, email, msg } = req.body;

        if (!email || !name) {
            return res.json({
                message:"Enter the correct email or name"
            });
        }

        let user = await userModel.findOne({ email, name });
       // console.log(user);
        if (!user) {
            return res.json({
                message:"User not found. Enter correct email or the user name does not match with the registered email"
            });
        }
        else{
             // Ensure `contactMsg` exists
            user.contactMsg = user.contactMsg || [];

            // Push the new message
            user.contactMsg.push({ msg, createdAt: new Date() });
            await user.save();

            return res.json({
                    message:"Msg send Successfully",
                    data: user.contactMsg
             });
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
