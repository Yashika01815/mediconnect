const express = require('express');
const { postSignUp } = require('../controller/userController');

const userRouter = express.Router();

// ✅ Define the route correctly
userRouter.post('/sendInfo', postSignUp);

module.exports = userRouter;
