import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './freelancer.css';
import logo from 'src/assets/jobster.svg';
import search from 'src/assets/search.svg';
import dp from 'src/assets/dp.svg';
import reactbg from 'src/assets/reactbg.svg';
import htmlbg from 'src/assets/htmlbg.svg';
import flutterbg from 'src/assets/flutterbg.svg';
import figmabg from 'src/assets/figmabg.svg';
import pythonbg from 'src/assets/pythonbg.svg';
import defaultbg from 'src/assets/defaultbg.svg';
import celebrateemoji from 'src/assets/celebrate.svg';

export default function Freelancer() {
    const [filter, setFilter] = useState('All');
    const [showwelcome, setShowWelcome] = useState(true);
    const [projects, setProjects] = useState([]);
   
    const navigate = useNavigate();
    const showLoggedIn = localStorage.getItem('loggedin');
    const email = localStorage.getItem('mail');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:1234/api/allprojects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

      

        fetchProjects();
       
    }, [email]);  // Make sure to include 'email' in the dependency array

    const getImageForTech = (tech) => {
        switch (tech) {
            case 'React':
                return reactbg;
            case 'HTML':
                return htmlbg;
            case 'flutter':
                return flutterbg;
            case 'figma':
                return figmabg;
            case 'python':
                return pythonbg;
            default:
                return defaultbg;
        }
    };

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(project => project.domain === filter);

    const userProfile = () => {
        navigate(`/${email}`);
    };


    useEffect(() => {
        fetchapplied();
    }, []);
    const fetchapplied = async () => {
        try {
            const email = localStorage.getItem('email'); // Get the email from localStorage
    
            const response = await fetch(`http://localhost:1234/api/fetchapplied?email=${encodeURIComponent(email)}`);
            const data = await response.json();
    
            console.log('Fetched Applied Projects:', data);
    
            if (response.ok) {
                setProjects(data.projects); // Set the fetched projects to state
            } else {
                console.error('Error fetching applied projects:', data);
            }
        } catch (error) {
            console.error('Error fetching applied projects:', error);
        }
    };

    return (
        <>
            {showwelcome && !showLoggedIn && (
                <div className="welcomecon">
                    <div className="welcomeinner">
                        <img src={celebrateemoji} alt="Celebrate" />
                        <p className='welcometo'>Welcome to Jobster</p>
                        <p className='completeprofile'>Please login to post and apply jobs!!</p>
                        <div className="completeprofilecon">
                            <p className="completeprofileskip" onClick={() => { setShowWelcome(false); }}>Skip &gt;&gt;</p>
                            <span className="seprationline"></span>
                            <p><Link className="completeprofilenext" to='/EmployeeLogin'>Login</Link></p>
                        </div>
                    </div>
                </div>
            )}

            <div className="freehomecon">
                <div className="freehometop">
                    <nav className="freehomenav">
                        <img className='logo' src={logo} alt="Jobster Logo" />
                        {showLoggedIn ? (
                            <>
                                <img src={search} alt="Search" />
                                <img className='dp' src={dp} alt="Profile" onClick={userProfile} />
                            </>
                        ) : (
                            <>
                                <img src={search} alt="Search" />
                                <p><Link to='/EmployeeLogin' className='signup'>Login</Link></p>
                            </>
                        )}
                    </nav>
                    <ul className="domincon">
                        {/* Your filter code here */}
                    </ul>
                </div>

                <div className="projectscon">
                    <h2>All Projects</h2>
                    {filteredProjects.map((project) => (
                        <div key={project._id} className="ex" onClick={() => navigate(`/projects/${encodeURIComponent(project._id)}`)}>
                            <img src={getImageForTech(project.tech)} alt={`${project.tech} Background`} className="projectbg" />
                            <div className="projectinfo">
                                <p className='projecttopic'>{project.topic}</p>
                                <p className='projectdescription'>{project.description}</p>
                                <p className="projectdeadline">{new Date(project.deadline).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </>
    );
}
