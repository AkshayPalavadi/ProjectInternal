import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EmployeeReview.css";

export default function EmployeeReview() {
  const { id } = useParams();

  // ========================
  // 🔹 States
  // ========================
  const [personal, setPersonal] = useState(null);
  const [education, setEducation] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState({
    personal: false,
    education: false,
    professional: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================
  // 🔹 Fetch Data
  // ========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [personalRes, educationRes, professionalRes] = await Promise.all([
          fetch(`https://internal-website-rho.vercel.app/api/personal/${id}`),
          fetch(`https://internal-website-rho.vercel.app/api/education/${id}`),
          fetch(`https://internal-website-rho.vercel.app/api/professional/${id}`),
        ]);

        if (!personalRes.ok || !educationRes.ok || !professionalRes.ok) {
          throw new Error("Failed to fetch one or more data sections");
        }

        const [personalData, educationData, professionalData] = await Promise.all([
          personalRes.json(),
          educationRes.json(),
          professionalRes.json(),
        ]);

        setPersonal(personalData?.data || {});
        setEducation(educationData?.data || {});
        setProfessional(professionalData?.data || {});
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to fetch employee data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ========================
  // 🔹 Input Handlers
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

  const handleSave = async (section) => {
    try {
      const apiMap = {
        personal: "https://internal-website-rho.vercel.app/api/personal",
        education: "https://internal-website-rho.vercel.app/api/education",
        professional: "https://internal-website-rho.vercel.app/api/professional",
      };

      const dataToSend =
        section === "personal" ? personal :
        section === "education" ? education :
        professional;

      const response = await fetch(`${apiMap[section]}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Save failed");

      setEditMode((prev) => ({ ...prev, [section]: false }));
      alert(`✅ ${section.charAt(0).toUpperCase() + section.slice(1)} details saved successfully!`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save changes. Please try again.");
    }
  };

  // ========================
  // 🔹 Render Logic
  // ========================
  if (loading) return <div className="loading">⏳ Loading employee data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!personal || !education || !professional)
    return <div className="error">⚠️ No data found for employee ID: {id}</div>;

  return (
    <div className="employee-details-container">
      {/* ===== HEADER ===== */}
      <div className="employee-header">
        <img
          src={personal.photo || "https://i.ibb.co/5Y8N8tL/avatar.png"}
          alt={personal.firstName}
          className="emp-photo"
        />
        <div className="emp-info">
          <p><strong>Name:</strong> {personal.firstName} {personal.lastName}</p>
          <p><strong>Employee ID:</strong> {professional.employeeId}</p>
          <p><strong>Phone:</strong> {personal.phone}</p>
          <p><strong>Email:</strong> {personal.email}</p>
        </div>
      </div>

      {/* ===== TABS ===== */}
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
          {professional.experiences && professional.experiences.length > 0 && (
            <>
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
            </>
          )}
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
