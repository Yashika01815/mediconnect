require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const userModel = mongoose.model('userModel');
const twilio = require('twilio');

module.exports.sendContactsInfo = async function sendContactsInfo(req, res) {
    try {
        const { email , name, phone } = req.body; // Get email from session storage
        console.log("email",email);
        console.log("name",name);
        console.log("phone",phone);

        if (!email) {
            return res.json({ message: "Unauthorized: Email not provided" });
        }

        // 🔍 Find the user by email
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        // 🔹 Add new contact to the emergencyContacts array
        user.emergencyContacts.push({ name, phone });

        // 🔄 Save the updated user document
        await user.save();

        res.json({ message: "Emergency contact added successfully", contacts: user.emergencyContacts });
        return; 
    } catch (error) {
        console.error("❌ Error adding emergency contact:", error);
        res.json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports.fetchContactsInfo = async function fetchContactsInfo(req, res) {
    try {
        const email = req.query.email;// Get email from session storage
       // console.log("fetched email", email);
        if (!email) {
            return res.json({ message: "Unauthorized: Email not provided" });
        }

        // 🔍 Find the user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        res.json({ contacts: user.emergencyContacts });
    } catch (error) {
        console.error("❌ Error fetching emergency contacts:", error);
        res.json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports.sendEmergencyAlertsInfo = async function sendEmergencyAlertsInfo(req, res){
    
}