import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Getstart from './Getstart.jsx';
import Intro from './intro.jsx';
import EmployeeLogin from './EmployeeLogin.jsx';
import EmployeeSignup from './EmployeeSignup.jsx';
import Getfreeinfo from './getfreeinfo.jsx';
import Hirerhome from './Hirerhome.jsx';
import HirerLogin from './HirerLogin.jsx';
import HirerSignup from './HirerSignup.jsx';
import Freehome from './freehome.jsx';
import Profile from './profile.jsx';
import ProjectDetails from './project.jsx';
import view_project from './view_project.jsx' // Make sure the path is correct

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('loggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

  }, []);
  const useremail = localStorage.getItem('email');
  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/freelancer/home" /> : <Getstart />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/employeelogin" element={<EmployeeLogin />} />
        <Route path="/employeesignup" element={<EmployeeSignup />} />
        <Route path="/hirerlogin" element={<HirerLogin />} />
        <Route path="/hirersignup" element={<HirerSignup />} /> 
        <Route path="/freelancer/info" element={<Getfreeinfo />} />
        <Route path="/hirer/home" element={<Hirerhome />} />
        <Route path="/freelancer/home" element={<Freehome />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/projects/:projectid" Component={ProjectDetails} />
        <Route path="/view_project/:projectid" Component={view_project} />
        </Routes>
    </Router>
  );

}