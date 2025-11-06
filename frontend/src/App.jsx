import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SidebarLayout from "./Components/SidebarLayout.jsx";
import Home from "./Components/Home.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Leaves from "./Components/Leaves.jsx";
// import Profile from "./Components/Profile.jsx";
import Login from "./Components/Login.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import Admin from "./Components/Admin.jsx"
import Register from "./Components/Register.jsx";
import EmployeeReview from "./component/EmployeeReview.jsx";
import PerformanceManagement from "./Components/PerformanceManagement.jsx";
import PersonApp from "./component/PersonApp.jsx";
import TimeSheet from "./Components/TimeSheet.jsx";


import AdminSidebarLayout from "./Components/Admin/AdminSidebarLayout.jsx";
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
import AdminEmployees from "./Components/Admin/AdminEmployees.jsx";
import AdminProjects from "./Components/Admin/AdminProjects.jsx";
import AdminCareer from "./Components/Admin/AdminCareers.jsx";
import AdminCarrier1 from "./Components/Admin/AdminCarrier1.jsx";
import AdminJobform from "./Components/Admin/AdminJobform.jsx";
import AdminJobApplicants from "./Components/Admin/AdminJobapplicants.jsx";
import MonthJobApplicants from "./Components/Admin/MonthJobApplicants.jsx";
import AdminJobApplied from "./Components/Admin/AdminJobApplied.jsx";
import AdminHiredApplicants from "./Components/Admin/AdminHiredApplicants.jsx";
import AdminOnHold from "./Components/Admin/AdminOnHold.jsx";

import AdminReports from "./Components/Admin/AdminReports.jsx";
import LeavesAdmin from "./Components/Admin/LeavesAdmin.jsx";
import AttendanceEmp from "./Components/Admin/AttendanceEmp.jsx";
import LeavesEmp from "./Components/Admin/LeavesEmp.jsx";
import EmployeeDetails from "./Components/Admin/employee/EmployeeDetails.jsx";

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

  // Keep login and role synced with localStorage
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("userRole", userRole);
  }, [userRole]);

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

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/register" element={<Register />} />

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
          <Route path="timesheet" element={<TimeSheet />} />
          <Route path="performancemanagement" element={<PerformanceManagement />} />
          <Route
            path="leaves"
            element={
              <Leaves
              />
            }
          />

          

          <Route
  path="profile"
  element={
    localStorage.getItem("applicationSubmitted") === "true" ? (
      <EmployeeReview />
    ) : (
      <PersonApp />
    )
  }
/>
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            isLoggedIn && userRole === "admin" ? <AdminSidebarLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="employees/:id" element={<EmployeeDetails />} />
          <Route path="careers" element={<AdminCareer />} />
                    <Route path="jobform" element={<AdminJobform />} />
          <Route path="carriers1" element={<AdminCarrier1 />} />
          <Route path="jobapplicants" element={<AdminJobApplicants />} />
        
        <Route path="monthjobs" element={<MonthJobApplicants />} />

        <Route path="jobapplied" element={<AdminJobApplied />} />
        <Route path="hired" element={<AdminHiredApplicants />} />
        <Route path="onhold" element={<AdminOnHold/>} />
          <Route
            path="projects"
            element={
              <AdminProjects
                employees={adminEmployees}
              />
            }
          />
          <Route path="reports" element={<AdminReports />} />
          <Route path="leavesAdmin" element={<LeavesAdmin />} />
          <Route path="leaves" element={<LeavesEmp />} />
          <Route path="attendance" element={<AttendanceEmp />} />
        </Route>


        {/* Default redirect */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isLoggedIn
                  ? userRole === "admin"
                    ? "/admin"
                    : "/employee/home"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
