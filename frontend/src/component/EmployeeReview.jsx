import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./EmployeeReview.css";

export default function EmployeeReview() {
  const { id } = useParams();

  // ========================
  // 🔹 Default States
  // ========================
  const [personal, setPersonal] = useState({
    firstName: "Lithika",
    middleName: "",
    lastName: "Devi",
    fatherName: "Ramesh",
    motherName: "Gita",
    email: "lithika@dhatvi.com",
    phone: "9848526856",
    alternativePhone: "8524906721",
    gender: "Female",
    bloodGroup: "B+",
    dob: "2003-10-17",
    maritalStatus: "Married",
    isMarried: true,
    nationality: "Indian",
    emergencyNumber: "9857223461",
    nominee1: "Gita Devi",
    nominee2: "Raj Kumar",
    currentAddress: "YR Street, Tadepalligudem",
    permanentAddress: "YR Street, Tadepalligudem",
    sameAddress: true,
    landmark: "Near Bus Stand",
    pincode: "534101",
    village: "Tadepalligudem",
    state: "Andhra Pradesh",
    aadharNumber: "987654578899",
    panNumber: "AB2356F",
    photo: "https://i.ibb.co/5Y8N8tL/avatar.png",
    aadharUpload: null,
    panUpload: null,
    marriageCertificate: null,
  });

  const [education, setEducation] = useState({
    schoolName10: "ZP High School",
    year10: "2018",
    cgpa10: "9.4",
    certificate10: null,
    interOrDiploma: "Intermediate",
    collegeName12: "Sri Chaitanya Junior College",
    year12: "2020",
    cgpa12: "9.0",
    certificate12: null,
    gapReason12: "",
    collegeNameUG: "VIT University",
    yearUG: "2024",
    cgpaUG: "8.7",
    certificateUG: null,
    gapReasonUG: "",
    hasMTech: false,
    collegeNameMTech: "",
    yearMTech: "",
    cgpaMTech: "",
    certificateMTech: null,
  });

  const [professional, setProfessional] = useState({
    employeeId: id || "EMP0124",
    dateOfJoining: "2024-07-01",
    role: "Software Engineer",
    department: "IT",
    salary: "₹6,00,000 per annum",
    hasExperience: true,
    jobType: "experienced",
    resume: null,
    skills: "React, Firebase, Node.js",
    projects: "Employee Management System",
    linkedin: "https://linkedin.com/in/lithika",
    github: "https://github.com/lithika",
    certificate: "Certified React Developer",
    achievements: "Top Performer Award 2023",
    experiences: [
      {
        companyName: "ABC Tech Solutions",
        companyLocation: "Hyderabad",
        jobTitle: "Frontend Developer",
        startDate: "2022-06-01",
        endDate: "2024-05-30",
        duration: "2 years",
        roles: "Developed web apps using React.js",
        projects: "E-commerce Dashboard",
        skills: "React, Redux, HTML, CSS",
        salary: "₹5,00,000 per annum",
        relievingLetter: null,
        salarySlips: null,
        hrName: "Anita Rao",
        hrEmail: "anita@abc.com",
        hrPhone: "9876543210",
        managerName: "Ravi Kumar",
        managerEmail: "ravi@abc.com",
        managerPhone: "9988776655",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState({ personal: false, education: false, professional: false });

  // ========================
  // 🔹 Functions
  // ========================
  const handleEditToggle = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (section, field, value, index = null) => {
    if (section === "personal") {
      setPersonal((prev) => ({ ...prev, [field]: value }));
    } else if (section === "education") {
      setEducation((prev) => ({ ...prev, [field]: value }));
    } else if (section === "professional") {
      if (index !== null) {
        const updatedExperiences = [...professional.experiences];
        updatedExperiences[index][field] = value;
        setProfessional((prev) => ({ ...prev, experiences: updatedExperiences }));
      } else {
        setProfessional((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleSave = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: false }));
    alert(`✅ ${section.charAt(0).toUpperCase() + section.slice(1)} details saved!`);
  };

  // ========================
  // 🔹 UI Layout
  // ========================
  return (
    <div className="employee-details-container">
      {/* ===== HEADER ===== */}
      <div className="employee-header">
        <img src={personal.photo} alt={personal.firstName} className="emp-photo" />
        <div className="emp-info">
          <p><strong>Name:</strong> {personal.firstName} {personal.lastName}</p>
          <p><strong>Employee ID:</strong> {professional.employeeId}</p>
          <p><strong>Phone:</strong> {personal.phone}</p>
          <p><strong>Email:</strong> {personal.email}</p>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="tabs-employee">
        <span
          className={`tab-employee ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          Personal
        </span>
        <span
          className={`tab-employee ${activeTab === "education" ? "active" : ""}`}
          onClick={() => setActiveTab("education")}
        >
          Education
        </span>
        <span
          className={`tab-employee ${activeTab === "professional" ? "active" : ""}`}
          onClick={() => setActiveTab("professional")}
        >
          Professional
        </span>
      </div>

      {/* ===== PERSONAL TAB ===== */}
      {activeTab === "personal" && (
        <div className="education-info">
          <div className="info-header">
            <h3>Personal Information</h3>
            <span className="edit-icon" onClick={() => handleEditToggle("personal")}>✎</span>
          </div>

          {Object.entries(personal).map(([key, value]) => (
            typeof value !== "object" && (
              <p key={key}>
                <b>{key.replace(/([A-Z])/g, " $1")}:</b>{" "}
                {editMode.personal ? (
                  <input
                    type={key.includes("date") ? "date" : "text"}
                    value={value || ""}
                    onChange={(e) => handleInputChange("personal", key, e.target.value)}
                  />
                ) : (
                  value?.toString() || "N/A"
                )}
              </p>
            )
          ))}

          {editMode.personal && (
            <button className="save-btn" onClick={() => handleSave("personal")}>
              Save
            </button>
          )}
        </div>
      )}

      {/* ===== EDUCATION TAB ===== */}
      {activeTab === "education" && (
        <div className="education-info">
          <div className="info-header">
            <h3>Education Details</h3>
            <span className="edit-icon" onClick={() => handleEditToggle("education")}>✎</span>
          </div>

          {Object.entries(education).map(([key, value]) => (
            typeof value !== "object" && (
              <p key={key}>
                <b>{key.replace(/([A-Z])/g, " $1")}:</b>{" "}
                {editMode.education ? (
                  <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => handleInputChange("education", key, e.target.value)}
                  />
                ) : (
                  value?.toString() || "N/A"
                )}
              </p>
            )
          ))}

          {editMode.education && (
            <button className="save-btn" onClick={() => handleSave("education")}>
              Save
            </button>
          )}
        </div>
      )}

      {/* ===== PROFESSIONAL TAB ===== */}
      {activeTab === "professional" && (
        <div className="education-info">
          <div className="info-header">
            <h3>Professional Information</h3>
            <span className="edit-icon" onClick={() => handleEditToggle("professional")}>✎</span>
          </div>

          {Object.entries(professional).map(([key, value]) => (
            key !== "experiences" &&
            typeof value !== "object" && (
              <p key={key}>
                <b>{key.replace(/([A-Z])/g, " $1")}:</b>{" "}
                {editMode.professional ? (
                  <input
                    type={key.includes("date") ? "date" : "text"}
                    value={value || ""}
                    onChange={(e) => handleInputChange("professional", key, e.target.value)}
                  />
                ) : (
                  value?.toString() || "N/A"
                )}
              </p>
            )
          ))}

          {/* Experience Section */}
          <h4>Experience</h4>
          {professional.experiences.map((exp, index) => (
            <div key={index} className="experience-block">
              {Object.entries(exp).map(([key, value]) => (
                typeof value !== "object" && (
                  <p key={key}>
                    <b>{key.replace(/([A-Z])/g, " $1")}:</b>{" "}
                    {editMode.professional ? (
                      <input
                        type={key.includes("date") ? "date" : "text"}
                        value={value || ""}
                        onChange={(e) =>
                          handleInputChange("professional", key, e.target.value, index)
                        }
                      />
                    ) : (
                      value?.toString() || "N/A"
                    )}
                  </p>
                )
              ))}
            </div>
          ))}

          {editMode.professional && (
            <button className="save-btn" onClick={() => handleSave("professional")}>
              Save
            </button>
          )}
        </div>
      )}
    </div>
  );
}
