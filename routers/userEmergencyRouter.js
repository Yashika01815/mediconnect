const express = require('express');
const {sendContactsInfo, fetchContactsInfo} = require('../controller/userEmergencyController');

const userEmeregencyRouter = express.Router();

userEmeregencyRouter.post('/addEmergencyContact', sendContactsInfo);
userEmeregencyRouter.get('/getEmergencyContacts', fetchContactsInfo);

module.exports = userEmeregencyRouter;