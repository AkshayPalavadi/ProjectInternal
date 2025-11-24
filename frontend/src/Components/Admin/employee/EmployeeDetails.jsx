import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "./EmployeeDetails.css";

export default function EmployeeDetails() {
  const navigate = useNavigate();

  const { email } = useParams();
  const employeeEmail = email || localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  // =====================================================
  // FIXED: Azure Blob URL Builder
  // =====================================================
  const getBlobUrl = (file) => {
    if (!file) return null;

    if (typeof file !== "string") return null;

    if (file.startsWith("http")) return file;

    return `https://empdatastorageaccount.blob.core.windows.net/empfiles/${file}`;
  };

  // =====================================================
  // STATES
  // =====================================================
  const [personal, setPersonal] = useState({});
  const [education, setEducation] = useState({});
  const [professional, setProfessional] = useState({});

  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState({
    personal: false,
    education: false,
    professional: false,
  });

  // =====================================================
  // Fetch Data
  // =====================================================
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);

        if (!employeeEmail) {
          setError("❌ Employee email missing.");
          return;
        }

        const res = await axios.get(`/api/employee/${employeeEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        if (!res.data) {
          setError("❌ No employee found.");
          return;
        }

        setPersonal(res.data.personal || {});
        setEducation(res.data.education || {});
        setProfessional(res.data.professional || {});
        console.log("PERSONAL FILES:", res.data.personal.aadharUpload.path);
console.log("EDUCATION FILES:", res.data.education);
console.log("PROFESSIONAL FILES:", res.data.professional);

      } catch (err) {
        if (err.response?.status === 401)
          setError("❌ Unauthorized – token expired.");
        else if (err.response?.status === 404)
          setError("❌ Employee not found.");
        else setError("⚠️ Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeEmail, token]);

  // =====================================================
  // Extract Files (supports string or object)
  // =====================================================
  const extractFiles = () => {
    const fileMap = {};

    const addFile = (label, file) => {
      if (!file) return;

      if (typeof file === "string") {
        if (file.trim() !== "") fileMap[label] = file;
      } else if (typeof file === "object") {
        fileMap[label] = file.name || file.url || file.path || "";
      }
    };
    console.log(fileMap);
    // Personal
    addFile("Aadhar Card", personal.aadharUpload);
    addFile("PAN Card", personal.panUpload);

    // Education
    addFile("10th Certificate", education.certificate10);
    addFile("12th Certificate", education.certificate12);
    addFile("UG Certificate", education.certificateUG);

    return fileMap;
  };
  // =====================================================
  // UI Renderers
  // =====================================================

  const handleInputChange = (section, field, value) => {
    if (section === "personal")
      setPersonal((prev) => ({ ...prev, [field]: value }));
    else if (section === "education")
      setEducation((prev) => ({ ...prev, [field]: value }));
    else if (section === "professional")
      setProfessional((prev) => ({ ...prev, [field]: value }));
  
  };

  const renderSection = (data, sectionName) => (
    <div className="education-info">
      <div className="info-header">
        <h3>{sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Info</h3>
        <span
          className="edit-icon"
          onClick={() =>
            setEditMode((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }))
          }
        >
          ✎
        </span>
      </div>

      {Object.entries(data).map(([key, value]) => {
        if (typeof value === "object") return null;

        const hidden = ["photo", "__v", "_id", "createdAt", "updatedAt"];
        if (hidden.includes(key)) return null;

        return (
          <p key={key}>
            <b>{key.replace(/([A-Z])/g, " $1")}:</b>{" "}
            {editMode[sectionName] ? (
              <input
                type={key.includes("date") ? "date" : "text"}
                value={value || ""}
                onChange={(e) => handleInputChange(sectionName, key, e.target.value)}
              />
            ) : (
              value || "N/A"
            )}
          </p>
        );
      })}

      {/* FILE LIST ONLY ON FIRST TAB */}
      {sectionName === "personal" && (
        <>
          <h3 style={{ marginTop: "1rem" }}>Uploaded Documents</h3>

          {Object.entries(extractFiles()).map(([label, fileName]) => (
            <p key={label}>
              <b>{label}:</b>{" "}
              {fileName ? (
                <a
                  href={getBlobUrl(fileName)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              ) : (
                "Not Uploaded"
              )}
            </p>
          ))}
        </>
      )}
    </div>
  );

  // =====================================================
  // Loading & Error UI
  // =====================================================

  if (loading)
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>⏳ Loading…</div>;

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        {error}
      </div>
    );

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="employee-details-container">
      <button className="back-button" onClick={() => navigate("/admin/employees")}>
        ← Back
      </button>

      {/* HEADER */}
      <div className="employee-header">
        <img
          src={personal.photo || "https://i.ibb.co/5Y8N8tL/avatar.png"}
          alt="Employee"
          className="emp-photo"
        />

        <div className="emp-info">
          <p>
            <strong>Name:</strong> {personal.firstName || "N/A"}{" "}
            {personal.lastName || ""}
          </p>
          <p>
            <strong>Email:</strong> {personal.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {personal.phone || "N/A"}
          </p>
          <p>
            <strong>Blood Group:</strong> {personal.bloodGroup || "N/A"}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-employee">
        {["personal", "education", "professional"].map((tab) => (
          <span
            key={tab}
            className={`tab-employee ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "personal" && renderSection(personal, "personal")}
      {activeTab === "education" && renderSection(education, "education")}
      {activeTab === "professional" && renderSection(professional, "professional")}
    </div>
  );
}
