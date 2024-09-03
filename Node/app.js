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

// Enable CORS for all routes
app.use(cors());
  

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

