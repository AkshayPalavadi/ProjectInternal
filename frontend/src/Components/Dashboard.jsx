import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Img from "../assets/logo.jpg";
import "./Dashboard.css";

// ✅ Project status helper
const calculateStatus = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  if (today < start) return "Future";
  if (today >= start && today <= end) return "In Progress";
  return "Completed";
};

// ✅ Calculate working days (Mon-Fri)
const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

// ✅ Duration
const getDuration = (startDate, endDate) => calculateWorkingDays(new Date(startDate), new Date(endDate));

// ✅ Timeline helper
const getAllProjectDays = (projects) => {
  if (!projects.length) return { chartData: [{ name: "Idle days", value: 1 }], detailMap: { "Idle days": [{ range: "N/A", label: "No projects" }] } };

  const today = new Date();
  const sorted = [...projects].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  let completedDays = 0, inProgressDays = 0, idleDays = 0, futureDays = 0;
  let details = { "Completed days": [], "In Progress days": [], "Idle days": [], "Future days": [] };
  let lastEnd = null;

  sorted.forEach((p) => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);

    if (lastEnd && start > lastEnd) {
      const gap = Math.floor((start - lastEnd) / (1000 * 60 * 60 * 24));
      if (gap > 0) {
        idleDays += gap;
        details["Idle days"].push({ range: `${lastEnd.toDateString()} → ${new Date(start.getTime() - 86400000).toDateString()}`, label: `${gap} idle days` });
      }
    }

    if (today < start) {
      futureDays += getDuration(p.startDate, p.endDate);
      details["Future days"].push({ range: `${start.toDateString()} → ${end.toDateString()}`, label: `${p.name}: ${getDuration(p.startDate, p.endDate)} days` });
    } else if (today >= start && today <= end) {
      const daysPassed = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
      const remaining = getDuration(p.startDate, p.endDate) - daysPassed;
      completedDays += daysPassed;
      inProgressDays += remaining;

      details["Completed days"].push({ range: `${start.toDateString()} → ${today.toDateString()}`, label: `${p.name}: ${daysPassed} days` });
      if (remaining > 0) details["In Progress days"].push({ range: `${new Date(today.getTime() + 86400000).toDateString()} → ${end.toDateString()}`, label: `${p.name}: ${remaining} days` });
    } else {
      completedDays += getDuration(p.startDate, p.endDate);
      details["Completed days"].push({ range: `${start.toDateString()} → ${end.toDateString()}`, label: `${p.name}: ${getDuration(p.startDate, p.endDate)} days` });
    }

    lastEnd = new Date(end);
    lastEnd.setDate(lastEnd.getDate() + 1);
  });

  return {
    chartData: [
      { name: "Completed days", value: completedDays },
      { name: "In Progress days", value: inProgressDays },
      { name: "Idle days", value: idleDays },
      { name: "Future days", value: futureDays },
    ],
    detailMap: details,
  };
};

