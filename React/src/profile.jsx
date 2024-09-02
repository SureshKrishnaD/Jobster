import './freelancer.css';
import backbtn from './assets/backbtn.svg';
import dp from './assets/dp.svg';
import { LiaEyeSolid } from "react-icons/lia";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Profile() {
    const navigate = useNavigate();
    const username = localStorage.getItem('name') || "userexample";
    const email = localStorage.getItem('mail') || "userexample@gmail.com";
    const [skills, setSkills] = useState(localStorage.getItem('userskills') || "Skills");
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [view, setView] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    
    const API_URL = process.env.REACT_APP_FRONTEND_URL;
    
    const logout = () => {
        localStorage.removeItem('name');
        localStorage.removeItem('mail');
        localStorage.removeItem('token');
        localStorage.removeItem('loggedin');
        navigate('/freelancer/home');
    };

    const handleSave = async () => {
        setIsEditable(false);
        const updatedProfile = {
            email: email,
            skills: skills
        };

        try {
            const response = await fetch('${API_URL}/api/updateemployee', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile)
            });

            if (response.ok) {
                console.log('Profile updated successfully');
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const fetchAppliedProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/fetchapplied?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched projects:', data.projects);
                setAppliedProjects(data.projects);
            } else {
                console.error('Failed to fetch applied projects');
            }
        } catch (error) {
            console.error('Error fetching applied projects:', error);
        }
    };

    useEffect(() => {
        fetchAppliedProjects(); // Fetch projects when component mounts
    }, []); // Empty dependency array to run only once

    const getImageForTech = (tech) => {
        switch (tech) {
            case 'React':
                return './assets/reactbg.svg';
            case 'HTML':
                return './assets/htmlbg.svg';
            case 'Flutter':
                return './assets/flutterbg.svg';
            case 'Figma':
                return './assets/figmabg.svg';
            case 'Python':
                return './assets/pythonbg.svg';
            default:
                return './assets/defaultbg.svg';
        }
    };

    return (
        <>
            <div className="userprofilecon">
                <nav className='userprofilenav'>
                    <img onClick={() => window.history.back()} src={backbtn} alt="Back" />
                    <p onClick={logout} className='signup'>Log out</p>
                </nav>
                <div className="profilecard">
                    <img src={dp} alt="" className="userdp" />
                    <div className="userinfo">
                        <p className="username">{username}</p>
                        <p className="usermail">{email}</p>
                    </div>
                    <div onClick={() => setView(true)} className="usercardoptions">
                        <LiaEyeSolid />
                    </div>
                </div>
                {view && (
                    <div className="viewprofileouter">
                        <div className="viewprofileinner">
                            <img className='viewuserdp' src={dp} alt="" />
                            <p className='viewinfo viewusername'>{username}</p>
                            <p className='viewinfo viewusermail'>{email}</p>
                            <p
                                className={`viewinfo viewuserskills ${isEditable ? 'editable' : ''}`}
                                contentEditable={isEditable}
                                onBlur={(e) => setSkills(e.target.innerText)}
                                placeholder="Skills"
                            >
                                {skills}
                            </p>
                            <p className='viewinfo viewusertype'>Freelancer</p>
                        </div>
                        <div className="viewoptioncon">
                            <p onClick={isEditable ? handleSave : () => setIsEditable(true)} className="viewopbtn">
                                {isEditable ? 'Save' : 'Edit'}
                            </p>
                            <p onClick={() => setView(false)} className="viewopbtn">Close</p>
                        </div>
                    </div>
                )}
                {/* <div className="viewprofileuseroptionsconout"> */}
                    {/* <div className="viewprofileuseroptionscon"> */}
                        {/* No longer needed for fetching applied projects */}
                        {/* <p className='viewprofileuseroptions bellop'><FaRegBell /></p> */}
                    {/* </div> */}
                {/* </div> */}
                <div className="projectscon">
                    <h2>Applied Projects</h2>
                    {appliedProjects.length > 0 ? (
                        appliedProjects.map((project) => (
                            <div key={project._id} className="ex">
                                {/* Uncomment this line if tech images are needed */}
                                {/* <img src={getImageForTech(project.tech)} alt={`${project.tech} Background`} className="projectbg" /> */}
                                <div className="projectinfo">
                                    <p className='projecttopic'>{project.title}</p>
                                    <p className="projectdeadline">{new Date(project.deadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No projects applied to yet.</p>
                    )}
                </div>
            </div>
        </>
    );
}
