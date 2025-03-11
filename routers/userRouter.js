const express = require('express');
const { postSignUp, forgotPassword , resetPassword, loginUser, checkLogin, logoutUser, sendContactMsg} = require('../controller/userController');

const userRouter = express.Router();


// ✅ Define the route correctly
userRouter.post('/sendInfo', postSignUp);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword', resetPassword);

userRouter.post('/login', loginUser);
userRouter.get('/login', checkLogin);

userRouter.get('/logout', logoutUser);

userRouter.post('/sendMsg', sendContactMsg);

module.exports = userRouter;

