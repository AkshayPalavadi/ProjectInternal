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
<<<<<<< HEAD
import AttendanceEmp from "./Components/Admin/AttendanceEmp.jsx";
import LeavesEmp from "./Components/Admin/LeavesEmp.jsx";
import EmployeeDetails from "./Components/Admin/employee/EmployeeDetails.jsx";
import OfferLetterPage from "./Components/Admin/OfferLetterPage.jsx";
import ResumeDetails from "./Components/Admin/ResumeDetails.jsx";

// -----------------------
// Helpers
// -----------------------

=======
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
>>>>>>> 0b40a69e161d35125ae11544ef3d22f36faae9a6

const allApplicants = [
    {
      id: "001",
      name: "N.Gangadhar",
      appliedPosition: "Frontend Developer",
      appliedDate: "2025-01-10",
      email: "gangadhar@gmail.com",
      skills: "HTML, React JS, Java",
      experience: "0yrs",
      location: "Hyderabad",
      reference: "LinkedIn",
      status: "Pending",
      reason: "N/A",
      contact: "9000000001",
      month: "september",
      resume: "/resumes/gangadhar_resume.pdf",
    },

    {
      
      id: "002",
      name: "R.Jagadeesh",
      appliedPosition: "Python Developer",
      appliedDate: "2025-01-12",
      email: "jagadeesh@gmail.com",
      skills: "Python, React JS, Java",
      experience: "2yrs",
      location: "Hyderabad",
      reference: "Employee Referral",
      status: "Selected",
      reason: "Good Skills",
      contact: "9000000002",
      month: "september",
      resume: "/resumes/jagadeesh_resume.pdf",
    },

    {
      id: "003",
      name: "N.Tatajii",
      appliedPosition: "Full Stack Developer",
      appliedDate: "2025-01-05",
      email: "tataji@example.com",
      skills: "Python, React JS, Java, SQL",
      experience: "1yr",
      location: "Chennai",
      reference: "Naukri",
      status: "Rejected",
      reason: "Insufficient Experience",
      contact: "9000000003",
      month: "october",
      resume: "/resumes/tatajii_resume.pdf",
    },

    {
      id: "004",
      name: "A.Likhith",
      appliedPosition: "React Native Developer",
      appliedDate: "2025-01-07",
      email: "likhith@example.com",
      skills: "React Native, JS, NodeJS",
      experience: "1.5yrs",
      location: "Bangalore",
      reference: "LinkedIn",
      status: "Pending",
      reason: "N/A",
      contact: "9000000004",
      month: "october",
      resume: "/resumes/likhith_resume.pdf",
    },

    {
      id: "005",
      name: "A.Sushma",
      appliedPosition: "MERN Stack Developer",
      appliedDate: "2025-01-18",
      email: "sushma@example.com",
      skills: "MongoDB, NodeJS, React",
      experience: "0yrs",
      location: "Hyderabad",
      reference: "Employee Referral",
      status: "Selected",
      reason: "Good Learning Ability",
      contact: "9000000005",
      month: "october",
      resume: "/resumes/sushma_resume.pdf",
    },

    {
      id: "006",
      name: "P.Devi",
      appliedPosition: "UI Developer",
      appliedDate: "2025-01-20",
      email: "devi@example.com",
      skills: "HTML, CSS, JavaScript",
      experience: "2yrs",
      location: "Mumbai",
      reference: "Naukri",
      status: "Selected",
      reason: "Good Portfolio",
      contact: "9000000006",
      month: "January",
      resume: "/resumes/devi_resume.pdf",
    },

    {
      id: "007",
      name: "K.Sravani",
      Jobtitle : "Frontend Developer",
      appliedDate: "2025-02-01",
      email: "sravani@example.com",
      skills: "HTML, React JS, Java",
      experience: "0yrs",
      location: "Hyderabad",
      reference: "LinkedIn",
      status: "Pending",
      reason: "N/A",
      contact: "9000000007",
      month: "February",
      resume: "/resumes/sravani_resume.pdf",
    },

    {
      id: "008",
      name: "Karthik",
      appliedPosition: "Python Developer",
      appliedDate: "2025-02-04",
      email: "karthik@example.com",
      skills: "Python, React JS, Java",
      experience: "2yrs",
      location: "Hyderabad",
      reference: "Naukri",
      status: "Rejected",
      reason: "Communication Issues",
      contact: "9000000008",
      month: "February",
      resume: "/resumes/karthik_resume.pdf",
    },

    {
      id: "009",
      name: "N.Madhu",
      appliedPosition: "Full Stack Developer",
      appliedDate: "2025-04-01",
      email: "madhu@example.com",
      skills: "Python, React JS, Java, SQL",
      experience: "1yr",
      location: "Chennai",
      reference: "LinkedIn",
      status: "Selected",
      reason: "Clear Concepts",
      contact: "9000000009",
      month: "April",
      resume: "/resumes/madhu_resume.pdf",
    },

    {
      id: "010",
      name: "Mahindra",
      appliedPosition: "React Native Developer",
      appliedDate: "2025-04-08",
      email: "mahindra@example.com",
      skills: "React Native, JS, NodeJS",
      experience: "1.5yrs",
      location: "Bangalore",
      reference: "Direct",
      status: "Pending",
      reason: "N/A",
      contact: "9000000010",
      month: "April",
      resume: "/resumes/mahindra_resume.pdf",
    },

    {
      id: "011",
      name: "Rohith",
      appliedPosition: "Backend Developer",
      appliedDate: "2025-05-12",
      email: "rohith@example.com",
      skills: "MongoDB, NodeJS, React",
      experience: "0yrs",
      location: "Hyderabad",
      reference: "Employee Referral",
      status: "Rejected",
      reason: "Low Technical Score",
      contact: "9000000011",
      month: "May",
      resume: "/resumes/rohith_resume.pdf",
    },

    {
      id: "012",
      name: "P.Akshay",
      appliedPosition: "UI Developer",
      appliedDate: "2025-06-03",
      email: "akshay@example.com",
      skills: "HTML, CSS, JavaScript",
      experience: "2yrs",
      location: "Mumbai",
      reference: "LinkedIn",
      status: "Pending",
      reason: "N/A",
      contact: "9000000012",
      month: "June",
      resume: "/resumes/akshay_resume.pdf",
    },

    {
      id: "013",
      name: "Vaishnavi",
      appliedPosition: "React Native Developer",
      appliedDate: "2025-06-14",
      email: "vaishnavi@example.com",
      skills: "React Native, JS, NodeJS",
      experience: "1.5yrs",
      location: "Bangalore",
      reference: "Naukri",
      status: "Selected",
      reason: "Strong Skills",
      contact: "9000000013",
      month: "June",
      resume: "/resumes/vaishnavi_resume.pdf",
    },

    {
      id: "014",
      name: "K.Lavanya",
      appliedPosition: "Backend Developer",
      appliedDate: "2025-07-01",
      email: "lavanya@example.com",
      skills: "MongoDB, NodeJS, React",
      experience: "0yrs",
      location: "Hyderabad",
      reference: "Direct",
      status: "Pending",
      reason: "N/A",
      contact: "9000000014",
      month: "July",
      resume: "/resumes/lavanya_resume.pdf",
    },

    {
      id: "015",
      name: "Sathvika",
      appliedPosition: "UI/UX Developer",
      appliedDate: "2025-08-05",
      email: "sathvika@example.com",
      skills: "HTML, CSS, JavaScript",
      experience: "2yrs",
      location: "Mumbai",
      reference: "LinkedIn",
      status: "Selected",
      reason: "Excellent UI Skills",
      contact: "9000000015",
      month: "August",
      resume: "/resumes/sathvika_resume.pdf",
    },

    {
      id: "016",
      name: "Suji",
      appliedPosition: "React Native Developer",
      appliedDate: "2025-08-18",
      email: "suji@example.com",
      skills: "React Native, JS, NodeJS",
      experience: "1.5yrs",
      location: "Bangalore",
      reference: "Referral",
      status: "Pending",
      reason: "N/A",
      contact: "9000000010",
      month: "August",
      resume: "/resumes/suji_resume.pdf",
    },

    {
      id: "017",
      name: "M.Eswari",
      appliedPosition: "MERN Developer",
      appliedDate: "2025-03-22",
      email: "eswari@example.com",
      skills: "MongoDB, NodeJS, React",
      experience: "0yrs",
      location: "Hyderabad",
      reference: "LinkedIn",
      status: "Selected",
      reason: "Good Attitude",
      contact: "9000000011",
      month: "March",
      resume: "/resumes/eswari_resume.pdf",
    },

    {
      id: "018",
      name: "Bhargavi",
      appliedPosition: "Frontend Developer",
      appliedDate: "2025-03-28",
      email: "bhargavi@example.com",
      skills: "HTML, CSS, JavaScript",
      experience: "2yrs",
      location: "Mumbai",
      reference: "Direct",
      status: "Rejected",
      reason: "Not a Match",
      contact: "9000000012",
      month: "March",
      resume: "/resumes/bhargavi_resume.pdf",
    },
  ];

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
          <Route path="hired/OfferLetter/:employeeName"element={<OfferLetterPage />} />
          <Route path="onhold" element={<AdminOnHold />} />
          <Route path="resume/:id" element={<ResumeDetails applicants={allApplicants} />} />

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

