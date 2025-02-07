const mongoose = require('mongoose');

// ✅ Get `userModel` directly from Mongoose (Avoid Circular Dependency)
const userModel = mongoose.model('userModel');

module.exports.postSignUp = async function postSignUp(req, res) {
    try {
        console.log("🟢 Received signup request:", req.body);

        let { name, email, password, confirmPassword } = req.body;

        // ✅ Check if any field is empty
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // ✅ Ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
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
