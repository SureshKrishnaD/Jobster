// Required packages
const mongoose = require('mongoose');
const Order = require('../userSchema/schema_orders');
const Hirer = require('../userSchema/schema_hirer');
const Employee = require('../userSchema/schema_employee');
const Project = require('../userSchema/schema_projects');

// Logic for storing the orders
const fetchAndStoreData = async (req, res) => {
  try {
    // Extract parameters from req.body
    const { projectId, hirermail, employeemail } = req.body;

    // Fetch the relevant documents using correct query syntax
    const project = await Project.findById(projectId);
    console.log(project);
    const hirer = await Hirer.findOne({ email: hirermail });
    console.log(hirer);
    const employee = await Employee.findOne({ email: employeemail });
    console.log(employee);

    // Check if all documents exist
    if (!hirer) {
      return res.status(404).json({ error: `Hirer with email ${hirermail} not found` });
    }
    if (!employee) {
      return res.status(404).json({ error: `Employee with email ${employeemail} not found` });
    }
    if (!project) {
      return res.status(404).json({ error: `Project with ID ${projectId} not found` });
    }

    // Prepare data to be stored in the Order collection
    const combinedData = {
      Hid: hirer._id,
      Wid: employee._id,
      Pid: project._id,
    };

    // Store the combined data in the Order collection
    const newOrder = new Order(combinedData);
    await newOrder.save();
    console.log("Order saved successfully");

    // Update the "Applied_by" field of the project document
    if (!project.Applied_by.includes(employee._id)) {
      project.Applied_by.push(employee._id);
      await project.save();
      console.log("Project updated successfully");
    }

    // Update the "project_applied" field of the employee document
    if (!employee.project_applied.includes(project._id)) {
      employee.project_applied.push(project._id);
      await employee.save();
      console.log("Employee updated successfully");
    }

    res.status(200).json({ msg: "Successfully ordered and updated the project and employee" });
  } catch (error) {
    console.error('Error fetching and storing data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Exporting the fetchAndStoreData function
module.exports = fetchAndStoreData;
