const express = require('express');
const {sendContactsInfo, fetchContactsInfo, sendEmergencyAlertsInfo} = require('../controller/userEmergencyController');

const userEmeregencyRouter = express.Router();

userEmeregencyRouter.post('/addEmergencyContact', sendContactsInfo);
userEmeregencyRouter.get('/getEmergencyContacts', fetchContactsInfo);

userEmeregencyRouter.post('/sendEmergencyAlert', sendEmergencyAlertsInfo);

module.exports = userEmeregencyRouter;