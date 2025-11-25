import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AdminCarrier.css";
import AdminJobform from "./AdminJobform";
import { onHoldApplicants } from "../../data";

const AdminCareer = () => {
  const navigate = useNavigate();
  const [activeStatTab, setActiveStatTab] = useState("applied");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // ✅ Chart data
  const [appliedData, setAppliedData] = useState([
    { month: "Jan", applied: 1 },
    { month: "Feb", applied: 2 },
    { month: "Mar", applied: 2 },
    { month: "Apr", applied: 2 },
    { month: "May", applied: 1 },
    { month: "Jun", applied: 2 },
    { month: "Jul", applied: 1 },
    { month: "Aug", applied: 2 },
    { month: "Sep", applied: 2 },
    { month: "Oct", applied: 3 },
  ]);

  const [viewData, setViewData] = useState([
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
  ]);

  // ✅ Ensure data for current month exists
  const ensureCurrentMonthData = () => {
    const now = new Date();
    const currentMonth = monthNames[now.getMonth()];

    setAppliedData((prev) => {
      const lastMonth = prev[prev.length - 1]?.month;
      if (lastMonth !== currentMonth) {
        return [...prev, { month: currentMonth, applied: 0 }];
      }
      return prev;
    });

    setViewData((prev) => {
      const lastMonth = prev[prev.length - 1]?.month;
      if (lastMonth !== currentMonth) {
        return [...prev, { month: currentMonth, views: 0 }];
      }
      return prev;
    });
  };

  useEffect(() => {
    ensureCurrentMonthData();
    const interval = setInterval(ensureCurrentMonthData, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Default to last month
  useEffect(() => {
    const lastIndex = appliedData.length - 1;
    setSelectedMonthIndex(lastIndex);
    setSelectedMonth(appliedData[lastIndex]?.month);
  }, [appliedData]);

  // ✅ Job list
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      type: "Full-time",
      exp: "Fresher",
      salary: "₹4,00,000 - ₹6,00,000",
      location: "Hyderabad",
      description:
        "Responsible for building responsive UI components using React, HTML, CSS, and JavaScript.",
      skills: "ReactJS, HTML5, CSS3, JavaScript",
      postedOn: new Date("2025-11-03"),
    },
    {
      id: 2,
      title: "Backend Developer",
      type: "Full-time",
      exp: "2 yrs Experience",
      salary: "₹5,00,000 - ₹8,00,000",
      location: "Bangalore",
      description: "Develop and maintain scalable APIs using Node.js and Express.",
      skills: "Node.js, Express.js, MongoDB, SQL",
      postedOn: new Date("2025-11-04"),
    },
    {
      id: 3,
      title: "Web Developer",
      type: "Full-time",
      exp: "1 yr Experience",
      salary: "₹3,60,000 - ₹6,00,000",
      location: "Chennai",
      description: "Build and optimize web applications using HTML, CSS, and JavaScript.",
      skills: "HTML, CSS, JavaScript, React",
      postedOn: new Date("2025-11-01"),
    },
    {
      id: 4,
      title: "UI/UX Designer",
      type: "Full-time",
      exp: "Fresher",
      salary: "₹4,00,000 - ₹9,00,000",
      location: "Pune",
      description: "Create intuitive and attractive designs using Figma and Adobe XD.",
      skills: "Figma, Adobe XD, Prototyping, UX Research",
      postedOn: new Date("2025-11-02"),
    },
    {
      id: 5,
      title: "Content Writer",
      type: "Remote",
      exp: "Fresher",
      salary: "₹3,00,000 - ₹6,00,000",
      location: "Mumbai",
      description: "Write engaging and SEO-friendly content for websites and blogs.",
      skills: "Content Writing, SEO, Grammar, Research",
      postedOn: new Date("2025-11-01"),
    },
  ]);

  const [showJobForm, setShowJobForm] = useState(false);

  // ✅ Add new job
  const handleAddJob = (jobData) => {
    const newJob = {
      id: Date.now(),
      title: jobData.jobTitle,
      type: jobData.employmentType,
      exp: jobData.experience || "Fresher",
      salary: jobData.salary || "Not Mentioned",
      location: jobData.location,
      description: jobData.jobDescription,
      skills: jobData.requiredSkills,
      postedOn: new Date(),
    };

    setJobs((prev) => [...prev, newJob]);

    const now = new Date();
    const currentMonth = monthNames[now.getMonth()];

    setAppliedData((prev) =>
      prev.map((d) =>
        d.month === currentMonth ? { ...d, applied: d.applied + 1 } : d
      )
    );

    setViewData((prev) =>
      prev.map((d) =>
        d.month === currentMonth
          ? { ...d, views: d.views + Math.floor(Math.random() * 50 + 10) }
          : d
      )
    );

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

  const selectedIndex =
    selectedMonthIndex !== null ? selectedMonthIndex : appliedData.length - 1;
  const appliedToShow = appliedData[selectedIndex]?.applied || 0;
  const totalApplied = appliedData
    .slice(0, selectedIndex + 1)
    .reduce((sum, item) => sum + item.applied, 0);
  const onHold = onHoldApplicants.length;
  const hired = Math.floor(6 + Math.random());

  const getDaysAgo = (postedDate) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(postedDate));
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="carriers-page">
      {showJobForm ? (
        <div className="job-form-wrapper">
          <AdminJobform onSubmitJob={handleAddJob} />
        </div>
      ) : (
        <>
          {/* ===== Summary Section ===== */}
          <div className="carriers-summary">
            {/* ✅ Send selectedMonth to JobApplicants page */}
            <div
              className="summary-card clickable"
              onClick={() =>
                navigate("/admin/jobApplicants", {
                  state: { selectedMonth, totalJobs:true },
                })
              }
            >
              <h4>Total Applied Jobs</h4>
              <p>{totalApplied}</p>
            </div>

            <div
              className="summary-card clickable"
              onClick={() =>
                navigate("/admin/monthjobs", {
                  state: { selectedMonth },
                })
              }
            >
              <h4>
                Monthly Total Applicants
                {selectedMonth && (
                  <span style={{ fontSize: "1.2rem", color: "#555" }}>
                    {" "}
                    ({selectedMonth})
                  </span>
                )}
              </h4>
              <p>Applied: {appliedToShow}</p>
            </div>

            <div
              className="summary-card clickable"
              onClick={() => navigate("/admin/onhold")}
            >
              <h4>On Hold</h4>
              <p>{onHold}</p>
            </div>

            <div
              className="summary-card clickable"
              onClick={() => navigate("/admin/hired")}
            >
              <h4>Hired</h4>
              <p>{hired}</p>
            </div>
          </div>

          {/* ===== Job Statistics ===== */}
          <div className="job-statistics">
            <h3>Job Statistics</h3>
            <div className="stat-tabs">
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
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    onClick={(data, index) => {
                      setSelectedMonthIndex(index);
                      setSelectedMonth(data.month);
                    }}
                  />
                ) : (
                  <Bar dataKey="views" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== Current Openings ===== */}
          <div className="current-openings">
            <div className="openings-header">
              <h3>Current Openings</h3>
              <button
                className="post-job-btn"
                onClick={() => setShowJobForm(true)}
              >
                <FiPlus /> Post New Job
              </button>
            </div>

            <div className="jobs-list">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <h4>{job.title}</h4>

                  <p className="job-main-line">
                    {job.type} | {job.exp} | {job.salary} | {job.location} | Posted{" "}
                    {getDaysAgo(job.postedOn)} days ago
                  </p>

                  {job.description && (
                    <p className="job-desc-line">
                      <strong>Description:</strong>{" "}
                      {job.description.length > 90
                        ? job.description.slice(0, 90) + "..."
                        : job.description}
                    </p>
                  )}

                  {job.skills && job.skills.trim() !== "" && (
                    <p className="job-skills-line">
                      <strong>Skills:</strong> {job.skills}
                    </p>
                  )}

                  <div className="job-actions">
                    <button
                      className="btn-details"
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
