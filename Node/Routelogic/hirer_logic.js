// Required packages
const bcrypt = require('bcrypt');
const express = require('express');
const Hirer = require('../userSchema/schema_hirer');
const mongoose = require('mongoose');

const app = express();

// Hirer signup logic
const hirersignup = async (req, res) => {
    try {
        // Hirer request body
        const { username, email, pass } = req.body;

        // Hashing the password
        const salt = await bcrypt.genSalt(10); // Corrected: Added await to bcrypt.genSalt
        const hashPass = await bcrypt.hash(pass, salt); // Corrected: Added await and proper arguments order

        // Storing in Hirer schema
        const hirer = new Hirer({ username, email, pass: hashPass });

        // Saving to Hirer database
        await hirer.save();
        res.send("Successfully inserted");
    } catch (err) {
        console.error("Error: " + err.message);
        res.status(500).send("Server error");
    }
}

// Logic for hirer login
const hirerlogin = async (req, res) => {

    const { email, pass } = req.body;

    console.log("Request Body:", req.body); 

    try {
        const hirer_login = await Hirer.findOne({ email });
        console.log("hirer", hirer_login);
        if (!hirer_login) {
            return res.status(400).send("User not found");
        }
        const ismatch = await bcrypt.compare(pass, hirer_login.pass);
        if (!ismatch) {
            return res.status(400).send("Invalid credentials");
        }
        // const token = jwt.sign({ email: employee_login.email }, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });

        // res.json({ token });
        res.json({message:"Logged in", username: hirer_login.username, email:hirer_login.email});

    } catch (err) {
        console.log(err);
        res.status(500).send("Error: " + err.message);
    }
};
// Exporting hirer signup and login
module.exports = { hirersignup, hirerlogin };
