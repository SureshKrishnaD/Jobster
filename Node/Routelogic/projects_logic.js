// Required packages
const mongoose = require('mongoose');
const Project = require('../userSchema/schema_projects');
const Hirer = require('../userSchema/schema_hirer');
const Employee = require('../userSchema/schema_employee');


// Logic for storing projects in the database
const projects = async (req, res) => {
    try {
        const { email, title, description, domain, requirements, deadline } = req.body;

        // Fetch hirer based on email
        const hirer = await Hirer.findOne({ email });

        if (!hirer) {
            return res.status(404).json({ msg: "Hirer not found" });
        }

        const hirer_id = hirer._id;

        // Create and save a new project
        const newProject = new Project({
            hirer_id,
            title,
            description,
            domain,
            requirements,
            deadline
        });

        const savedProject = await newProject.save();

        // Store the project ID in the hirer's projects array
        hirer.projects.push(savedProject._id);
        await hirer.save();

        res.status(200).json({ msg: "Project successfully registered", projectId: savedProject._id });
    } catch (error) {
        console.error("Error storing project:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const allprojects = async (req,res)=>{
    try{
       const project =  await Project.find();
        res.send(project);
        console.log("projects")
    }
    catch(err){
        res.send("err"+err.message);
    }
};

const addproject = async (req, res) => {
    const { title, description, requirements, deadline, domain, email } = req.body;

    // Check for missing fields
    if (!title || !description || !domain || !requirements || !deadline || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create a new project
        const newProject = new Project({
            title,
            description,
            requirements,
            deadline: new Date(deadline), // Ensure deadline is a valid Date object
            domain,
            hirer: email 
        });

        const savedProject = await newProject.save();
        console.log('Saved Project:', savedProject);

        // Update the user's projects array
        const updatedUser = await Hirer.findOneAndUpdate(
            { email }, // Find the user by email
            { $push: { projects: savedProject._id } }, // Add project ID to the user's projects array
            { new: true }
        );
        
        console.log('Updated User:', updatedUser);

        // Handle case where the user was not found
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with the saved project details
        res.status(201).json({ message: 'Project created successfully', project: savedProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project', details: error.message });
    }
};

const fetchproject = async(req,res)=>{
    const { email } = req.query;

    try {
        // Find projects by hirer's email
        const projects = await Project.find({ hirer: email })
            .populate({
                path: 'Applied_by', // Field to populate
                select: 'email', // Fields to select from the Employee schema
            });
        // If no projects found, return a message or empty array
        if (projects.length === 0) {
            return res.status(200).json([]); // Return an empty array if no projects are found
        }
        // const applied = projects.Applied_by;

        // const applied_by = Employee.applied;

        
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Failed to fetch projects');
    }
}

const fetchapplied = async (req, res) => {
    const { email } = req.query;  // Extract email from request body

    try {
        // Find the employee by email
        const employee = await Employee.findOne({ email });

        // If the employee is not found, return an error
        if (!employee) {
            console.log('Employee not found for email:', email);  // Debugging log
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if 'project_applied' is an array and not empty
        const projectsApplied = employee.project_applied || [];  // Ensure it's always an array
        console.log('Projects applied:', projectsApplied);  // Debugging log

        if (projectsApplied.length === 0) {
            console.log('No projects applied by the employee:', email);  // Debugging log
            return res.status(200).json({ projects: [] });  // Return empty array if no projects applied
        }

        // Fetch the project details from the Project collection using the IDs
        const projects = await Project.find({ _id: { $in: projectsApplied } });

        console.log('Projects fetched successfully:', projects);  // Debugging log

        // Respond with the project details
        res.json({ projects });
    } catch (error) {
        console.error('Error fetching applied projects:', error);  // Error log
        res.status(500).json({ message: 'Failed to fetch applied projects' });
    }
};


// Route to fetch a project by ID
const getproject = async (req, res) => {
    const { projectid } = req.params;
    console.log('Requested Project ID:', projectid);

    try {
        // Check if projectid is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectid)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Find the project by its ID
        const project = await Project.findById(projectid);
        console.log('Fetched Project:', project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Send the project details as a JSON response
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



// Exporting projects
module.exports = {projects,allprojects,addproject,fetchproject,fetchapplied,getproject};
