import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiPlus, FiMapPin, FiClock, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AdminCareers.css";
import AdminJobform from "./AdminJobform";

const AdminCareer = () => {
  const navigate = useNavigate();
  const [activeStatTab, setActiveStatTab] = useState("applied");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);

  const appliedData = [
    { month: "Jan", applied: 1 },
    { month: "Feb", applied: 2 },
    { month: "Mar", applied: 2 },
    { month: "Apr", applied: 2 },
    { month: "May", applied: 1 },
    { month: "Jun", applied: 2 },
    { month: "Jul", applied: 1 },
    { month: "Aug", applied: 1 },
    { month: "Sep", applied: 2 },
    { month: "Oct", applied: 4 },
  ];

  const viewData = [
    { month: "Jan", views: 120 },
    { month: "Feb", views: 140 },
    { month: "Mar", views: 110 },
    { month: "Apr", views: 160 },
    { month: "May", views: 130 },
    { month: "Jun", views: 150 },
    { month: "Jul", views: 135 },
    { month: "Aug", views: 170 },
    { month: "Sep", views: 120 },
    { month: "Oct", views: 155 },
  ];

  const [jobs, setJobs] = useState([
    { id: 1, title: "Frontend Developer", type: "Full-time", exp: "Fresher", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad" },
    { id: 2, title: "Backend Developer", type: "Full-time", exp: "2 yrs Experience", salary: "₹5,00,000 - ₹8,00,000", location: "Bangalore" },
    { id: 3, title: "Web Developer", type: "Full-time", exp: "1 yr Experience", salary: "₹3,60,000 - ₹6,00,000", location: "Chennai" },
    { id: 4, title: "UI/UX Designer", type: "Full-time", exp: "Fresher", salary: "₹4,00,000 - ₹9,00,000", location: "Pune" },
    { id: 5, title: "Content Writer", type: "Remote", exp: "Fresher", salary: "₹3,00,000 - ₹6,00,000", location: "Mumbai" },
  ]);

  const [showJobForm, setShowJobForm] = useState(false);

  const handleAddJob = (jobData) => {
    const newJob = {
      id: Date.now(),
      title: jobData.jobTitle,
      type: jobData.employmentType,
      exp: jobData.experience || "Fresher",
      salary: jobData.salary || "Not Mentioned",
      location: jobData.location,
    };
    setJobs((prev) => [...prev, newJob]);
    setShowJobForm(false);
  };

  const getRoleFromTitle = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes("frontend")) return "frontend";
    if (lower.includes("backend")) return "backend";
    if (lower.includes("web")) return "webdev";
    if (lower.includes("ui")) return "uiux";
    if (lower.includes("content")) return "content";
    return "frontend";
  };

  // Determine applied jobs for the selected month
  const selectedIndex = selectedMonthIndex !== null ? selectedMonthIndex : appliedData.length - 1;
  const appliedToShow = appliedData[selectedIndex].applied;

  // Total applied up to selected month
  const totalApplied = appliedData.slice(0, selectedIndex + 1).reduce((sum, item) => sum + item.applied, 0);

  // On Hold and Hired placeholders
  const onHold = Math.floor(appliedToShow * 0.2);
  const hired = Math.floor(appliedToShow * 0.1);

  // Percentage change from previous month
  const percentageChange = selectedIndex > 0
    ? (((appliedData[selectedIndex].applied - appliedData[selectedIndex - 1].applied) / appliedData[selectedIndex - 1].applied) * 100).toFixed(0)
    : "+0";

  return (
    <div className="admincareers-carriers-page">
      {showJobForm ? (
        <div className="admincareers-job-form-wrapper">
          <button className="admincareers-back-btn" onClick={() => setShowJobForm(false)}>
            ← Back
          </button>
          <AdminJobform onSubmitJob={handleAddJob} />
        </div>
      ) : (
        <>
          {/* ===== Job Summary ===== */}
          <div className="admincareers-carriers-summary">
            <div
              className="admincareers-summary-card clickable"
              onClick={() => navigate("/admin/jobApplicants")}
            >
              <h4>Total Applied Jobs</h4>
              <p>{totalApplied}</p>
              <span>{percentageChange}%</span>
            </div>
            <div
              className="admincareers-summary-card clickable"
              onClick={() => navigate("/admin/JobApplied")}
            >
              <h4>Jobs Applied</h4>
              <p>{appliedToShow}</p>
              <span>{percentageChange}%</span>
            </div>
            <div
              className="admincareers-summary-card clickable"
              onClick={() => navigate("/admin/onhold")}
            >
              <h4>On Hold</h4>
              <p>{appliedToShow}</p>
              <span>{percentageChange}%</span>
            </div>

            <div onClick={()=> navigate("/admin/hired")} className="admincareers-summary-card">
              <h4>Hired</h4>
              <p>{hired}</p>
              <span>{hired > 0 ? "+3%" : "0%"}</span>
            </div>
            
          </div>

          {/* ===== Job Statistics ===== */}
          <div className="admincareers-job-statistics">
            <h3>Job Statistics</h3>

            <div className="admincareers-stat-tabs">
              <button
                className={activeStatTab === "applied" ? "active" : ""}
                onClick={() => setActiveStatTab("applied")}
              >
                Job Applied
              </button>
              <button
                className={activeStatTab === "view" ? "active" : ""}
                onClick={() => setActiveStatTab("view")}
              >
                Job View
              </button>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={activeStatTab === "applied" ? appliedData : viewData}
              >
                <XAxis dataKey="month" />
                <Tooltip />
                {activeStatTab === "applied" ? (
                  <Bar
                    dataKey="applied"
                    fill="#02238fff"
                    radius={[6, 6, 0, 0]}
                    onClick={(data, index) => {
                      setSelectedMonthIndex(index);
                      setActiveStatTab("applied");
                    }}
                  />
                ) : (
                  <Bar dataKey="views" fill="#0c3fe6ff" radius={[6, 6, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== Current Openings ===== */}
          <div className="admincareers-current-openings">
            <div className="admincareers-openings-header">
              <h3>Current Openings</h3>
              <button
                className="admincareers-post-job-btn"
                onClick={() => setShowJobForm(true)}
              >
                <FiPlus /> Post New Job
              </button>
            </div>

            <div className="admincareers-jobs-list">
              {jobs.map((job) => (
                <div key={job.id} className="admincareers-job-card">
                  <h4>{job.title}</h4>
                  <div className="admincareers-job-info">
                    <p><FiBriefcase /> {job.type}</p>
                    <p><FiClock /> {job.exp}</p>
                    <p>₹ {job.salary}</p>
                    <p><FiMapPin /> {job.location}</p>
                  </div>
                  <div className="admincareers-job-actions">
                    <button
                      className="admincareers-btn-details"
                      onClick={() =>
                        navigate("/admin/carriers1", {
                          state: { role: getRoleFromTitle(job.title) },
                        })
                      }
                    >
                      Job Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCareer;
