import React, { useState } from "react";
import {
  FaSuitcase,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaGraduationCap,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetail.css";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    category: "Software IT",
    experience: "2+ Years",
    salary: "₹4,00,000 - ₹6,00,000",
    location: "Hyderabad",
    jobType: "Full Time",
    description:
      "We’re looking for a skilled Frontend Developer to design and build responsive web interfaces using React.js. You’ll work closely with designers and backend developers to create seamless user experiences.",
    responsibilities: [
      "Develop responsive and interactive UI components using React.js.",
      "Collaborate with UI/UX designers to implement modern designs.",
      "Optimize applications for performance and scalability.",
      "Work closely with backend developers for API integration.",
      "Test and debug code for cross-browser compatibility.",
    ],
  },
  {
    id: 2,
    title: "Content Writer",
    category: "Media & Communication",
    experience: "1+ Years",
    salary: "₹2,50,000 - ₹4,00,000",
    location: "Remote / Hyderabad",
    jobType: "Full Time",
    description:
      "We are seeking a creative Content Writer to produce engaging blog posts, website content, and social media updates that align with our brand voice and business goals.",
    responsibilities: [
      "Create compelling and SEO-friendly content for blogs, websites, and social media.",
      "Research industry-related topics and trends.",
      "Collaborate with marketing and design teams to illustrate articles.",
      "Edit and proofread content for accuracy and readability.",
      "Ensure consistent tone and messaging across all content formats.",
    ],
  },
  {
    id: 3,
    title: "Backend Developer",
    category: "Software IT",
    experience: "3+ Years",
    salary: "₹5,00,000 - ₹8,00,000",
    location: "Bangalore",
    jobType: "Full Time",
    description:
      "We are hiring a Backend Developer experienced in Node.js and Express to design APIs, manage databases, and ensure high performance and responsiveness to requests from the frontend.",
    responsibilities: [
      "Develop and maintain server-side logic using Node.js and Express.",
      "Design and integrate RESTful APIs.",
      "Manage and optimize databases (MongoDB/MySQL).",
      "Ensure application security and scalability.",
      "Collaborate with frontend developers for smooth integration.",
    ],
  },
  {
    id: 4,
    title: "Web Developer",
    category: "Information Technology",
    experience: "1-3 Years",
    salary: "₹3,00,000 - ₹5,00,000",
    location: "Chennai",
    jobType: "Full Time",
    description:
      "We’re looking for a Web Developer to build and maintain functional, attractive websites and web applications for our clients using modern technologies.",
    responsibilities: [
      "Build responsive and user-friendly web pages using HTML, CSS, and JavaScript.",
      "Work with frameworks like React or Angular.",
      "Optimize website performance for speed and scalability.",
      "Debug and fix issues across browsers and platforms.",
      "Collaborate with designers and developers on new features.",
    ],
  },
  {
    id: 5,
    title: "UI/UX Designer",
    category: "Design & Creative",
    experience: "2+ Years",
    salary: "₹4,50,000 - ₹7,00,000",
    location: "Hyderabad",
    jobType: "Full Time",
    description:
      "We’re seeking a talented UI/UX Designer to craft user-centric designs and improve user experience for web and mobile applications.",
    responsibilities: [
      "Design user interfaces for web and mobile applications.",
      "Conduct user research and translate findings into design improvements.",
      "Create wireframes, prototypes, and mockups using Figma or Adobe XD.",
      "Collaborate with developers to implement designs.",
      "Maintain consistency of design systems and visual identity.",
    ],
  },
  {
    id: 6,
    title: "Python Developer",
    category: "Software Development",
    experience: "2-4 Years",
    salary: "₹4,50,000 - ₹7,50,000",
    location: "Pune",
    jobType: "Full Time",
    description:
      "We are looking for a Python Developer to write efficient, reusable, and reliable code for back-end services, APIs, and data-driven applications.",
    responsibilities: [
      "Develop backend services and APIs using Python frameworks (Django/Flask).",
      "Integrate data storage solutions like PostgreSQL or MongoDB.",
      "Write clean, testable, and efficient code.",
      "Collaborate with front-end teams and data scientists.",
      "Participate in code reviews and optimize performance.",
    ],
  },
];

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ added this line
  const job = jobs.find((job) => job.id === parseInt(id));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  if (!job) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Job not found!</h2>;
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleApply = () => {
    navigate("/apply"); // ✅ navigate to /apply page
  };

  return (
    <div className="job-detail-container">
      {/* Sidebar */}
      <aside className="sidebar-jd">
        <h2>Job Overview</h2>

        <div className="overview-item">
          <FaSuitcase className="icon" />
          <div>
            <p className="label">Job Title</p>
            <p className="value">{job.title}</p>
          </div>
        </div>

        <div className="overview-item">
          <FaBriefcase className="icon" />
          <div>
            <p className="label">Category</p>
            <p className="value">{job.category}</p>
          </div>
        </div>

        <div className="overview-item">
          <FaClock className="icon" />
          <div>
            <p className="label">Experience</p>
            <p className="value">{job.experience}</p>
          </div>
        </div>

        <div className="overview-item">
          <FaGraduationCap className="icon" />
          <div>
            <p className="label">Degree</p>
            <p className="value">B.Tech</p>
          </div>
        </div>

        <div className="overview-item">
          <FaMoneyBillWave className="icon" />
          <div>
            <p className="label">Offered Salary</p>
            <p className="value">{job.salary}</p>
          </div>
        </div>

        <div className="overview-item">
          <FaMapMarkerAlt className="icon" />
          <div>
            <p className="label">Location</p>
            <p className="value">{job.location}</p>
          </div>
        </div>

        {/* Send Message Form */}
        <div className="send-message-form">
          <h3>Send Us a Message</h3>
          <form onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows={4} required></textarea>
            <button type="submit" className="send-btn">Send Message</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-section">
          <div className="job-header">
            <h2>{job.title}</h2>
            <p className="experience">{job.experience}</p>
            <div className="job-tags">
              <span>{job.category}</span>
              <span>{job.jobType}</span>
              <span>{job.salary}</span>
              <span>{job.location}</span>
            </div>
          </div>
          <button className="apply-btn" onClick={handleApply}>Apply now</button> {/* ✅ added onClick */}
        </div>

        {/* Job Description */}
        <section className="job-section">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </section>

        {/* Key Responsibilities */}
        <section className="job-section">
          <h3>Key Responsibilities</h3>
          <ul>
            {job.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default JobDetail;
