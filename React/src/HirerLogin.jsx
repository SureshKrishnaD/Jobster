import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/Jobster.svg';
import create from './assets/create.svg';
import './App.css';

const API_URL = process.env.REACT_APP_FRONTEND_URL;


export default function Login() {
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // To redirect after successful login
    const usertype = localStorage.getItem('usertype');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            
            const response = await fetch(`${API_URL}/undefined/api/hirerlogin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, pass }),
            });

            if (response.ok) {
                const result = await response.json(); // Should log the received token
                if (result.message === "Logged in") {
                    localStorage.setItem("loggedin", 'true');
                    localStorage.setItem("username", result.username);
                    localStorage.setItem("email", result.email);
                    // Redirect to home page or another route
                    navigate('/hirer/home'); // Replace '/home' with the correct route
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed'); // Display error if login failed
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <>
            <img className='createimg' src={create} alt="Create" />
            <div className="SignupLogincon">
                <nav>
                    <img src={logo} alt="Logo" />
                    <p><Link to='/HirerSignup' className='signup'>Sign up</Link></p>
                </nav>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    {error && <p className="error">{error}</p>}
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
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <i><Link to='/o'>Forget Password?</Link></i>
                    <button className='loginin' type='submit'>Login</button>
                </form>
            </div>
        </>
    );
}
