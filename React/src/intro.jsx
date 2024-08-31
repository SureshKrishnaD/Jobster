import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import intro from './assets/intro.mp4';
import logo from './assets/Jobster.svg';
import './App.css';

export default function Intro() {
    const [showUsertype, setShowUsertype] = useState(false);
    const [selectedUsertype, setSelectedUsertype] = useState("");
    const [showFreeinfo, setShowFreeinfo] = useState(false);
    const [selectedOpportunities, setSelectedOpportunities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowUsertype(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    function handleUsertype(userType) {
        setSelectedUsertype(userType);
        setShowUsertype(false);
        setShowFreeinfo(userType === "hirer" || userType === "Freelancer");
    }

    function handleCheckboxChange(event) {
        const value = event.target.value;
        setSelectedOpportunities(prev =>
            event.target.checked
                ? [...prev, value]
                : prev.filter(item => item !== value)
        );
    }

    const token = localStorage.getItem('token');
    localStorage.setItem('usertype', selectedUsertype);

    function intronav(action) {
        if (action === 1 || selectedOpportunities.length > 0) {
            fetch('http://localhost:1234/api/update-opportunities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ selectedOpportunities }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Opportunities saved:', data);
                    navigate(`/${selectedUsertype}/home`);
                })
                .catch(err => {
                    console.error('Error saving opportunities:', err);
                });
        } else {
            if (selectedUsertype === "hirer") {
                navigate('/hirerlogin');
            } else {
                navigate('/freelancer/home');
            }
        }
    }

    return (
        <>
            <video className="introvid" autoPlay muted preload="auto">
                <source src={intro} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {showUsertype && (
                <div className="usertype">
                    <img className='intrologo' src={logo} alt="Logo" />
                    <p onClick={() => handleUsertype("Freelancer")} className='usertypebtn'>Become a Freelancer</p>
                    <p onClick={() => handleUsertype("hirer")} className='usertypebtn'>Hire a Freelancer</p>
                </div>
            )}
            {showFreeinfo && (
                <div className="usertype">
                    <p className='questions'>What kind of opportunities <br />are you looking for?</p>
                    <ul className="freeinfocon">
                        {[
                            "Web/App Designing",
                            "Front-End Development",
                            "Back-end Development",
                            "App Development",
                            "Data Science/Data Analyst",
                            "ML/DL model",
                            "Artificial Intelligence"
                        ].map(opportunity => (
                            <li className="freeli" key={opportunity}>
                                {opportunity}
                                <input
                                    type="checkbox"
                                    name="opportunities"
                                    value={opportunity}
                                    onChange={handleCheckboxChange}
                                />
                            </li>
                        ))}
                    </ul>
                    <div className="freelibtn">
                        <p onClick={() => intronav(0)}>Skip &gt;&gt;</p>
                        <p className='nextbtn' onClick={() => intronav(1)}>Next</p>
                    </div>
                </div>
            )}
        </>
    );
}
