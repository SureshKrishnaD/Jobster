const express = require('express');
const mongoose = require('mongoose');
const Employee = require('../userSchema/schema_employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

// Use JSON middleware to parse JSON requests
app.use(express.json());

// Logic for employee signup
const employeesignup = async (req, res) => {
    const { name, email, pass } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(pass, salt);
    const employee = await new Employee({ name, email, pass: hashPass });
    await employee.save();
    res.send("Successfully inserted");
};

// Logic for employee login
const employeelogin = async (req, res) => {
    console.log("employeelogin");
    const { email, pass } = req.body;

    console.log("Request Body:", req.body); 

    try {
        const employee_login = await Employee.findOne({ email });
        console.log("email", employee_login);
        if (!employee_login) {
            return res.status(400).send("User not found");
        }
        const ismatch = await bcrypt.compare(pass, employee_login.pass);
        if (!ismatch) {
            return res.status(400).send("Invalid credentials");
        }
        // const token = jwt.sign({ email: employee_login.email }, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });

        // res.json({ token });
        res.json({message:"Logged in",username: employee_login.name});

    } catch (err) {
        console.log(err);
        res.status(500).send("Error: " + err.message);
    }
};

// Logic for updating employee skills
const employeeskills = async (req, res) => {
    try {

        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

        // Decode the token to get the email
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded Token:', decodedToken); // Log the entire decoded token

        const email = decodedToken.email; // Extract email from the token
        console.log('Decoded Email:', email);

        const selectedOpportunities = req.body.selectedOpportunities;

        if (!email) {
            return res.status(400).json({ message: 'Invalid token, email not found' });
        }

        // Find the freelancer using the email from the decoded token
        const freelancer = await Employee.findOne({ email });
        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        // Update freelancer's skills
        freelancer.skills.push(...selectedOpportunities);
        await freelancer.save();

        res.status(200).json({ message: 'Opportunities updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Bio and Skills Route
const updateemployee =  async (req, res) => {
    const { email, skills } = req.body;

    try {
        const updatedUser = await Employee.findOneAndUpdate(
            { email: email },
            { skills: skills },
            { new: true }
        );

        if (updatedUser) {
            res.json({ updatedUser });
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send('Error updating profile: ' + err.message);
    }
};

// Exporting the employee signup, login, and skill update functions
module.exports = { employeesignup, employeelogin, employeeskills,updateemployee };
