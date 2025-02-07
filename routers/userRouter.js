const express = require('express');
const { postSignUp, forgotPassword , resetPassword} = require('../controller/userController');

const userRouter = express.Router();

// ✅ Define the route correctly
userRouter.post('/sendInfo', postSignUp);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword', resetPassword);

module.exports = userRouter;
