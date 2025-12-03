// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { FiPlus } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import "./AdminCarrier.css";
// import AdminJobform from "./AdminJobform";

// const AdminCareer = () => {
//   const navigate = useNavigate();
//   const [activeStatTab] = useState("applied");
//   const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(null);

//   const [appliedData, setAppliedData] = useState([]);       // ← API monthly data
//   const [totalApplied, setTotalApplied] = useState(0);      // ← API total count
//   const [jobs, setJobs] = useState([]);

//   /* 🔹 Fetch Job List */
//   useEffect(() => {
//     fetch("https://internal-website-rho.vercel.app/api/jobs")
//       .then((res) => res.json())
//       .then((data) => setJobs(data))
//       .catch((err) => console.error("Error fetching jobs:", err));
//   }, []);

//   /* 🔹 Fetch total applied jobs */
//   // useEffect(() => {
//   //   fetch("https://internal-website-rho.vercel.app/api/applications/stats/summary")
//   //     .then((res) => res.json())
//   //     .then((data) => setTotalApplied(data.totalApplications))
//   //     .catch((err) => console.error("Error fetching summary:", err));
//   // }, []);

//   /* 🔹 Fetch total applied jobs */
// useEffect(() => {
//   fetch("https://public-website-drab-ten.vercel.app/api/applications/stats/summary")
//     .then((res) => res.json())
//     .then((data) => {
//       const total =
//         data.totalApplied ??
//         data.totalApplications ??
//         data.count ??
//         0;

//       setTotalApplied(total);
//     })
//     .catch((err) => console.error("Error fetching stats:", err));
// }, []);


