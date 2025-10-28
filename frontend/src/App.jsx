import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SidebarLayout from "./Components/SidebarLayout.jsx";
import Home from "./Components/Home.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Leaves from "./Components/Leaves.jsx";
// import Profile from "./Components/Profile.jsx";
import Login from "./Components/Login.jsx";
import Admin from "./Components/Admin.jsx"
import PersonApp from "../PersonApp.jsx";


function App() {
  // Leaves & Attendance
  const totalLeaves = 12;
  const totalDays = 30;

  const [leavesUsed, setLeavesUsed] = useState(4);
  const [absentDays, setAbsentDays] = useState(4);

  // Employee data
  const [employeeData, setEmployeeData] = useState({
    totalLeaves,
    leavesUsed,
    presentDays: totalDays - absentDays,
    absentDays,
    projects: [],
  });

  // Sidebar/Profile
  const [userName, setUserName] = useState("User Name");
  const [userPhoto, setUserPhoto] = useState(null);

  // Login & Role
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || "");
  const [employeeId, setEmployeeId] = useState(() => parseInt(localStorage.getItem("employeeId")) || null);

  // Admin employees (for assigning projects)
  const [adminEmployees] = useState([
    { id: 2, name: "Akshay" },
    { id: 3, name: "Sathvika" },
    { id: 4, name: "Sravani" },
  ]);

  // Admin projects stored in localStorage
  const [adminProjects, setAdminProjects] = useState([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setAdminProjects(storedProjects);

    // Filter projects for current employee
    if (employeeId) {
      const assignedProjects = storedProjects.filter(p => p.assignedEmployees.includes(employeeId));
      setEmployeeData(prev => ({ ...prev, projects: assignedProjects }));
    }
  }, [employeeId]);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
        />

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            isLoggedIn && userRole === "employee" ? (
              <SidebarLayout
                userName={userName}
                setUserName={setUserName}
                userPhoto={userPhoto}
                setUserPhoto={setUserPhoto}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route
            path="dashboard"
            element={
              <Dashboard
                projects={employeeData.projects}
              />
            }
          />
          <Route
            path="leaves"
            element={
              <Leaves
                totalLeaves={totalLeaves}
                leavesUsed={leavesUsed}
                setLeavesUsed={setLeavesUsed}
                absentDays={absentDays}
                setAbsentDays={setAbsentDays}
              />
            }
          />
          <Route
            path="profile"
            element={<PersonApp/>}
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            isLoggedIn && userRole === "admin" ? <Admin /> : <Navigate to="/login" replace />
          }
        >
          
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
