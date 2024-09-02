import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './project.css';
import exampleimg from './assets/image1.jpg';
import celebrateemoji from './assets/celebrate.svg'; // Make sure to import your celebration emoji

const API_URL = process.env.REACT_APP_FRONTEND_URL;

const ProjectDetails = () => {
    const { projectid } = useParams();
    const [project, setProject] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false); // State to track order placement success


    
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${API_URL}/api/projects/${projectid}`);
                const contentType = response.headers.get("content-type");

                console.log('Response Status:', response.status);
                console.log('Content-Type:', contentType);

                if (response.ok && contentType.includes("application/json")) {
                    const data = await response.json();
                    setProject(data);
                } else {
                    const text = await response.text();
                    console.error('Non-JSON response:', text);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        fetchProject();
    }, [projectid]);

    if (project === null) {
        return <div>Loading...</div>;
    }

  
    return (
        <div className='projectconout'>
            {orderPlaced && (
                <div className="welcomecon">
                    <div className="welcomeinner">
                        <img src={celebrateemoji} alt="Celebrate" />
                        <p className='welcometo'>Your Project has been applied successfully</p>
                        <div className="completeprofilecon">
                            <p className="completeprofileskip" onClick={() => { setOrderPlaced(false); }}>Skip &gt;&gt;</p>
                            <span className="seprationline"></span>
                            <p><Link className="completeprofilenext" to='/Freelancer/home'>Continue</Link></p>
                        </div>
                    </div>
                </div>
            )}

            {!orderPlaced && (
                <>
                    <img src={exampleimg} alt="Project example" className="exampleimg" />
                    <p className='projecttopicc'>{project.title || "No title provided"}</p>
                    <p className='projecttopicc'>{project.description || "No description provided"}</p>
                    <p className='projecttopicc'>{project.domain || "No domain provided"}</p>
                    <p className='projecttopicc'>{project.requirements || "No requirements provided"}</p>
                    <p className='projecttopicc'>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Deadline not available'}</p>
                    <p style={{ display: "none" }} className='projecttopicc'>{project.hirer}</p>
                    <p className='projecttopicc last'>This is an example React project that demonstrates basic functionality. The project details are fetched from an API endpoint.</p>
                </>
            )}
        </div>
    );
};

export default ProjectDetails;
