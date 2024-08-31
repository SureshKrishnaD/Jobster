//package required

const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

//connecting database 
const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("SUCCESSFULLY CONNECTED");
    }
    catch(err){
        console.log("Error");
    }
}

//exporting the database

module.exports = connectDB;