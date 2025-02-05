const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// passowrd - pxFOADAWKdmcJ16U      
const db_link = 'mongodb+srv://admin:pxFOADAWKdmcJ16U@cluster0.d3d3w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// mongoose.connect('mongodb+srv://admin:pxFOADAWKdmcJ16U@cluster0.d3d3w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//     useNewUrlParser: true,
//    }).then((f) => {
//     console.log("Connected");
//    }).catch((e) => {
//     console.log("Not connected = Error => ", e);
//    });

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

mongoose.connect(db_link)
    .then(() => {
        console.log("db connected");
    })
    .catch((err) => {
        console.error("Connection error:", err);
       // console.error("Topology description:", err.reason);
    });

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        required:true,
        minLength:8
    }
});

const userModel = mongoose.model('userModel', userSchema);

(async function createUser(){
    let user ={
        name :"Deepshikha",
        email: "xyza@gmail.com",
        password : "123456789",
        confirmPassword: "123456789"
    };

    let data = await userModel.create(user);
    console.log(data);
})();