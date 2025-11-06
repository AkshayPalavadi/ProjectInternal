import React, { useState } from "react";
import {
  FaEdit,
  FaBriefcase,
  FaClock,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminCarrier1.css";

const AdminCarrier1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location.state?.role || "frontend";
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const jobData = {
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
        "Optimize web pages for speed and scalability.",
        "Ensure cross-browser compatibility and fix UI/UX issues.",
        "Integrate APIs and RESTful services.",
        "Participate in code reviews and maintain standards.",
      ],
      skills: [
        "Strong knowledge of HTML5, CSS3, JavaScript (ES6+).",
        "Experience with React or Vue.js.",
        "Familiarity with Git and GitHub.",
        "Understanding of REST APIs and JSON.",
        "Attention to UI/UX detail.",
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
        "A Backend Developer builds and maintains the server-side logic, databases, and APIs. They ensure smooth data flow between users and servers while optimizing application performance.",
      responsibilities: [
        "Develop and manage server-side components and APIs.",
        "Design and maintain databases and data models.",
        "Integrate front-end elements with backend logic.",
        "Ensure application scalability and performance.",
        "Implement security and data protection.",
        "Collaborate with front-end and DevOps teams.",
      ],
      skills: [
        "Proficiency in Node.js, Express, or Django.",
        "Strong database knowledge (MySQL, MongoDB).",
        "Experience with RESTful API design.",
        "Understanding of authentication and security protocols.",
        "Version control with Git.",
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
        "A Web Developer designs, builds, and maintains websites. They work with both front-end and back-end technologies to deliver user-friendly, responsive, and secure web solutions.",
      responsibilities: [
        "Design and develop user-friendly websites.",
        "Implement front-end and back-end functionality.",
        "Maintain and update existing websites.",
        "Collaborate with UI/UX designers for layout improvements.",
        "Optimize site performance and SEO.",
      ],
      skills: [
        "HTML, CSS, JavaScript, and React basics.",
        "Knowledge of PHP or Node.js.",
        "Database management with MySQL or MongoDB.",
        "Version control with Git.",
        "Basic understanding of SEO principles.",
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
        "A UI/UX Designer focuses on user experience and visual design. They create intuitive, attractive, and user-friendly interfaces using design principles and user feedback.",
      responsibilities: [
        "Design visually appealing and user-friendly interfaces.",
        "Conduct user research and usability testing.",
        "Collaborate with developers for implementation.",
        "Create wireframes, prototypes, and design systems.",
        "Ensure design consistency and accessibility.",
      ],
      skills: [
        "Proficiency in Figma, Adobe XD, or Sketch.",
        "Understanding of UX principles.",
        "Wireframing and prototyping skills.",
        "Knowledge of responsive design.",
        "Attention to detail and creativity.",
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
        "A Content Writer creates engaging and SEO-friendly content for websites, blogs, and marketing campaigns. They craft clear and compelling text aligned with the brand’s tone and audience.",
      responsibilities: [
        "Write and edit website, blog, and marketing content.",
        "Conduct research on industry-related topics.",
        "Collaborate with designers for visual alignment.",
        "Optimize content for SEO and readability.",
        "Maintain brand tone and consistency.",
      ],
      skills: [
        "Excellent writing and grammar skills.",
        "Basic SEO knowledge.",
        "Creative storytelling and editing.",
        "Research and analytical abilities.",
        "Time management and attention to detail.",
      ],
      tags: ["Writing", "SEO", "Marketing", "Content", "Remote"],
    },
  };

  const job = jobData[selectedRole];

  return (
    <div className="admincarrier1-career-container">
      <div className="admincarrier1-career-role-buttons">
        {/* <button onClick={() => setSelectedRole("frontend")}>Frontend</button> */}
        {/* <button onClick={() => setSelectedRole("backend")}>Backend</button> */}
        {/* <button onClick={() => setSelectedRole("webdev")}>Web Developer</button> */}
        {/* <button onClick={() => setSelectedRole("uiux")}>UI/UX</button> */}
        {/* <button onClick={() => setSelectedRole("content")}>Content Writer</button> */}
      </div>

      <div className="admincarrier1-career-header">
        <div>
          <h1>{job.title}</h1>
          <p>{job.level}</p>
        </div>
        <button className="admincarrier1-edit-btn">
          <FaEdit />
        </button>
      </div>

      <div className="admincarrier1-career-info">
        <span><FaBriefcase /> {job.category}</span>
        <span><FaClock /> {job.type}</span>
        <span><FaRupeeSign /> {job.salary}</span>
        <span><FaMapMarkerAlt /> {job.location}</span>
      </div>

      <div className="admincarrier1-career-section">
        <h2>Job Description</h2>
        <p>{job.description}</p>
      </div>

      <div className="admincarrier1-career-section">
        <h2>Key Responsibilities</h2>
        <ul>
          {job.responsibilities.map((item, index) => (
            <li key={index}>
              <FaCheckCircle /> {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="admincarrier1-career-section">
        <h2>Professional Skills</h2>
        <ul>
          {job.skills.map((item, index) => (
            <li key={index}>
              <FaCheckCircle /> {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="admincarrier1-career-section">
        <h2>Tags:</h2>
        <div className="admincarrier1-career-tags">
          {job.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="admincarrier1-career-back">
        {/* <button className="admincarrier1-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button> */}
      </div>
    </div>
  );
};

export default AdminCarrier1;
