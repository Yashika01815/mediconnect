require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const userModel = mongoose.model('userModel');
const twilio = require('twilio');

// ✅ Validate Twilio credentials before initializing
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.error("❌ Twilio credentials are missing! Check your .env file.");
    process.exit(1); // Stop execution if Twilio credentials are missing
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log("📞 Twilio Phone Number:", twilioPhoneNumber);
console.log("✅ TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("✅ TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Missing");

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
    try{
        const { email } = req.body;
        console.log("userEmail :", email);
        if (!twilioPhoneNumber) return res.status(500).json({ message: "Twilio phone number not configured!" });
        const user = await userModel.findOne({ email });

        if (!user || !user.emergencyContacts.length) {
            return res.status(404).json({ message: "No emergency contacts found!" });
        }

        const message = "🚨 Emergency Alert! The patient's condition is worsening. Please respond immediately!";
        const callMessageHindi = "यह एक आपातकालीन चेतावनी है। मरीज की स्थिति बिगड़ रही है। कृपया तुरंत प्रतिक्रिया दें!";
        const callMessageEnglish = "This is an emergency alert. The patient's condition is worsening. Please respond immediately!";
        for (let contact of user.emergencyContacts) {
            try{
                let formattedPhone = contact.phone.startsWith('+') 
                ? contact.phone 
                : `+91${contact.phone.replace(/\D/g, '')}`;

                console.log(`📨 Sending SMS to: ${formattedPhone}`);

                let response = await client.messages.create({
                    body: message,
                    from: twilioPhoneNumber,
                    to: formattedPhone
                });

                console.log(`✅ SMS sent! SID: ${response.sid}`);

                console.log(`📞 Making call to: ${formattedPhone}`);
        
                let callResponse = await client.calls.create({
                    twiml: `<Response>
                        <Say language="hi-IN">${callMessageHindi}</Say>
                         <Say loop="1">${callMessageHindi}</Say>
                        <Say loop="2">${callMessageEnglish}</Say>
                            </Response>`, 
                    from: twilioPhoneNumber,
                    to: formattedPhone
                });
        
                console.log(`✅ Call initiated! Call SID: ${callResponse.sid}`);

                res.json({message:"Alerts sended to emergency contacts successfully!!!"});
        

            }catch(smsError){
                console.error(`Error sending SMS to ${contact.phone}:`, smsError);
            }
        }

    }catch(error){
        console.error("Error sending emergency SMS:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}