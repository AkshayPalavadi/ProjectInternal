import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./Components/SidebarLayout.jsx";
import Home from "./Components/Home.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Leaves from "./Components/Leaves.jsx";
import Login from "./Components/Login.jsx";
import Admin from "./Components/Admin.jsx";
import Register from "./Components/Register.jsx";
import EmployeeDetails from "./component/EmployeeReview.jsx";
import PerformanceManagement from "./Components/PerformanceManagement.jsx";
import PersonApp from "./component/PersonApp.jsx";
import TimeSheet from "./Components/TimeSheet.jsx";
import CarrierApp from "./carrier/carrierapp.jsx";
import  ResetPassword from "./Components/ResetPassword.jsx";

function App() {
  const totalLeaves = 12;
  const totalDays = 30;

  const [leavesUsed, setLeavesUsed] = useState(4);
  const [absentDays, setAbsentDays] = useState(4);
  const [userName, setUserName] = useState("User Name");
  const [userPhoto, setUserPhoto] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || "");
  const [employeeId, setEmployeeId] = useState(() => parseInt(localStorage.getItem("employeeId")) || null);

  const [employeeData, setEmployeeData] = useState({
    totalLeaves,
    leavesUsed,
    presentDays: totalDays - absentDays,
    absentDays,
    projects: [],
  });

  const [adminProjects, setAdminProjects] = useState([]);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setAdminProjects(storedProjects);

    if (employeeId) {
      const assignedProjects = storedProjects.filter((p) =>
        p.assignedEmployees.includes(employeeId)
      );
      setEmployeeData((prev) => ({ ...prev, projects: assignedProjects }));
    }
  }, [employeeId]);

  const userEmail = localStorage.getItem("userEmail") || "";

  // ✅ Set default route logic
  const getDefaultRoute = () => {
  const currentPath = window.location.pathname;

  // ✅ If user tries to go to /carrier, send them directly to /carrier/jobs
  if (currentPath === "/carrier" || currentPath === "/carrier/") {
    return "/carrier/jobs";
  }

  // ✅ Allow all other /carrier routes to load normally (like /carrier/login, etc.)
  if (currentPath.startsWith("/carrier")) {
    return currentPath;
  }

  // ✅ Not logged in
  if (!isLoggedIn) return "/register";

  // ✅ Employee internal users
  if (userEmail.endsWith("@dhatvibs.com")) {
    return "/employee/home";
  }

  // ✅ Default external users
  return "/register";
};



  return (
    <Router>
      <Routes>
        {/* Internal Login */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
        />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Internal Employee Routes */}
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
          <Route path="dashboard" element={<Dashboard projects={employeeData.projects} />} />
          <Route path="timesheet" element={<TimeSheet />} />
          <Route path="resetpassword" element={<ResetPassword />} />

          <Route path="performancemanagement" element={<PerformanceManagement />} />
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
          <Route path="details" element={<EmployeeDetails />} />
          <Route
            path="profile"
            element={
              localStorage.getItem("applicationSubmitted") === "true" ? (
                <EmployeeDetails />
              ) : (
                <PersonApp />
              )
            }
          />
        </Route>

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            isLoggedIn && userRole === "admin" ? <Admin /> : <Navigate to="/login" replace />
          }
        />

        {/* Carrier App */}
        <Route path="/carrier/*" element={<CarrierApp />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
