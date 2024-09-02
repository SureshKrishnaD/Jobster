import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/Jobster.svg';
import create from './assets/create.svg';
import './App.css';

const API_URL = process.env.REACT_APP_FRONTEND_URL;


export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(''); 
    const navigate = useNavigate(); // To redirect after successful signup

    const handleSignup = async (e) => { // Renamed from handleLogin to handleSignup
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await fetch(`${API_URL}/api/employeesignup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, pass }),
            });

            if (response.ok) {
                window.location.href = '/EmployeeLogin'; 
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Signup failed');
            }
            
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    return (
        <>
            <img className='createimg' src={create} alt="" />
            <div className="SignupLogincon">
                <nav>
                    <img src={logo} alt="Logo" />
                    <p><Link to='/EmployeeLogin' className='signup'>Login</Link></p>
                </nav>
                <form onSubmit={handleSignup}> 
                    <h1>Sign up</h1>
                    {error && <p className="error">{error}</p>} 
                    <input
                        required
                        placeholder='UserName'
                        className='loginin'
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        required
                        placeholder='Email'
                        className='loginin'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        required
                        placeholder='Password'
                        className='loginin'
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <button className='loginin' type='submit'>Sign up</button>
                </form>
            </div>
        </>
    );
}
