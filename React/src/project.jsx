import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './project.css';
import exampleimg from './assets/image1.jpg';
import celebrateemoji from './assets/celebrate.svg'; // Make sure to import your celebration emoji

const ProjectDetails = () => {
    const { projectid } = useParams();
    const [project, setProject] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false); // State to track order placement success

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:1234/api/projects/${projectid}`);
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

    const sendEmailToBackend = async () => {
        const employeemail = localStorage.getItem('mail');
        const hirermail = project.hirer;
        console.log('Employee Email:', employeemail);
        console.log('Project ID:', projectid);
        console.log('Hirer Email:', hirermail);

        if (!employeemail || !hirermail) {
            console.error('Required data is missing.');
            return;
        }

        try {
            const response = await fetch('http://localhost:1234/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeemail,
                    hirermail,
                    projectId: projectid
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Order placed successfully:', data);
                setOrderPlaced(true); // Set state to true on successful order
            } else {
                const errorData = await response.json();
                console.error('Failed to place order:', errorData.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

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
                    <p onClick={sendEmailToBackend} className="applybtn">Apply Now</p>
                </>
            )}
        </div>
    );
};

export default ProjectDetails;
