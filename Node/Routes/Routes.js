// required packages and routes

const express = require('express');
const { employeesignup, employeelogin, employeeskills, updateemployee } = require('../Routelogic/employee_logic');
const { hirersignup, hirerlogin } = require('../Routelogic/hirer_logic');
const {projects,allprojects, addproject, fetchproject, fetchapplied,getproject} = require('../Routelogic/projects_logic');
const fetchAndStoreData = require('../Routelogic/order_logic');
const forgetPasswordRoutes = require('../Routelogic/forget_password');
const authenticate = require('../Routelogic/jwt');

const router = express.Router();

// Actual routes for the written logic
router.post('/employeesignup', employeesignup);
router.post('/employeelogin', employeelogin);
router.put('/updateemployee',updateemployee);
router.get('/allprojects',allprojects);
router.post('/hirersignup', hirersignup);
router.post('/hirerlogin', hirerlogin);
router.post('/hirerproject', projects);
router.post('/orders', fetchAndStoreData); // Use POST methodrouter.post('/addproject',addproject);
router.get('/projects',fetchproject);
router.get('/fetchapplied',fetchapplied);
router.get('/projects/:projectid', getproject);
router.post('/update-opportunities', employeeskills);
router.post('/addproject',addproject);

// Forgot and Reset Password Routes
router.use('/reset', forgetPasswordRoutes); // This will include both /forgot-password and /reset-password routes

// Exporting router
module.exports = router;
