import './freelancer.css';
import './Hirer.css';
import backbtn from './assets/backbtn.svg';
import dp from './assets/dp.svg';
import { LiaEyeSolid } from "react-icons/lia";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import reactbg from './assets/reactbg.svg';
import htmlbg from './assets/htmlbg.svg';
import flutterbg from './assets/flutterbg.svg';
import figmabg from './assets/figmabg.svg';
import pythonbg from './assets/pythonbg.svg';
import defaultbg from './assets/defaultbg.svg';

const API_URL = process.env.REACT_APP_FRONTEND_URL;

export default function Profile() {
    const [addProject, setAddProject] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [requirements, setRequirements] = useState(''); // New state for requirements
    const [selectedDomain, setSelectedDomain] = useState('');
    const [selectedTech, setSelectedTech] = useState('');
    const [techOptions, setTechOptions] = useState([]);
    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();
    const username = localStorage.getItem('username') || "user123";
    const email = localStorage.getItem('email') || "user@mail.com";
    const [bio, setBio] = useState(localStorage.getItem('skills') || "Skills");

    const logout = () => {
        localStorage.clear();
        navigate('/HirerLogin');
    };

    const [view, setView] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    
    const fetchProjects = async () => {
        try {
            const email = localStorage.getItem('email'); // Get the email from localStorage
            const response = await fetch(`${API_URL}/api/projects?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            console.log('Fetched Projects:', data);
            if (response.ok) {
                setProjects(data); // Assuming data is an array of projects
                console.log(projects)
            } else {
                console.error('Error fetching projects:', data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };
    

    

    useEffect(() => {
        fetchProjects();
        // fetchapplied();
    }, []);

    const handleDomainChange = (e) => {
        const domain = e.target.value;
        setSelectedDomain(domain);

        switch (domain) {
            case 'Programming & Tech':
                setTechOptions(['HTML', 'React']);
                break;
            case 'AI Services':
                setTechOptions(['ML', 'DL']);
                break;
            case 'Graphics & Design':
                setTechOptions(['Photoshop', '3D designs']);
                break;
            default:
                setTechOptions([]);
        }
    };

    const handlePostProject = async () => {
        const email = localStorage.getItem('email'); // Get the email from localStorage
        console.log(email);
    
        const newProject = {
            title,
            description,
            requirements,
            deadline,
            domain: selectedDomain,
            email, // Add email to the project object
        };
        console.log(newProject);
        try {
            const response = await fetch(`${API_URL}/api/addproject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProject),
            });

            console.log(response);

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                setTitle('');
                setDescription('');
                setDeadline('');
                setRequirements(''); // Clear requirements input
                setAddProject(false);
                console.log('Server response:', result);
            } else {
                console.error('Server error:', result);
            }
        } catch (error) {
            console.error('Error posting project:', error);
        }
    };

    return (
        <div className="userprofilecon">
            <nav className='userprofilenav'>
                <img onClick={() => window.history.back()} src={backbtn} alt="Back" />
                <p onClick={logout} className='signup'>Log out</p>
            </nav>

            <div className="profilecard">
                <img src={dp} alt="Profile" className="userdp" />
                <div className="userinfo">
                    <p className="username">{username}</p>
                    <p className="usermail">{email}</p>
                </div>
            </div>

            <p className='addproject' onClick={() => setAddProject(true)}>+</p>

            {addProject && (
                <div className="addprojectconout">
                    <div className="addprojectconinner">
                        <input
                            className="addprojectinp"
                            type="text"
                            placeholder='Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="addprojectinp addprojectinpdescription"
                            placeholder='Description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <textarea
                            className="addprojectinp addprojectinprequirements"
                            placeholder='Requirements'
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                        />
                        <input
                            className="addprojectinp addprojectinpdate"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                        <select className="addprojectinp addprojectinptech" onChange={handleDomainChange} value={selectedDomain}>
                            <option value="" disabled>Select Domain</option>
                            <option value="Programming & Tech">Programming & Tech</option>
                            <option value="AI Services">AI Services</option>
                            <option value="Graphics & Design">Graphics & Design</option>
                            <option value="Writing & Translating">Writing & Translating</option>
                            <option value="Music & Audio">Music & Audio</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                        </select>
                    </div>
                    <div className="viewoptioncon">
                        <p onClick={handlePostProject} className="viewopbtn">Post</p>
                        <p onClick={() => setAddProject(false)} className="viewopbtn">Discard</p>
                    </div>
                </div>
            )}

<div className="userprofileprojects">
    {projects && projects.length > 0 ? (
        projects.map((project) => (
            <div
                key={project._id}
                className="ex"
                onClick={() => navigate(`/view_project/${encodeURIComponent(project._id)}`)}
            >
                <div className="projectinfo">
                    <h3>Project Details</h3>
                    <p className='projecttopic'>{project.title}</p>
                   {/*  <p className='projectdescription'>{project.description}</p> */}
                    {/* <p className='projectrequirements'>{project.requirements}</p> */}
                    <p className="projectdeadline">{new Date(project.deadline).toLocaleDateString()}</p><hr></hr>
                    <h4>Applicants</h4>
                    <div className="appliedbydetails">
                        {Array.isArray(project.Applied_by) && project.Applied_by.length > 0 ? (
                            project.Applied_by.map((employee) => (
                                <div key={employee._id} className="employeeinfo">
                                    {/* <p className='employeename'>{employee.name}</p> */}
                                    <p className='employeeemail'>{employee.email}</p>
                                </div>
                            ))
                        ) : (
                            <p>No applicants found</p>
                        )}
                    </div>
                </div>
            </div>
        ))
    ) : (
        <p>No projects found</p>
    )}
</div>
</div>
    );
}
