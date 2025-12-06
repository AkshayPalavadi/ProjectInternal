
import React, { useState, useEffect, useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { FiFilter, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./TrainingDevelopment.css";

const TrainingDevelopment = () => {
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);
const [inProgressData, setInProgressData] = useState([]);
const [loadingInProgress, setLoadingInProgress] = useState(true);
  // ⭐ NEW TAB STATE
  const [activeSkillTab, setActiveSkillTab] = useState("previous");
  const [completedTrainingData, setCompletedTrainingData] = useState([]);
const [loadingCompleted, setLoadingCompleted] = useState(true);

  

  // ------------------------------------------------------
  // MONTHLY DATA
  // ------------------------------------------------------
  const allData = [
    { month: "Jan", completed: 60, ongoing: 40 },
    { month: "Feb", completed: 75, ongoing: 25 },
    { month: "Mar", completed: 85, ongoing: 15 },
    { month: "Apr", completed: 65, ongoing: 35 },
    { month: "May", completed: 80, ongoing: 20 },
    { month: "Jun", completed: 70, ongoing: 30 },
    { month: "Jul", completed: 55, ongoing: 45 },
    { month: "Aug", completed: 60, ongoing: 40 },
    { month: "Sep", completed: 85, ongoing: 15 },
    { month: "Oct", completed: 75, ongoing: 25 },
    { month: "Nov", completed: 90, ongoing: 10 },
    { month: "Dec", completed: 0, ongoing: 0 },
  ];

  // ------------------------------------------------------
  // DEPARTMENT → MONTH → PROGRESS DATA
  // ------------------------------------------------------
  const departmentDataByMonth = {
    Jan: [
      { name: "Engineering", completed: 45, ongoing: 55 },
      { name: "Design", completed: 60, ongoing: 40 },
      { name: "HR", completed: 70, ongoing: 30 },
      { name: "Marketing", completed: 55, ongoing: 45 },
      { name: "Finance", completed: 50, ongoing: 50 },
    ],
    Feb: [
      { name: "Engineering", completed: 75, ongoing: 25 },
      { name: "Design", completed: 80, ongoing: 20 },
      { name: "HR", completed: 70, ongoing: 30 },
      { name: "Marketing", completed: 65, ongoing: 35 },
      { name: "Finance", completed: 60, ongoing: 40 },
    ],
    Mar: [
      { name: "Engineering", completed: 85, ongoing: 15 },
      { name: "Design", completed: 90, ongoing: 10 },
      { name: "HR", completed: 80, ongoing: 20 },
      { name: "Marketing", completed: 75, ongoing: 25 },
      { name: "Finance", completed: 70, ongoing: 30 },
    ],
    default: [
      { name: "Engineering", completed: 70, ongoing: 30 },
      { name: "Design", completed: 60, ongoing: 40 },
      { name: "HR", completed: 50, ongoing: 50 },
      { name: "Marketing", completed: 55, ongoing: 45 },
      { name: "Finance", completed: 45, ongoing: 55 },
    ],
  };

  // ==================================================================
  // CALC LOGIC
  // ==================================================================
  const calculateDeptAverageForAllMonths = (deptName) => {
    let totalCompleted = 0;
    let totalOngoing = 0;
    let count = 0;

    Object.keys(departmentDataByMonth).forEach((month) => {
      if (month !== "default") {
        const dept = departmentDataByMonth[month].find(
          (d) => d.name === deptName
        );
        if (dept) {
          totalCompleted += dept.completed;
          totalOngoing += dept.ongoing;
          count++;
        }
      }
    });

    return {
      completed: Math.round(totalCompleted / count),
      ongoing: Math.round(totalOngoing / count),
    };
  };

  const calculateAllDeptAllMonths = () => {
    let totalCompleted = 0;
    let totalOngoing = 0;
    let monthsCount = 0;

    Object.keys(departmentDataByMonth).forEach((month) => {
      if (month !== "default") {
        const monthData = departmentDataByMonth[month];

        const avgCompleted =
          monthData.reduce((s, d) => s + d.completed, 0) / monthData.length;
        const avgOngoing =
          monthData.reduce((s, d) => s + d.ongoing, 0) / monthData.length;

        totalCompleted += avgCompleted;
        totalOngoing += avgOngoing;

        monthsCount++;
      }
    });

    return {
      completed: Math.round(totalCompleted / monthsCount),
      ongoing: Math.round(totalOngoing / monthsCount),
    };
  };

  const filteredDeptData = useMemo(() => {
    const monthData =
      departmentDataByMonth[selectedMonth] || departmentDataByMonth.default;

    if (selectedDept === "All") return monthData;
    return monthData.filter((d) => d.name === selectedDept);
  }, [selectedMonth, selectedDept]);

  const selectedDeptStats = useMemo(() => {
    if (selectedDept === "All" && selectedMonth === "All") {
      return calculateAllDeptAllMonths();
    }

    if (selectedDept !== "All" && selectedMonth === "All") {
      return calculateDeptAverageForAllMonths(selectedDept);
    }

    if (selectedDept === "All" && selectedMonth !== "All") {
      const monthData =
        departmentDataByMonth[selectedMonth] ||
        departmentDataByMonth.default;

      return {
        completed: Math.round(
          monthData.reduce((s, d) => s + d.completed, 0) / monthData.length
        ),
        ongoing: Math.round(
          monthData.reduce((s, d) => s + d.ongoing, 0) / monthData.length
        ),
      };
    }

    const found = filteredDeptData.find((d) => d.name === selectedDept);
    return found || { completed: 0, ongoing: 0 };
  }, [selectedDept, selectedMonth, filteredDeptData]);

  const filteredData = useMemo(() => {
    if (selectedMonth !== "All" && selectedDept !== "All") {
      return allData.map((item) => ({
        ...item,
        completed:
          item.month === selectedMonth ? selectedDeptStats.completed : 0,
        ongoing: item.month === selectedMonth ? selectedDeptStats.ongoing : 0,
      }));
    }

    if (selectedMonth === "All") return allData;

    return allData.map((item) => ({
      ...item,
      completed: item.month === selectedMonth ? item.completed : 0,
      ongoing: item.month === selectedMonth ? item.ongoing : 0,
    }));
  }, [selectedMonth, selectedDept, selectedDeptStats, allData]);

  // ==================================================================
  // ROUNDED BAR SHAPE
  // ==================================================================
  const RoundedBar = (props) => {
    const { x, y, width, height, fill } = props;
    const radius = 10;
    return (
      <path
        d={`M${x},${y + height}
           L${x},${y + radius}
           Q${x},${y} ${x + radius},${y}
           L${x + width - radius},${y}
           Q${x + width},${y} ${x + width},${y + radius}
           L${x + width},${y + height}
           Z`}
        fill={fill}
      />
    );
  };

  const handleNavigation = (type, department) => {
    if (type === "individual") navigate("/admin/TrainingModule", { state: { department } });
    else if (type === "fresher") navigate("/admin/FreshersTrainingAssignment");
    else navigate("/admin/TrainingAssignment");

    setOpenDropdown(null);
  };

const [assignedData, setAssignedData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchInProgressTasks = async () => {
    try {
      const response = await fetch(
        "https://internal-website-rho.vercel.app/api/training/tasks/in-progress"
      );
      const data = await response.json();
      if (data.tasks) {
        setInProgressData(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching in-progress tasks:", error);
    } finally {
      setLoadingInProgress(false);
    }
  };

  fetchInProgressTasks();
}, []);
useEffect(() => {
  const fetchAssignedEmployees = async () => {
    try {
      const response = await fetch(
        "https://internal-website-rho.vercel.app/api/training/assigned"
      );
      const data = await response.json();
      if (data.tasks) {
        setAssignedData(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching assigned employees:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAssignedEmployees();
}, []);
useEffect(() => {
  const fetchCompletedTraining = async () => {
    try {
      const response = await fetch(
        "https://internal-website-rho.vercel.app/api/training/tasks/completed"
      );
      const data = await response.json();
      if (data.tasks) {
        setCompletedTrainingData(data.tasks); // store tasks array
      }
    } catch (error) {
      console.error("Error fetching completed training:", error);
    } finally {
      setLoadingCompleted(false);
    }
  };

  fetchCompletedTraining();
}, []);

  return (
    <div className="training-development-training-container">

      {/* HEADER */}
      <header className="training-development-header"></header>

      {/* STATUS CARDS */}
      <section className="training-development-status-section">
        <h2 className="training-development-section-title">
          Training & Development Overview
        </h2>

        <div className="training-development-status-cards">
          <div className="training-development-card ongoing-card">
  <h3>Assigned</h3>
  <p className="training-development-value">
    {loading ? "..." : assignedData.length}
  </p>
  <p className="training-development-label">Employees</p>
  <button
    className="training-development-view-btn"
    onClick={() => navigate("/admin/Assigned", { state: { employees: assignedData } })}
  >
    View Details
  </button>
</div>


          <div className="training-development-card completed-card">
            <h3>In Progress</h3>
            <p className="training-development-value">
  {loadingInProgress ? "..." : inProgressData.length}
</p>

            {/* <p className="training-development-percent positive">+22.0%</p> */}
            <p className="training-development-label">Employees</p>
            <button
              className="training-development-view-btn"
              onClick={() => navigate("/admin/InProgress")}
            >
              View Details
            </button>
          </div>

         <div className="training-development-card certificates-card">
  <h3>Completed Training</h3>
  <p className="training-development-value">
    {loadingCompleted ? "..." : completedTrainingData.length}
  </p>
  <p className="training-development-label">Employees</p>
  <button
    className="training-development-view-btn"
    onClick={() => navigate("/admin/CompletedTraining")}
  >
    View Details
  </button>
</div>

        </div>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <FiFilter className="filter-icon-training-dev" />

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="All">All Months</option>
          {allData.map((m) => (
            <option key={m.month}>{m.month}</option>
          ))}
        </select>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="HR">HR</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      {/* CHARTS SECTION */}
      <section className="training-development-chart-section">
        <div className="charts-container">

          {/* BAR CHART */}
          <div className="chart-box">
            <h2 className="training-development-section-title-montly chart">
              Monthly Training Progress
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={filteredData} barGap={8}>
                <XAxis dataKey="month" tick={{ fill: "#555", fontSize: 12 }} />

                <Tooltip
                  formatter={(value, name) =>
                    `${value}% ${
                      name === "completed" ? "Completed" : "Ongoing"
                    }`
                  }
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                />

                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#4F46E5"
                  shape={<RoundedBar />}
                >
                  <LabelList
                    dataKey="completed"
                    position="center"
                    fill="#fff"
                    fontSize={12}
                  />
                </Bar>

                <Bar
                  dataKey="ongoing"
                  stackId="a"
                  fill="#CBD5E1"
                  shape={<RoundedBar />}
                >
                  <LabelList
                    dataKey="ongoing"
                    position="top"
                    fill="#333"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="chart-box">
            <div className="chart-header">
              <h2 className="training-development-section-title-department chart">
                Department-wise Training Share
              </h2>

              <div className="dept-stats-right-ongoing">
                {/* <p>
                  <strong>Ongoing:</strong>{" "}
                  <span style={{ color: "rgba(214, 27, 27, 0.25);" }}>
                    {selectedDeptStats?.ongoing || 0}%
                  </span>
                </p>

                <p div className="dept-stats-right-completed">
                  <strong>Completed:</strong>{" "}
                  <span style={{ color: "rgba(9, 163, 35, 0.25);" }}>
                    {selectedDeptStats?.completed || 0}%
                  </span>
                </p> */}

                <p div className="dept-stats-right-department">
                  <strong>Department:</strong>{" "}
                  {selectedDept === "All" ? "All Departments" : selectedDept}
                </p>

                <p div className="dept-stats-right-month">
                  <strong>Month:</strong>{" "}
                  {selectedMonth === "All" ? "All Months" : selectedMonth}
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Completed",
                      value: selectedDeptStats?.completed || 0,
                    },
                    {
                      name: "Ongoing",
                      value: selectedDeptStats?.ongoing || 0,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  dataKey="value"
                >
                  <Cell fill="green" />
                  <Cell fill="red" />
                </Pie>

                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* =========================== */}
      {/* ⭐ SKILLS SECTION UPDATED ⭐ */}
      {/* =========================== */}
      {/* =========================== */}
{/* ⭐ SKILLS SECTION UPDATED ⭐ */}
{/* =========================== */}
<section className="training-development-skills-section">
  <h2 className="training-development-section-title">
    Skills to Upgrade for Upcoming Projects
  </h2>

  {/* SWITCH BUTTONS */}
  <div className="skills-toggle-buttons">
    <button
      className={`skill-tab-btn ${
        activeSkillTab === "previous" ? "active" : ""
      }`}
      onClick={() => setActiveSkillTab("previous")}
    >
      Previous Employees
    </button>

    <button
      className={`skill-tab-btn ${
        activeSkillTab === "new" ? "active" : ""
      }`}
      onClick={() => setActiveSkillTab("new")}
    >
      New Joiners
    </button>
  </div>

  {/* SAME CONTAINER — CONTENT CHANGES */}
  <div className="training-development-skills-grid compact-grid">
    {activeSkillTab === "previous" ? (
      <>
        {/* =============== FRONT-END =============== */}
        <div className="training-development-skill-card compact-card">
          <h3>Front-End Technologies</h3>
          <ul>
            <li>Full Stack Web Development</li>
            <li>TypeScript</li>
            <li>HTML5</li>
            <li>CSS3</li>
          </ul>

          <div className="assign-dropdown">
            <button
              className="training-development-assign-btn"
              onClick={() =>
                setOpenDropdown(openDropdown === "fe" ? null : "fe")
              }
            >
              Assign <FiChevronDown className="dropdown-icon" />
            </button>

            {openDropdown === "fe" && (
              <div className="dropdown-menu-individual">
                <button onClick={() => handleNavigation("individual", "Front-End Technologies")}>
                  Individual Employee
                </button>
                <button onClick={() => handleNavigation("multiple", "Front-End Technologies")}>
                  Multiple Employees
                </button>
                {/* <button onClick={() => handleNavigation("fresher")}>
                  Fresher
                </button> */}
              </div>
            )}
          </div>
        </div>

        {/* =============== BACK-END =============== */}
        <div className="training-development-skill-card compact-card">
          <h3>Back-End Technologies</h3>
          <ul>
            <li>React.js Essentials</li>
            <li>Node.js</li>
            <li>Advanced Python</li>
            <li>API Development</li>
          </ul>

          <div className="assign-dropdown">
            <button
              className="training-development-assign-btn"
              onClick={() =>
                setOpenDropdown(openDropdown === "be" ? null : "be")
              }
            >
              Assign <FiChevronDown className="dropdown-icon" />
            </button>

            {openDropdown === "be" && (
              <div className="dropdown-menu-individual">
                <button onClick={() => handleNavigation("individual", "Back-End Technologies")}>
                  Individual Employee
                </button>
                <button onClick={() => handleNavigation("multiple", "Back-End Technologies")}>
                  Multiple Employees
                </button>
                {/* <button onClick={() => handleNavigation("fresher")}>
                  Fresher
                </button> */}
              </div>
            )}
          </div>
        </div>

        {/* =============== UI / UX =============== */}
        <div className="training-development-skill-card compact-card">
          <h3>UI/UX Designing</h3>
          <ul>
            <li>Figma</li>
            <li>Design Systems</li>
            <li>AI for Designers</li>
            <li>Motion Design</li>
          </ul>

          <div className="assign-dropdown">
            <button
              className="training-development-assign-btn"
              onClick={() =>
                setOpenDropdown(openDropdown === "ux" ? null : "ux")
              }
            >
              Assign <FiChevronDown className="dropdown-icon" />
            </button>

            {openDropdown === "ux" && (
              <div className="dropdown-menu-individual">
                <button onClick={() => handleNavigation("individual" , "UI/UX Designing")}>
                  Individual Employee
                </button>
                <button onClick={() => handleNavigation("multiple", "UI/UX Designing")}>
                  Multiple Employees
                </button>
                {/* <button onClick={() => handleNavigation("fresher")}>
                  Fresher
                </button> */}
              </div>
            )}
          </div>
        </div>
      </>
    ) : (
      <>
        {/* =============== FRESHERS ONLY =============== */}
        <div className="training-development-skill-card compact-card">
          <h3>New Joiners Training</h3>
          <ul>
            <li>HTML Basics</li>
            <li>CSS Basics</li>
            {/* <li>JS Essentials</li> */}
            {/* <li>Git Basics</li> */}
            <li>React Intro</li>
            <li>Soft Skills Pack</li>
          </ul>

          <div className="assign-dropdown">
            <button
              className="training-development-assign-btn"
              onClick={() =>
                navigate("/admin/FreshersTrainingAssignment")
              }
            >
              Assign <FiChevronDown className="dropdown-icon" />
            </button>
          </div>
        </div>
      </>
    )}
  </div>
</section>

    </div>
  );
};

export default TrainingDevelopment;