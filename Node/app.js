//required packages
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');


//connecting database

const connectDB = require('../config/database');

//importing routelogic

const RouteLogic = require('../Routelogic/employee_logic');

//importing routes 

const Routes = require('../Routes/Routes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://jobster-client.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  credentials: true,  
};

// Enable CORS with specified options
app.use(cors(corsOptions));
  

//connecting database

connectDB();

app.use(express.json());

//use of api route 

app.use('/api',Routes);

// Start the server
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

