require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailValidator = require('email-validator');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();

// ✅ CORS Configuration
const allowedOrigins = ['http://192.168.1.102:5500', 'http://192.168.1.104:5500', 'http://192.168.1.105:5500', 'http://192.168.1.100:5500', 'http://192.168.1.100:5501', 'http://192.168.1.103:5501', 'http://192.168.1.102:5501'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ Define User Schema (Must be before exports)
const userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate:function(){
            return emailValidator.validate(this.email);
        } 
    },
    password: { 
        type: String, 
        required: true, 
        minLength: 8 
    },
    confirmPassword: { 
        type: String, 
        required: true, 
        minLength: 8 
    },  
    firstLogin: {
            type: Boolean,
            default: true
    },
    resetToken: {type:String, default:null},
    emergencyContacts: [
        {
            name: { type: String, required: true, default:null },
            phone: { type: String, required: true, minLength:10,default:null }
        }
    ],
    contactMsg :[
        {
            msg : {type: String, default:null},
            createdAt: { type: Date, default: null }
        }
    ]
});

userSchema.methods.createResetToken=function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    console.log(this.resetToken);
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function(password, confirmPassword){
    this.password= password;
    this.confirmPassword= confirmPassword;
    this.resetToken =undefined;
}

// ✅ Register Model before Exporting
mongoose.model('userModel', userSchema);

const userRouter = require('../routers/userRouter');
app.use('/signup', userRouter);

const userEmergencyRouter = require('../routers/userEmergencyRouter');
app.use('/emergency', userEmergencyRouter);

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// ✅ MongoDB Connection
const db_link = process.env.MONGO_URL;
mongoose.connect(db_link, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Database connected"))
    .catch((err) => console.error("❌ Connection error:", err));


    app.get('/login', function(req, res) {
        res.redirect("/logIn.html")
    })

module.exports = app;
