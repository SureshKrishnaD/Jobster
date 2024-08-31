const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Employee = require('../userSchema/schema_employee'); // Import your Employee model

dotenv.config();

const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await Employee.findOne({ email });
        if (!user) {
            return res.status(400).send('User with this email does not exist.');
        }

        // Generate a reset token (valid for 1 hour)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create a reset link
        const resetLink = `http://localhost:1234/api/reset-password/${token}`;

        // Send email with reset link
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested for a password reset. Click the link below to reset your password:</p>
                   <a href="${resetLink}">Reset Password</a>`
        };

        await transporter.sendMail(mailOptions);

        res.send('Password reset link sent to your email.');
    } catch (err) {
        console.error('Error in forgot password:', err.message);
        res.status(500).send('Server error.');
    }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    try {
        // Check if the passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        await Employee.findByIdAndUpdate(decoded.id, { pass: hashedPass });

        res.send('Password has been reset successfully.');
    } catch (err) {
        console.error('Error in reset password:', err.message);
        res.status(500).send('Invalid or expired token.');
    }
});


module.exports = router;