// ✅ Custom tooltip
const CustomTooltip = ({ active, payload, detailMap }) => {
  if (active && payload && payload.length) {
    const label = payload[0].name;
    return (
      <div className="employeedashboard-custom-tooltip">
        <h4>{label}</h4>
        <ul>
          {detailMap[label]?.map((d, i) => (
            <li key={i}><strong>{d.label}</strong> ({d.range})</li>
          )) || <li>No data</li>}
        </ul>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  // ✅ Get employee ID from login
  const employeeId = parseInt(localStorage.getItem("employeeId"));

  // ✅ Read all projects from localStorage
  const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

  // ✅ Filter projects assigned to this employee
  const projects = allProjects.filter(p => p.assignedEmployees.includes(employeeId));
//   const employeeId = parseInt(localStorage.getItem("employeeId"));
// const validEmployeeId = isNaN(employeeId) ? 0 : employeeId;
// const projects = allProjects.filter(p => p.assignedEmployees.includes(validEmployeeId));


  const COLORS = { "Completed days": "#00C49F", "In Progress days": "#FF8042", "Idle days": "#FF9999", "Future days": "#757575" };
  const { chartData: timelineData, detailMap } = getAllProjectDays(projects);
  const inProgressProjects = projects.filter((p) => calculateStatus(p.startDate, p.endDate) === "In Progress");

  // ✅ Tabs for Achievements
const [activeTab, setActiveTab] = useState("awards");

const [dashboardData] = useState({
  bestEmployee: {
    name: "Sathvika Reddy",
    id: "130",
    role: "Software Engineer",
    photo: Img,
    managerName: "Vijay",
    managerEmail: "vijay.m@dhatvibs.com",
  },
  awards: [
    "Employee of the Month - August 2025",
    "Best Performer - Q2 2025"
  ],
  appreciations: [
    "Appreciated by client for timely delivery.",
    "Praised by manager for mentoring juniors.",
    "Received positive feedback in peer review."
  ]
});

  return (
<<<<<<< HEAD
    <div className="employeedashboard-dashboard">
=======
    <div className="dashboard-inner">
>>>>>>> 779f35540c479b0a00913305138f1b11c4585954
      <h1>My Dashboard</h1>

      {/* Top Cards Row */}
      <div className="employeedashboard-top-cards-row">
        {/* Best Employee */}
        <div className="employeedashboard-best-employee-card">
          <h2>Best Employee of the Month</h2>
          <div className="employeedashboard-employee-content">
            <img src={dashboardData.bestEmployee.photo} alt={dashboardData.bestEmployee.name} />
            <div className="employeedashboard-employee-info">
              <p>Name: <b>{dashboardData.bestEmployee.name}</b></p>
              <p>Employee ID: <b>{dashboardData.bestEmployee.id}</b></p>
              <p>Role: <b>{dashboardData.bestEmployee.role}</b></p>
              <p>Manager Name: <b>{dashboardData.bestEmployee.managerName}</b></p>
              <p>Manager Email: <b>{dashboardData.bestEmployee.managerEmail}</b></p>
            </div>
          </div>
        </div>

        {/* My Achievements */}
        <div className="employeedashboard-my-achievements-card">
          <h2>My Achievements</h2>

          {/* Tabs */}
          <div className="employeedashboard-achievement-tabs">
            <button
              className={activeTab === "awards" ? "active" : "inactive"}
              onClick={() => setActiveTab("awards")}
            >
              Awards
            </button>
            <button
              className={activeTab === "appreciations" ? "active" : "inactive"}
              onClick={() => setActiveTab("appreciations")}
            >
              Appreciations
            </button>
          </div>

          {/* Tab Content */}
          <div className="employeedashboard-tab-content">
            {activeTab === "awards" ? (
              <ul>
                {dashboardData.awards.length > 0 ? (
                  dashboardData.awards.map((award, idx) => <li key={idx}>{award}</li>)
                ) : (
                  <p className="employeedashboard-no-data">No awards yet 🎖️</p>
                )}
              </ul>
            ) : (
              <ul>
                {dashboardData.appreciations.length > 0 ? (
                  dashboardData.appreciations.map((a, idx) => <li key={idx}>{a}</li>)
                ) : (
                  <p className="employeedashboard-no-data">No appreciations yet 💬</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="employeedashboard-navigation-cards-row">
        <Link to="/employee/timesheet" className="employeedashboard-nav-card">
          <h2>Timesheet</h2>
          <p>Track your daily work hours and activities.</p>
        </Link>

        <Link to="/employee/performancemanagement" className="employeedashboard-nav-card">
          <h2>Performance Management</h2>
          <p>View and manage your assigned projects.</p>
        </Link>
      </div>

      <Outlet />

      {/* Current Projects Pie */}
      <div className="employeedashboard-charts-row">
        {inProgressProjects.length > 0 ? (
          inProgressProjects.map((project, idx) => {
            const start = new Date(project.startDate);
            const today = new Date();
            const daysPassed = Math.min(
              calculateWorkingDays(start, today),
              getDuration(project.startDate, project.endDate)
            );

            const remainingDays = getDuration(project.startDate, project.endDate) - daysPassed;

            return (
              <div key={idx} className="employeedashboard-chart-card">
                <h2>{project.name} Progress</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed days", value: daysPassed },
                        { name: "In Progress days", value: remainingDays },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      <Cell fill={"#00C49F"} />
                      <Cell fill={"#FF8042"} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p><strong>Start Date:</strong> {project.startDate}</p>
                <p><strong>End Date:</strong> {project.endDate}</p>
                <p><strong>Duration:</strong> {getDuration(project.startDate, project.endDate)} days</p>
              </div>
            );
          })
        ) : (
          <div style={{ color: COLORS["Idle days"], fontWeight: "bold" }}>
            No current projects
          </div>
        )}
      </div>

      {/* All Projects Timeline Pie */}
      <div className="employeedashboard-charts-row">
        <div className="employeedashboard-chart-card wide">
          <h2>All Projects Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={timelineData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {timelineData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip detailMap={detailMap} />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects Table */}
      <div className="employeedashboard-completed-projects">
        <h2>Projects Overview</h2>
        <table className="employeedashboard-projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, idx) => {
              const status = calculateStatus(p.startDate, p.endDate);
              const duration = getDuration(p.startDate, p.endDate);
              return (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.startDate}</td>
                  <td>{p.endDate}</td>
                  <td>{duration} days</td>
                  <td>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
