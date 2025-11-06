import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EmployeeDetails.css";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState({
    personal: false,
    professional: false,
  });
  const [updatedData, setUpdatedData] = useState({});

  // --- Simulated Static Employee Data (same as AdminEmployees) ---
  useEffect(() => {
    const staticData = [
      {
        id: "1",
        empId: "E001",
        personal: {
          firstName: "Akshay",
          lastName: "Patil",
          phone: "9876543210",
          email: "akshay.patil@example.com",
          address: "Pune, Maharashtra",
        },
        professional: {
          designation: "Software Engineer",
          managerName: "Riya Sharma",
          projectAssigned: "Time Tracker",
          assignedDate: "2024-05-15",
        },
      },
      {
        id: "2",
        empId: "E002",
        personal: {
          firstName: "Neha",
          lastName: "Verma",
          phone: "9865321470",
          email: "neha.verma@example.com",
          address: "Delhi",
        },
        professional: {
          designation: "UI/UX Designer",
          managerName: "Rajesh Kumar",
          projectAssigned: "HR Portal",
          assignedDate: "2024-07-10",
        },
      },
      {
        id: "3",
        empId: "E003",
        personal: {
          firstName: "Rahul",
          lastName: "Mehta",
          phone: "9856741230",
          email: "rahul.mehta@example.com",
          address: "Mumbai",
        },
        professional: {
          designation: "Frontend Developer",
          managerName: "Riya Sharma",
          projectAssigned: "Performance Dashboard",
          assignedDate: "2024-06-01",
        },
      },
      {
        id: "4",
        empId: "E004",
        personal: {
          firstName: "Sneha",
          lastName: "Iyer",
          phone: "9845236987",
          email: "sneha.iyer@example.com",
          address: "Bangalore",
        },
        professional: {
          designation: "Backend Developer",
          managerName: "Karan Singh",
          projectAssigned: "Employee Portal",
          assignedDate: "2024-08-20",
        },
      },
      {
        id: "5",
        empId: "E005",
        personal: {
          firstName: "Vikram",
          lastName: "Das",
          phone: "9834567890",
          email: "vikram.das@example.com",
          address: "Hyderabad",
        },
        professional: {
          designation: "QA Engineer",
          managerName: "Karan Singh",
          projectAssigned: "Timesheet Automation",
          assignedDate: "2024-09-10",
        },
      },
    ];

    // find employee by ID from URL
    const found = staticData.find((e) => e.id === id);
    setEmp(found || null);
    setUpdatedData(found || {});
    setLoading(false);
  }, [id]);

  if (loading) return <p>Loading employee data...</p>;
  if (!emp) return <p>Employee not found</p>;

  const handleEditToggle = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (section, field, value) => {
    setUpdatedData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = (section) => {
    setEmp(updatedData);
    setEditMode((prev) => ({ ...prev, [section]: false }));
    alert("✅ Details updated successfully!");
  };

  const personal = updatedData.personal || {};
  const professional = updatedData.professional || {};

  return (
    <div className="employeedetails-dashboard-layout">
      <div className="employeedetails-employee-details-container">
        {/* ===== HEADER ===== */}
        <div className="employeedetails-employee-header">
          <img
            src={personal.photo || "https://i.ibb.co/5Y8N8tL/avatar.png"}
            alt={personal.firstName}
            className="employeedetails-emp-photo"
          />
          <div className="employeedetails-emp-info">
            <p>
              <strong>Name:</strong> {personal.firstName} {personal.lastName}
            </p>
            <p>
              <strong>Employee ID:</strong> {emp.empId}
            </p>
            <p>
              <strong>Phone:</strong> {personal.phone}
            </p>
            <p>
              <strong>Email:</strong> {personal.email}
            </p>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="employeedetails-tabs">
          <span
            className={`tab ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal
          </span>
          <span
            className={`tab ${activeTab === "professional" ? "active" : ""}`}
            onClick={() => setActiveTab("professional")}
          >
            Professional
          </span>
        </div>

        {/* ===== PERSONAL TAB ===== */}
        {activeTab === "personal" && (
          <div className="employeedetails-education-info">
            <div className="employeedetails-info-header">
              <h3>Personal Information</h3>
              <span
                className="employeedetails-edit-icon"
                onClick={() => handleEditToggle("personal")}
              >
                ✎
              </span>
            </div>

            {Object.entries(personal).map(([key, value]) => (
              <p key={key}>
                <b>{key.replace(/([A-Z])/g, " $1")}:</b>{" "}
                {editMode.personal ? (
                  <input
                    type="text"
                    value={value || ""}
                    onChange={(e) =>
                      handleInputChange("personal", key, e.target.value)
                    }
                  />
                ) : (
                  value || "N/A"
                )}
              </p>
            ))}

            {editMode.personal && (
              <button
                className="employeedetails-save-btn"
                onClick={() => handleSave("personal")}
              >
                Save
              </button>
            )}
          </div>
        )}

        {/* ===== PROFESSIONAL TAB ===== */}
        {activeTab === "professional" && (
          <div className="employeedetails-education-info">
            <div className="employeedetails-info-header">
              <h3>Professional Details</h3>
              <span
                className="employeedetails-edit-icon"
                onClick={() => handleEditToggle("professional")}
              >
                ✎
              </span>
            </div>

            {Object.entries(professional).map(([key, value]) => (
              <p key={key}>
                <b>{key.replace(/([A-Z])/g, " $1")}:</b>{" "}
                {editMode.professional ? (
                  <input
                    type={key === "assignedDate" ? "date" : "text"}
                    value={value || ""}
                    onChange={(e) =>
                      handleInputChange("professional", key, e.target.value)
                    }
                  />
                ) : (
                  value || "N/A"
                )}
              </p>
            ))}

            {editMode.professional && (
              <button
                className="employeedetails-save-btn"
                onClick={() => handleSave("professional")}
              >
                Save
              </button>
            )}
          </div>
        )}

        {/* ===== BUTTONS ===== */}
        <div className="employeedetails-button-row">
          <button className="employeedetails-payroll-btn">💰 Payroll</button>
          <button className="employeedetails-leaves-btn">🗓 Leaves</button>
        </div>
      </div>
    </div>
  );
}