//   /* 🔹 Fetch monthly applied graph data */
//   // useEffect(() => {
//   //   fetch("https://internal-website-rho.vercel.app/api/applications/stats/monthly")
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       const formatted = data.monthlyStats.map((m) => ({
//   //         month: m.month,
//   //         applied: m.count,
//   //       }));
//   //       setAppliedData(formatted);
//   //     })
//   //     .catch((err) => console.error("Error fetching monthly stats:", err));
//   // }, []);

//   useEffect(() => {
//   fetch("https://public-website-drab-ten.vercel.app/api/applications/stats/monthly")
//     .then((res) => res.json())
//     .then((data) => {
//       const formatted = data.monthlyStats.map((m) => ({
//         month: m.month,
//         applied: m.count,
//       }));
//       setAppliedData(formatted);
//     })
//     .catch((err) => console.error("Error fetching monthly stats:", err));
// }, []);


//   /* 🔹 Fetch total applied jobs */
// useEffect(() => {
//   fetch("https://public-website-drab-ten.vercel.app/api/applications/stats/summary")
//     .then((res) => res.json())
//     .then((data) => {
//       const total =
//         data.totalApplied ??
//         data.totalApplications ??
//         data.count ??
//         0;
//       setTotalApplied(total);
//     })
//     .catch((err) => console.error("Error fetching stats:", err));
// }, []);

// /* 🔹 Fetch monthly applied graph data */
// useEffect(() => {
//   fetch("https://public-website-drab-ten.vercel.app/api/applications/stats/monthly")
//     .then((res) => res.json())
//     .then((data) => {
//       const formatted = data.monthlyStats.map((m) => ({
//         month: m.month,
//         applied: m.count,
//       }));
//       setAppliedData(formatted);
//     })
//     .catch((err) => console.error("Error fetching monthly stats:", err));
// }, []);


//   /* 🔹 Auto–select last month on graph */
//   useEffect(() => {
//     if (appliedData.length > 0) {
//       const lastIndex = appliedData.length - 1;
//       setSelectedMonthIndex(lastIndex);
//       setSelectedMonth(appliedData[lastIndex].month);
//     }
//   }, [appliedData]);

//   /* 🔹 Job Form Handler */
//   const [showJobForm, setShowJobForm] = useState(false);

//   const getDaysAgo = (postedDate) => {
//     const now = new Date();
//     const diffTime = Math.abs(now - new Date(postedDate));
//     return Math.floor(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const onHold = 6; // temporary static
//   const hired = 7;  // temporary static

//   return (
//     <div className="carriers-page">
//       {showJobForm ? (
//         <div className="job-form-wrapper">
//           <AdminJobform onSubmitJob={() => setShowJobForm(false)} />
//         </div>
//       ) : (
//         <>
//           {/* Summary Section */}
//           <div className="carriers-summary">
//             <div
//               className="summary-card clickable-total-container"
//               onClick={() =>
//                 navigate("/admin/jobApplicants", {
//                   state: { selectedMonth, totalJobs: true },
//                 })
//               }
//             >
//               <h4>Total Applied Jobs</h4>
//               <p>{totalApplied}</p>
//             </div>

//             <div
//               className="summary-card clickable-monthly-container"
//               onClick={() =>
//                 navigate("/admin/monthjobs", {
//                   state: { selectedMonth },
//                 })
//               }
//             >
//               <h4>
//                 Monthly Total Applicants{" "}
//                 {selectedMonth && <span>({selectedMonth})</span>}
//               </h4>
//               <p>Applied: {appliedData[selectedMonthIndex]?.applied || 0}</p>
//             </div>

//             <div
//               className="summary-card clickable-onhold-container"
//               onClick={() => navigate("/admin/onhold")}
//             >
//               <h4>On Hold</h4>
//               <p>{onHold}</p>
//             </div>

//             <div
//               className="summary-card clickable-hired-container"
//               onClick={() => navigate("/admin/hired")}
//             >
//               <h4>Hired</h4>
//               <p>{hired}</p>
//             </div>
//           </div>

//           {/* Job Statistics */}
//           <div className="job-statistics">
//             <h3>Job Statistics</h3>

//             <div className="stat-tabs">
//               <button className="active">Job Applied</button>
//             </div>

//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={appliedData}>
//                 <XAxis dataKey="month" />
//                 <Tooltip />
//                 <Bar
//                   dataKey="applied"
//                   fill="#2563eb"
//                   radius={[6, 6, 0, 0]}
//                   onClick={(data, index) => {
//                     setSelectedMonthIndex(index);
//                     setSelectedMonth(data.month);
//                   }}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Current Openings */}
//           <div className="current-openings">
//             <div className="openings-header">
//               <h3>Current Openings</h3>
//               <button className="post-job-btn" onClick={() => setShowJobForm(true)}>
//                 <FiPlus /> Post New Job
//               </button>
//             </div>

//             <div className="jobs-list">
//               {jobs.map((job) => (
//                 <div key={job._id} className="job-card">
//                   <h4>{job.jobTitle}</h4>
//                   <p className="job-main-line">
//                     {job.jobType} | {job.experience} | ₹{job.salary} |{" "}
//                     {Array.isArray(job.location)
//                       ? job.location.join(", ")
//                       : job.location}{" "}
//                     | Posted {getDaysAgo(job.createdAt)} days ago
//                   </p>

//                   {job.roleOverview && (
//                     <p className="job-desc-line">
//                       <strong>Description:</strong>{" "}
//                       {job.roleOverview.length > 90
//                         ? job.roleOverview.slice(0, 90) + "..."
//                         : job.roleOverview}
//                     </p>
//                   )}

//                   {job.preferredSkills && (
//                     <p className="job-skills-line">
//                       <strong>Skills:</strong> {job.preferredSkills}
//                     </p>
//                   )}

//                   <div className="job-actions">
//                     <button
//                       className="btn-details"
//                       onClick={() => navigate(`/admin/job/${job._id}`)}
//                     >
//                       Job Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminCareer;


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
 
const AdminCareer = () => {
  const navigate = useNavigate();
 
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
 
  // ✅ DASHBOARD STATES
  const [appliedData, setAppliedData] = useState([]);   
  const [totalApplied, setTotalApplied] = useState(0);
  const [onHold, setOnHold] = useState(0);
  const [hired, setHired] = useState(0);
  const [jobs, setJobs] = useState([]);
 
  /* ✅ FETCH JOB LIST */
  useEffect(() => {
    fetch("https://internal-website-rho.vercel.app/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);
 
  /* ✅ FETCH SUMMARY STATS (TOTAL / ONHOLD / HIRED) */
  useEffect(() => {
    fetch("https://public-website-drab-ten.vercel.app/api/applications/stats/summary")
      .then((res) => res.json())
      .then((data) => {
        setTotalApplied(data.totalApplied || 0);
        setOnHold(data.onHold || 0);
        setHired(data.hired || 0);
      })
      .catch((err) => console.error("Error fetching summary:", err));
  }, []);
 
  /* ✅ FETCH MONTHLY GRAPH DATA */
  useEffect(() => {
    fetch("https://public-website-drab-ten.vercel.app/api/applications/stats/monthly")
      .then((res) => res.json())
      .then((data) => {
        console.log("MONTHLY API RAW RESPONSE:", data);
 
        const formatted = (data.data || []).map((m) => ({
          month: m.month,
          applied: m.applied,
        }));
 
        setAppliedData(formatted);
      })
      .catch((err) => console.error("Error fetching monthly stats:", err));
  }, []);
 
  /* ✅ AUTO SELECT LAST MONTH */
  useEffect(() => {
    if (appliedData.length > 0) {
      const lastIndex = appliedData.length - 1;
      setSelectedMonthIndex(lastIndex);
      setSelectedMonth(appliedData[lastIndex].month);
    }
  }, [appliedData]);
 
  /* ✅ JOB FORM TOGGLE */
  const [showJobForm, setShowJobForm] = useState(false);
 
  const getDaysAgo = (postedDate) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(postedDate));
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
 
  return (
<div className="carriers-page">
      {showJobForm ? (
<div className="job-form-wrapper">
<AdminJobform onSubmitJob={() => setShowJobForm(false)} />
</div>
      ) : (
<>
          {/* ✅ ✅ SUMMARY SECTION */}
<div className="carriers-summary">
<div
              className="summary-card clickable-total-container"
              onClick={() =>
                navigate("/admin/jobApplicants", {
                  state: { selectedMonth, totalJobs: true },
                })
              }
>
<h4>Total Applied Jobs</h4>
<p>{totalApplied}</p>
</div>
 
            <div
              className="summary-card clickable-monthly-container"
              onClick={() =>
                navigate("/admin/monthjobs", {
                  state: { selectedMonth },
                })
              }
>
<h4>
                Monthly Total Applicants{" "}
                {selectedMonth && <span>({selectedMonth})</span>}
</h4>
<p>Applied: {appliedData[selectedMonthIndex]?.applied || 0}</p>
</div>
 
            <div
              className="summary-card clickable-onhold-container"
              onClick={() => navigate("/admin/onhold")}
>
<h4>On Hold</h4>
<p>{onHold}</p>
</div>
 
            <div
              className="summary-card clickable-hired-container"
              onClick={() => navigate("/admin/hired")}
>
<h4>Hired</h4>
<p>{hired}</p>
</div>
</div>
 
          {/* ✅ ✅ JOB STATISTICS GRAPH */}
<div className="job-statistics">
<h3>Job Statistics</h3>
 
            <div className="stat-tabs">
<button className="active">Job Applied</button>
</div>
 
            <ResponsiveContainer width="100%" height={250}>
<BarChart data={appliedData}>
<XAxis dataKey="month" />
<Tooltip />
<Bar
                  dataKey="applied"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  onClick={(data, index) => {
                    setSelectedMonthIndex(index);
                    setSelectedMonth(data.month);
                  }}
                />
</BarChart>
</ResponsiveContainer>
</div>
 
          {/* ✅ ✅ CURRENT OPENINGS */}
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
<div key={job._id} className="job-card">
<h4>{job.jobTitle}</h4>
<p className="job-main-line">
                    {job.jobType} | {job.experience} | ₹{job.salary} |{" "}
                    {Array.isArray(job.location)
                      ? job.location.join(", ")
                      : job.location}{" "}
                    | Posted {getDaysAgo(job.createdAt)} days ago
</p>
 
                  {job.roleOverview && (
<p className="job-desc-line">
<strong>Description:</strong>{" "}
                      {job.roleOverview.length > 90
                        ? job.roleOverview.slice(0, 90) + "..."
                        : job.roleOverview}
</p>
                  )}
 
                  {job.preferredSkills && (
<p className="job-skills-line">
<strong>Skills:</strong> {job.preferredSkills}
</p>
                  )}
 
                  <div className="job-actions">
<button
                      className="btn-details"
                      onClick={() => navigate(`/admin/job/${job._id}`)}
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