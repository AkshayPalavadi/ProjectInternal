import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./Components/SidebarLayout.jsx";
import Home from "./Components/Home.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Leaves from "./Components/Leaves.jsx";
import Profile from "./Components/Profile.jsx";
import Login from "./Components/Login.jsx";

function App() {
  // Leaves & Attendance state
  const totalLeaves = 12;
  const [leavesUsed, setLeavesUsed] = useState(4);
  const totalDays = 30;
  const [absentDays, setAbsentDays] = useState(4);

  // Employee Data with projects
  const [employeeData, setEmployeeData] = useState({
    totalLeaves: totalLeaves,
    leavesUsed: leavesUsed,
    totalDays: totalDays,
    presentDays: totalDays - absentDays,
    absentDays: absentDays,
    projects: [],
  });

  // Temporary inputs for adding project
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("In Progress");

const calculateStatus = (startDate, duration) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + duration);

  const today = new Date();

  if (today < start) return "Not Started";
  if (today >= start && today <= end) return "In Progress";
  return "Completed";
};

const handleAddProject = () => {
  if (!projectName || !startDate || !duration) {
    alert("Please fill all fields");
    return;
  }

  const projectDuration = parseInt(duration);
  const newProject = {
    name: projectName,
    startDate,
    duration: projectDuration,
    status: calculateStatus(startDate, projectDuration),
  };

  setEmployeeData((prev) => ({
    ...prev,
    projects: [...prev.projects, newProject],
  }));

  // reset form
  setProjectName("");
  setStartDate("");
  setDuration("");
};


  // Sidebar / Profile state
  const [userName, setUserName] = useState("User Name");
  const [userPhoto, setUserPhoto] = useState(null);

  // Login & Role state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || "";
  });

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
              <>
                {/* Add project form on top */}
                <div style={{ padding: "20px" }}>
                  <h2>Add Project (App.jsx)</h2>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Duration (days)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <button onClick={handleAddProject}>Add Project</button>
                </div>

                {/* Dashboard */}
                <Dashboard
                  totalLeaves={employeeData.totalLeaves}
                  leavesUsed={employeeData.leavesUsed}
                  totalDays={employeeData.totalDays}
                  presentDays={employeeData.presentDays}
                  absentDays={employeeData.absentDays}
                  projects={employeeData.projects}
                />
              </>
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
            element={<Profile userName={userName} setUserName={setUserName} />}
          />
        </Route>

        {/* Default route: redirect to login if not logged in */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
