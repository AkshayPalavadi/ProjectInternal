import React, { useState } from "react";
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
  const initialRole = location.state?.role || "frontend";
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [isEditing, setIsEditing] = useState(false);

  const [jobData, setJobData] = useState({
    frontend: {
      title: "Frontend Developer",
      level: "Fresher",
      category: "Software IT",
      type: "Full time",
      salary: "4,00,000 - 8,40,000",
      location: "Hyderabad",
      description:
        "A Frontend Developer creates the user-facing parts of websites or web apps using HTML, CSS, and JavaScript. They turn UI/UX designs into functional interfaces and ensure responsive design and cross-browser compatibility.",
      responsibilities: [
        "Develop and maintain the front-end functionality of web applications.",
        "Implement responsive design principles.",
        "Collaborate with designers and backend developers.",
      ],
      skills: [
        "Strong knowledge of HTML5, CSS3, JavaScript (ES6+).",
        "Experience with React or Vue.js.",
        "Familiarity with Git and GitHub.",
      ],
      tags: ["Full time", "Commerce", "New York", "Corporate", "Location"],
    },
    backend: {
      title: "Backend Developer",
      level: "Mid-level",
      category: "Software IT",
      type: "Full time",
      salary: "6,00,000 - 12,00,000",
      location: "Bangalore",
      description:
        "A Backend Developer builds and maintains the server-side logic, databases, and APIs.",
      responsibilities: [
        "Develop and manage server-side components and APIs.",
        "Design and maintain databases and data models.",
        "Integrate front-end elements with backend logic.",
      ],
      skills: [
        "Proficiency in Node.js, Express, or Django.",
        "Strong database knowledge (MySQL, MongoDB).",
        "Experience with RESTful API design.",
      ],
      tags: ["Backend", "Full time", "Node.js", "Database", "Server"],
    },
    webdev: {
      title: "Web Developer",
      level: "Fresher / Junior",
      category: "IT / Software",
      type: "Full time",
      salary: "3,60,000 - 6,00,000",
      location: "Chennai",
      description:
        "A Web Developer designs, builds, and maintains websites and web applications.",
      responsibilities: [
        "Design and develop user-friendly websites.",
        "Implement front-end and back-end functionality.",
        "Collaborate with UI/UX designers for layout improvements.",
      ],
      skills: [
        "HTML, CSS, JavaScript, and React basics.",
        "Knowledge of PHP or Node.js.",
        "Database management with MySQL or MongoDB.",
      ],
      tags: ["Web", "Developer", "Full stack", "Responsive", "Teamwork"],
    },
    uiux: {
      title: "UI/UX Designer",
      level: "Fresher / Mid-Level",
      category: "Design / Creative",
      type: "Full time",
      salary: "4,00,000 - 9,00,000",
      location: "Pune",
      description:
        "A UI/UX Designer focuses on user experience and visual design for intuitive interfaces.",
      responsibilities: [
        "Design visually appealing interfaces.",
        "Conduct user research and usability testing.",
        "Create wireframes, prototypes, and design systems.",
      ],
      skills: [
        "Proficiency in Figma, Adobe XD, or Sketch.",
        "Understanding of UX principles.",
        "Wireframing and prototyping skills.",
      ],
      tags: ["Design", "UI", "UX", "Prototyping", "Creative"],
    },
    content: {
      title: "Content Writer",
      level: "Fresher / Junior",
      category: "Media / Marketing",
      type: "Full time",
      salary: "3,00,000 - 6,00,000",
      location: "Remote / Mumbai",
      description:
        "A Content Writer creates engaging and SEO-friendly content for websites and blogs.",
      responsibilities: [
        "Write and edit website, blog, and marketing content.",
        "Conduct research on industry-related topics.",
        "Optimize content for SEO and readability.",
      ],
      skills: [
        "Excellent writing and grammar skills.",
        "Basic SEO knowledge.",
        "Creative storytelling and editing.",
      ],
      tags: ["Writing", "SEO", "Marketing", "Content", "Remote"],
    },
  });

  const job = jobData[selectedRole];
  const [editableJob, setEditableJob] = useState(job);

  // Toggle edit mode
  const handleEditToggle = () => {
    setEditableJob(job);
    setIsEditing(!isEditing);
  };

  // For single field changes
  const handleChange = (field, value) => {
    setEditableJob((prev) => ({ ...prev, [field]: value }));
  };

  // For array fields (responsibilities, skills, tags)
  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...editableJob[field]];
    updatedArray[index] = value;
    setEditableJob((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // Save the edited job
  const handleSave = () => {
    setJobData((prev) => ({
      ...prev,
      [selectedRole]: editableJob,
    }));
    setIsEditing(false);
  };
  const handleDelete = () => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete the entire "${job.title}" job?`
  );

  if (confirmDelete) {
    setJobData((prev) => {
      const updated = { ...prev };
      delete updated[selectedRole]; // Remove entire job
      return updated;
    });

    // Navigate back after deleting
    navigate(-1);
  }
};


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
              value={editableJob.location}
              onChange={(e) => handleChange("location", e.target.value)}
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
        <h2>Professional Skills</h2>
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

      <div className="career-section">
        <h2>Tags</h2>
        <div className="career-tags">
          {editableJob.tags.map((tag, index) =>
            isEditing ? (
              <input
                key={index}
                type="text"
                value={tag}
                onChange={(e) =>
                  handleArrayChange("tags", index, e.target.value)
                }
              />
            ) : (
              <span key={index}>{tag}</span>
            )
          )}
        </div>
      </div>
      {isEditing && (
  <div className="bottom-buttons">
    <button className="save-btn" onClick={handleSave}>
      <FaSave /> Save
    </button>
    <button className="cancel-btn" onClick={handleEditToggle}>
      <FaTimes /> Cancel
    </button>
  </div>
)}


      
    </div>
  );
};

export default AdminCarrier1;
