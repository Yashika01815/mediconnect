const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailValidator = require('email-validator');
const crypto = require('crypto');

const app = express();

// ✅ CORS Configuration
const allowedOrigins = ['http://192.168.1.102:5500'];
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

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// ✅ MongoDB Connection
const db_link = 'mongodb+srv://admin:pxFOADAWKdmcJ16U@cluster0.d3d3w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(db_link, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Database connected"))
    .catch((err) => console.error("❌ Connection error:", err));


    app.get('/login', function(req, res) {
        res.redirect("/logIn.html")
    })

module.exports = app;
