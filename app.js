const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// passowrd - pxFOADAWKdmcJ16U      
const db_link = 'mongodb+srv://admin:pxFOADAWKdmcJ16U@cluster0.d3d3w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(db_link)
.then(function(db){
    console.log(db);
    console.log("db connected");
})
.catch(function(err){
    console.error(err);
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});