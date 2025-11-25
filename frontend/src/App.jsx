import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ==== Employee Components ====
import SidebarLayout from "./Components/SidebarLayout.jsx";
import Home from "./Components/Home.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Leaves from "./Components/Leaves.jsx";
import Login from "./Components/Login.jsx";


// ==== Admin Components ====
import AdminSidebarLayout from "./Components/Admin/AdminSidebarLayout.jsx";
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
import AdminEmployees from "./Components/Admin/AdminEmployees.jsx";
import AdminProjects from "./Components/Admin/AdminProjects.jsx";
import AdminCareer from "./Components/Admin/AdminCarrier.jsx";
import AdminCarrier1 from "./Components/Admin/AdminCarrier1.jsx";
import AdminJobform from "./Components/Admin/AdminJobform.jsx";
import AdminJobApplicants from "./Components/Admin/AdminJobApplicants.jsx";
import MonthJobApplicants from "./Components/Admin/MonthJobApplicants.jsx";
import AdminJobApplied from "./Components/Admin/AdminJobApplied.jsx";
import AdminHiredApplicants from "./Components/Admin/AdminHiredApplicants.jsx";
import AdminOnHold from "./Components/Admin/AdminOnHold.jsx";
import AdminReports from "./Components/Admin/AdminReports.jsx";
import LeavesAdmin from "./Components/Admin/LeavesAdmin.jsx";
import AdminCarrier from "./Components/Admin/AdminCarrier.jsx";
import OnHold from "./Components/Admin/OnHold.jsx";
import JobApplicants from "./Components/Admin/JobApplicants.jsx";
import Hired from "./Components/Admin/Hired.jsx";
import TrainingDevelopment from "./Components/Admin/TrainingDevelopment.jsx";
import OnGoing from "./Components/Admin/OnGoing.jsx";
import InProgress from "./Components/Admin/InProgress.jsx"; 
import CompletedTraining from "./Components/Admin/CompletedTraining.jsx";
import TrainingModule from "./Components/Admin/TrainingModule.jsx"; 
import CertificatePage from "./Components/Admin/CertificatePage.jsx"; // ✅ Make sure file exists
import AdminCarrier1 from "./Components/Admin/AdminCarrier1.jsx";
import TrainingAssignment from "./Components/Admin/TrainingAssignment.jsx";
import ReportPage from "./Components/Admin/ReportPage.jsx";
import FreshersTrainingAssignment from "./Components/Admin/FreshersTrainingAssignment.jsx";

function App() {
   const [mustFill, setMustFill] = useState(false);

useEffect(() => {
  const value =
    localStorage.getItem("mustFillPersonalDetails") === "true" ||
    localStorage.getItem("mustFillEducationDetails") === "true" ||
    localStorage.getItem("mustFillProfessionalDetails") === "true";

  setMustFill(value);
}, []);

  const totalLeaves = 12;
  const totalDays = 30;

  const [leavesUsed, setLeavesUsed] = useState(4);
  const [absentDays, setAbsentDays] = useState(4);

  // ===== Employee Data =====
  const [employeeData, setEmployeeData] = useState({
    totalLeaves,
    leavesUsed,
    presentDays: totalDays - absentDays,
    absentDays,
    projects: [],
  });

  // ===== Sidebar/Profile =====
  const [userName, setUserName] = useState("User Name");
  const [userPhoto, setUserPhoto] = useState(null);

  // ===== Auth State =====
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || ""
  );
  const [employeeId, setEmployeeId] = useState(
    () => parseInt(localStorage.getItem("employeeId")) || null
  );

  // ===== Admin Employees =====
  const [adminEmployees] = useState([
    { id: 2, name: "Akshay" },
    { id: 3, name: "Sathvika" },
    { id: 4, name: "Sravani" },
  ]);

  // ===== Admin Projects =====
  const [adminProjects, setAdminProjects] = useState([]);

  // ===== Load projects from localStorage =====
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setAdminProjects(storedProjects);

    if (employeeId) {
      const assignedProjects = storedProjects.filter(
        (p) => p.assignedEmployees && p.assignedEmployees.includes(employeeId)
      );
      setEmployeeData((prev) => ({ ...prev, projects: assignedProjects }));
    }
  }, [employeeId]);

  // ===== Dark Mode =====
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const userEmail = localStorage.getItem("userEmail") || "";
  const getDefaultRoute = () => {
    const currentPath = window.location.pathname;

    // Carrier route handling
    if (currentPath === "/carrier" || currentPath === "/carrier/") {
      return "/carrier/jobs";
    }
    if (currentPath.startsWith("/carrier")) {
      return currentPath;
    }

    // Not logged in
    if (!isLoggedIn) return "/login";

    // Internal employees
    if (userEmail.endsWith("@dhatvibs.com")) {
      return "/employee/home";
    }

    // Default external users
    return "/register";
  };

  // -------------------------------
  // App Routes
  // -------------------------------
  return (
    <Router>
      <Routes>
        {/* ==== LOGIN ==== */}
        <Route
          path="/login"
          element={
            <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
          }
        />

        {/* ==== EMPLOYEE ROUTES ==== */}
        <Route
          path="/employee"
          element={
            isLoggedIn && userRole === "employee" ? (
              <SidebarLayout
                userName={userName}
                setUserName={setUserName}
                userPhoto={userPhoto}
                setUserPhoto={setUserPhoto}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home darkMode={darkMode} />} />
          <Route
            path="dashboard"
            element={
              <Dashboard projects={employeeData.projects} darkMode={darkMode} />
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
                darkMode={darkMode}
              />
            }
          />
        </Route>

        {/* ==== ADMIN ROUTES ==== */}
        <Route
          path="/admin"
          element={
            isLoggedIn && userRole === "admin" ? (
              <AdminSidebarLayout
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-employee" element={<PersonApp />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="employees/:email" element={<EmployeeDetails />} />
          <Route path="careers" element={<AdminCareer />} />
          <Route path="jobform" element={<AdminJobform />} />
          <Route path="carriers1" element={<AdminCarrier1 />} />
          <Route path="jobapplicants" element={<AdminJobApplicants />} />
          <Route path="monthjobs" element={<MonthJobApplicants />} />
          <Route path="jobapplied" element={<AdminJobApplied />} />
          <Route path="hired" element={<AdminHiredApplicants />} />
          <Route path="onhold" element={<AdminOnHold />} />
          <Route
            path="projects"
            element={
              <AdminProjects employees={adminEmployees} darkMode={darkMode} />
            }
          />
          <Route
            path="reports"
            element={<AdminReports darkMode={darkMode} />}
          />
          <Route
            path="leavesadmin"
            element={<LeavesAdmin darkMode={darkMode} />}
          />
        </Route>

        {/* Carrier Routes */}
        <Route path="/carrier/*" element={<CarrierApp />} />

        {/* Default Redirect */}
        {/* <Route
          path="*"
          element={
            <Navigate
              to={
                isLoggedIn
                  ? userRole === "admin"
                    ? "/admin"
                    : "/employee/home"
                  : "/register"
              }
              replace
            />
          }
        /> */}
{/* Catch-all route */}
<Route
  path="*"
  element={
    isLoggedIn
      ? userRole === "admin"
        ? <Navigate to="/admin/dashboard" replace />
        : <Navigate to="/employee/home" replace />
      : <Navigate to="/login" replace />
  }
/>

      </Routes>
    </Router>
  );
}

export default App;

