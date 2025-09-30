import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

// ✅ Project status for table & filtering
const calculateStatus = (startDate, duration) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + duration - 1);
  const today = new Date();

  if (today < start) return "Future";
  if (today >= start && today <= end) return "In Progress";
  return "Completed";
};

// ✅ Helper for timeline chart with detailed mapping
const getAllProjectDays = (projects) => {
  if (projects.length === 0)
    return {
      chartData: [{ name: "Idle days", value: 1 }],
      detailMap: { "Idle days": [{ range: "N/A", label: "No projects" }] },
    };

  const today = new Date();
  const sorted = [...projects].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  let completedDays = 0;
  let inProgressDays = 0;
  let idleDays = 0;
  let futureDays = 0;

  let details = {
    "Completed days": [],
    "In Progress days": [],
    "Idle days": [],
    "Future days": [],
  };

  let lastEnd = null;

  sorted.forEach((p) => {
    const start = new Date(p.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + p.duration - 1);

    // idle gap between projects
    if (lastEnd && start > lastEnd) {
      const gap = Math.floor((start - lastEnd) / (1000 * 60 * 60 * 24));
      if (gap > 0) {
        idleDays += gap;
        details["Idle days"].push({
          range: `${lastEnd.toDateString()} → ${new Date(
            start.getTime() - 86400000
          ).toDateString()}`,
          label: `${gap} idle days`,
        });
      }
    }

    if (today < start) {
      futureDays += p.duration;
      details["Future days"].push({
        range: `${start.toDateString()} → ${end.toDateString()}`,
        label: `${p.name}: ${p.duration} days`,
      });
    } else if (today >= start && today <= end) {
      const daysPassed =
        Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
      const remaining = p.duration - daysPassed;
      completedDays += daysPassed;
      inProgressDays += remaining;

      details["Completed days"].push({
        range: `${start.toDateString()} → ${today.toDateString()}`,
        label: `${p.name}: ${daysPassed} days`,
      });

      if (remaining > 0) {
        details["In Progress days"].push({
          range: `${new Date(today.getTime() + 86400000).toDateString()} → ${end.toDateString()}`,
          label: `${p.name}: ${remaining} days`,
        });
      }
    } else {
      completedDays += p.duration;
      details["Completed days"].push({
        range: `${start.toDateString()} → ${end.toDateString()}`,
        label: `${p.name}: ${p.duration} days`,
      });
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

// ✅ Custom tooltip for timeline pie
const CustomTooltip = ({ active, payload, detailMap }) => {
  if (active && payload && payload.length) {
    const label = payload[0].name;
    return (
      <div className="custom-tooltip">
        <h4>{label}</h4>
        <ul>
          {detailMap[label]?.map((d, i) => (
            <li key={i}>
              <strong>{d.label}</strong> ({d.range})
            </li>
          )) || <li>No data</li>}
        </ul>
      </div>
    );
  }
  return null;
};

function Dashboard({
  totalLeaves,
  leavesUsed,
  presentDays,
  absentDays,
  projects,
}) {
  const [selectedProject, setSelectedProject] = useState(null);

  const remainingLeaves = totalLeaves - leavesUsed;

  const COLORS = {
    "Completed days": "#00C49F",
    "In Progress days": "#FF8042",
    "Idle days": "#FF9999", // red
    "Future days": "#757575", // gray
  };

  const { chartData: timelineData, detailMap } = getAllProjectDays(projects);

  // ✅ FIX: Check against "In Progress" (not "In Progress days")
  const inProgressProjects = projects.filter(
    (p) => calculateStatus(p.startDate, p.duration) === "In Progress"
  );

  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>

      {/* Leaves & Attendance */}
      <div className="charts-row">
        <div className="chart-card">
          <h2>Leaves</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Leaves Left", value: remainingLeaves },
                  { name: "Used Leaves", value: leavesUsed },
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
        </div>

        <div className="chart-card">
          <h2>Attendance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Present", value: presentDays },
                  { name: "Absent", value: absentDays },
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
        </div>
      </div>

      {/* Current Projects */}
      <div className="charts-row">
        {inProgressProjects.length > 0 ? (
          inProgressProjects.map((project, idx) => {
            const start = new Date(project.startDate);
            const today = new Date();
            const daysPassed = Math.min(
              Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1,
              project.duration
            );
            const remainingDays = project.duration - daysPassed;

            return (
              <div key={idx} className="chart-card">
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
                <p>
                  <strong>Start Date:</strong> {project.startDate}
                </p>
                <p>
                  <strong>Duration:</strong> {project.duration} days
                </p>
              </div>
            );
          })
        ) : (
          <div style={{ color: COLORS["Idle days"], fontWeight: "bold" }}>
            No current projects
          </div>
        )}
      </div>

      {/* All Projects Timeline */}
      <div className="charts-row">
        <div className="chart-card wide">
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
      <div className="completed-projects">
        <h2>Projects Overview</h2>
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Start Date</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, idx) => {
              const isSelected = selectedProject?.name === p.name;
              return (
                <React.Fragment key={idx}>
                  <tr
                    onClick={() =>
                      setSelectedProject(isSelected ? null : p)
                    }
                    className={isSelected ? "active-row" : ""}
                  >
                    <td>{p.name}</td>
                    <td>{p.startDate}</td>
                    <td>{p.duration}</td>
                    <td>{calculateStatus(p.startDate, p.duration)}</td>
                  </tr>
                  {isSelected && (
                    <tr className="details-row">
                      <td colSpan={4}>
                        <div className="details-box">
                          <p>
                            <strong>Project:</strong> {p.name}
                          </p>
                          <p>
                            <strong>Project Start Date:</strong> {p.startDate}
                          </p>
                          <p>
                            <strong>Duration:</strong> {p.duration} days
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
