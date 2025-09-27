import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

// Helper to calculate project status
const calculateStatus = (startDate, duration) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + duration - 1);
  const today = new Date();

  if (today < start) return "Idle";
  if (today >= start && today <= end) return "In Progress";
  return "Completed";
};

// Helper to calculate pie chart data for all projects including idle days
const getAllProjectDays = (projects) => {
  if (projects.length === 0) return [{ name: "Idle", value: 1 }];

  // Sort projects by start date
  const sorted = [...projects].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  const today = new Date();
  let lastEnd = new Date(sorted[0].startDate);
  let completedDays = 0;
  let inProgressDays = 0;
  let idleDays = 0;

  sorted.forEach((p) => {
    const start = new Date(p.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + p.duration - 1);

    // Count idle days between lastEnd and start
    const gap = Math.max(0, Math.floor((start - lastEnd) / (1000 * 60 * 60 * 24)));
    idleDays += gap;

    if (today < start) {
      idleDays += p.duration;
    } else if (today >= start && today <= end) {
      inProgressDays += Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
      const remaining = p.duration - Math.floor((today - start) / (1000 * 60 * 60 * 24)) - 1;
      // idleDays += remaining;
    } else {
      completedDays += p.duration;
    }

    // Update lastEnd
    lastEnd = new Date(Math.max(lastEnd, end));
    lastEnd.setDate(lastEnd.getDate() + 1);
  });

  // Count idle days after last project till today
  const gapAfterLast = Math.max(
    0,
    Math.floor((today - lastEnd) / (1000 * 60 * 60 * 24)) + 1
  );
  idleDays += gapAfterLast;

  return [
    { name: "Completed", value: completedDays },
    { name: "In Progress", value: inProgressDays },
    { name: "Idle", value: idleDays },
  ];
};

function Dashboard({
  totalLeaves,
  leavesUsed,
  totalDays,
  presentDays,
  absentDays,
  projects,
}) {
  const remainingLeaves = totalLeaves - leavesUsed;

  // Pie Colors
  const COLORS = {
    Completed: "#00C49F",
    "In Progress": "#FF8042",
    Idle: "#FF9999",
  };

  const timelineData = getAllProjectDays(projects);

  // Current projects in progress
  const inProgressProjects = projects.filter(
    (p) => calculateStatus(p.startDate, p.duration) === "In Progress"
  );

  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>

      {/* Leaves & Attendance */}
      <div className="charts-row">
        {/* Leaves Chart */}
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
                <Cell fill={COLORS.Completed} />
                <Cell fill={COLORS["In Progress"]} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Chart */}
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
                <Cell fill={COLORS.Completed} />
                <Cell fill={COLORS["In Progress"]} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Current Projects Pie Charts Horizontal */}
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
                        { name: "Completed", value: daysPassed },
                        { name: "Remaining", value: remainingDays },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      <Cell fill={COLORS.Completed} />
                      <Cell fill={COLORS["In Progress"]} />
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
          <div style={{ color: COLORS.Idle, fontWeight: "bold" }}>
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
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Table */}
      <div className="completed-projects">
        <h2>Projects Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Start Date</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, idx) => (
              <tr key={idx}>
                <td>{p.name}</td>
                <td>{p.startDate}</td>
                <td>{p.duration}</td>
                <td>{calculateStatus(p.startDate, p.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
