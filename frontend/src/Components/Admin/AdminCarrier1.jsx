import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaEdit,
  FaBriefcase,
  FaClock,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminCarrier1.css";

const AdminCarrier1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
const [job, setJob] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`https://internal-website-rho.vercel.app/api/jobs/${id}`)
    .then((res) => res.json())
    .then((data) => {

      const normalized = {
        _id: data._id,
        title: data.jobTitle,
        category: data.department,
        type: data.jobType,
        location: data.location || [],
        description: data.roleOverview,
        responsibilities: data.responsibilities || [],
        skills: Array.isArray(data.preferredSkills)
          ? data.preferredSkills
          : [data.preferredSkills], // convert string to array
        salary: data.salary,
        level: data.experience,
        qualification: data.qualification,
        email: data.contactOrEmail,
        status: data.status,
        deadline: data.deadline,
        tags: [], // API doesn't have tags, keep empty array
      };

      setJob(normalized);
      setEditableJob(normalized);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching job:", err);
      setLoading(false);
    });
}, [id]);


  // const initialRole = location.state?.role || "frontend";
  // const [selectedRole, setSelectedRole] = useState(initialRole);
  const [isEditing, setIsEditing] = useState(false);
  const [editableJob, setEditableJob] = useState({});


  // ⭐ Prevent crash when job is deleted or wrong role is passed
  if (!job) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Job Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "15px",
            padding: "10px 18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const handleEditToggle = () => {
    setEditableJob(job);
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setEditableJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...editableJob[field]];
    updatedArray[index] = value;
    setEditableJob((prev) => ({ ...prev, [field]: updatedArray }));
  };

 

  const handleSave = async () => {
  try {
    const response = await fetch(`https://internal-website-rho.vercel.app/api/jobs/${job._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editableJob),
    });

    if (response.ok) {
      alert("Job updated successfully");
      setIsEditing(false);
      navigate(-1); // or refresh jobs page
    } else {
      alert("Error updating job");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error");
  }
};


 
  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${job.title}" job?`
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(`https://internal-website-rho.vercel.app/api/jobs/${job._id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Job deleted successfully");
      navigate(-1);
    } else {
      alert("Error deleting job");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error");
  }
};
if (loading) return <h2 style={{ textAlign: "center", marginTop: "30px" }}>Loading...</h2>;
if (!job || !editableJob) return null;
if (!editableJob) return null;

  return (
    <div className="career-container">
      <div className="career-header">
        <div>
          {isEditing ? (
            <>
              <input
                type="text"
                value={editableJob.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <input
                type="text"
                value={editableJob.level}
                onChange={(e) => handleChange("level", e.target.value)}
              />
            </>
          ) : (
            <>
              <h1>{job.title}</h1>
              <p>{job.level}</p>
            </>
          )}
        </div>

        <div className="edit-buttons">
          {isEditing ? (
            <></>
          ) : (
            <>
              <button className="edit-btn" onClick={handleEditToggle}>
                <FaEdit /> Edit
              </button>
              <button
                className="delete-btn"
                onClick={handleDelete}
                style={{ backgroundColor: "red", color: "white" }}
              >
                <FaTimes /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="career-info">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editableJob.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
            <input
              type="text"
              value={editableJob.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
            <input
              type="text"
              value={editableJob.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
            />
            <input
              type="text"
              value={editableJob.location.join(", ")}
              onChange={(e) => handleChange("location", e.target.value.split(","))}
            />
          </>
        ) : (
          <>
            <span><FaBriefcase /> {job.category}</span>
            <span><FaClock /> {job.type}</span>
            <span><FaRupeeSign /> {job.salary}</span>
            <span><FaMapMarkerAlt /> {job.location}</span>
          </>
        )}
      </div>

      <div className="career-section">
        <h2>Job Description</h2>
        {isEditing ? (
          <textarea
            value={editableJob.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        ) : (
          <p>{job.description}</p>
        )}
      </div>

      <div className="career-section">
        <h2>Key Responsibilities</h2>
        <ul>
          {editableJob.responsibilities.map((item, index) => (
            <li key={index}>
              <FaCheckCircle />
              {isEditing ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("responsibilities", index, e.target.value)
                  }
                />
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="career-section">
        <h2>Preferred Skills</h2>
        <ul>
          {editableJob.skills.map((item, index) => (
            <li key={index}>
              <FaCheckCircle />
              {isEditing ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("skills", index, e.target.value)
                  }
                />
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      </div>
      {isEditing && (
        <div className="bottom-buttons">
          <button className="save-btn-rh" onClick={handleSave}>
            <FaSave /> Save
          </button>
          <button className="cancel-btn-hr" onClick={handleEditToggle}>
                 Cancel
          </button>

        </div>
      )}
    </div>
  );
};

export default AdminCarrier1;
