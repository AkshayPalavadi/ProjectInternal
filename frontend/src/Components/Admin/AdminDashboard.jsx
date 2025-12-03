
import React, { useState, useRef, useEffect } from "react";
import "./AdminDashboard.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // STATES FOR REMINDERS
  const [selectedDate, setSelectedDate] = useState("");
  const [reminder, setReminder] = useState("");
  const [activeTable, setActiveTable] = useState(1);
  const token = localStorage.getItem("token");

const handleAddReminder = async () => {
  if (!selectedDate || !reminder) {
    alert("Select a date and enter a reminder.");
    return;
  }

  try {
    const res = await fetch("https://internal-website-rho.vercel.app/api/reminder/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reminderDate: selectedDate,   // FIXED
        title: reminder               // FIXED
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Error response from server:", errData);
      return;
    }

    const data = await res.json();

    if (data.success) {
      setReminder("");
      setSelectedDate("");
      setEvents(prev => [...prev, data.reminder]);

      const { monday, sunday } = getWeekRange();
      const reminderDate = new Date(data.reminder.reminderDate);

      if (reminderDate >= monday && reminderDate <= sunday) {
        setWeeklyReminders(prev => [...prev, data.reminder]);
      }
    }
  } catch (err) {
    console.error("Error adding reminder:", err);
  }
};

  // For editing/deleting a stored reminder
  const [editingEvent, setEditingEvent] = useState(null);
  const [editText, setEditText] = useState("");
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

// PROFILE POPUP STATE
const [showProfilePopup, setShowProfilePopup] = useState(false);
const [profileImage, setProfileImage] = useState(null);
const profileRef = useRef();
const performanceTable = [
  { name: "Sathvika", role: "frontend", score: 3, performance: "good" },
  { name: "Akshay", role: "designing", score: 4.5, performance: "excellent" },
  { name: "Balaji", role: "backend", score: 3.4, performance: "Average" },
  { name: "Sravani", role: "frontend", score: 4.8, performance: "excellent" },
];
const [roleFilter, setRoleFilter] = useState("");
const [scoreFilter, setScoreFilter] = useState("");
const [performanceFilter, setPerformanceFilter] = useState("");
const [filters, setFilters] = useState({
  role: "",
  performance: "",
  score: "",
   projectFrom: "",   // ⬅ ADD THIS
  projectTo: "",
});
const filteredData = performanceTable.filter((row) => {
  const scoreFilter = filters.score;

  // role filter
  if (filters.role && row.role !== filters.role) return false;

  // score filter
  if (scoreFilter === "4-5" && !(row.score >= 4 && row.score <= 5)) return false;
  if (scoreFilter === "3-4" && !(row.score >= 3 && row.score < 4)) return false;
  if (scoreFilter === "3-below" && !(row.score < 3)) return false;

  // performance filter
  if (filters.performance && row.performance !== filters.performance) return false;

  return true;
});



// Dummy user details (replace with API data)
const userDetails = {
  name: "ShanmukhaPriya",
  designation: "HR Manager",
  email: "priya@dhatvibs.com",
  empId: "EMP1025"
};

// Handle image upload
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const imgURL = URL.createObjectURL(file);
    setProfileImage(imgURL);
  }
};

// Remove image
const handleRemoveImage = () => {
  setProfileImage(null);
};


  // FINANCIAL YEAR: default is current FY
  const today = new Date();
  const currentFYStart = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  const [selectedFY, setSelectedFY] = useState(currentFYStart);
  const [fyOffset, setFyOffset] = useState(0);

  // FUTURE FINANCIAL YEARS DROPDOWN
  const futureFYOptions = Array.from({ length: 10 }, (_, i) => currentFYStart + i);
// FILTER STATES


const [filteredRows, setFilteredRows] = useState([]);

const handleFilterChange = (e) => {
  const { name, value } = e.target;

  let updated = { ...filters, [name]: value };


  // RESET LOGIC (IMPORTANT)
  if (name === "projectFrom") {
    updated.projectTo = "";      // clear previous TO date
    // updated = filters.filter(item=> item.projectFrom === value)
    setShowProjectToPicker(false);
  }

  if (name === "projectTo") {
    updated.projectFrom = "";    // clear previous FROM date
    // updated = filters.filter(item=> item.projectTo === value)
    setShowProjectFromPicker(false);
  }
  console.log("filters", filters)
  console.log(value)

  setFilters(updated);
};


const getUniqueValues = (column) => {
  return [...new Set(performanceTable.map((row) => row[column]))].filter(Boolean);
};


    // YEARLY ATTENDANCE DUMMY DATA
  const attendanceData = {};
  for (let i = 0; i < 10; i++) {
    const fy = currentFYStart + i;
    attendanceData[fy] = [
      { month: "Apr", value: 90 + i },
      { month: "May", value: 92 + i },
      { month: "Jun", value: 88 + i },
      { month: "Jul", value: 91 + i },
      { month: "Aug", value: 93 + i },
      { month: "Sep", value: 87 + i },
      { month: "Oct", value: 95 + i },
      { month: "Nov", value: 90 + i },
      { month: "Dec", value: 94 + i },
      { month: "Jan", value: 92 + i },
      { month: "Feb", value: 89 + i },
      { month: "Mar", value: 94 + i }
    ];
  }

  const yearlyAttendance = attendanceData[selectedFY] || [];
  // CALENDAR STATES
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
;

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const generateCalendar = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const calendar = [];
    let week = Array(firstDay).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    if (week.length) calendar.push(week);
    return calendar;
  };

  const calendar = generateCalendar();

const getEventForDate = (day) => {
  if (!day) return null;
  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return events.find(ev => ev.reminderDate.split("T")[0] === dateStr) || null;
};


useEffect(() => {
  const handleOutside = (e) => {
    const panel = document.querySelector(".profile-side-panel");

    // If clicking outside both icon & panel → close
    if (
      showProfilePopup &&
      panel &&
      !panel.contains(e.target) &&
      profileRef.current &&
      !profileRef.current.contains(e.target)
    ) {
      setShowProfilePopup(false);
    }
  };

  document.addEventListener("mousedown", handleOutside);
  return () => document.removeEventListener("mousedown", handleOutside);
}, [showProfilePopup]);
// const [projectFromDate, setProjectFromDate] = useState("");
// const [projectToDate, setProjectToDate] = useState("");
const projectData = [
  { name: "Website Revamp", id: "PRJ101", from: "2025-10-01", to: "2025-12-31", employees: 5 },
  { name: "Mobile App", id: "PRJ102", from: "2025-11-15", to: "2026-02-15", employees: 3 }
];

const filteredProjects = projectData.filter((p) => {
  const { projectFrom, projectTo } = filters;

  if (projectFrom && projectTo) {
    return p.from >= projectFrom && p.to <= projectTo;
  }

  if (projectFrom) {
    return p.from == projectFrom;
  }

  if (projectTo) {
    return p.to == projectTo;
  }

  return true;
});


const [showProjectFromPicker, setShowProjectFromPicker] = useState(false);
const [showProjectToPicker, setShowProjectToPicker] = useState(false);
// Get Monday–Sunday of current week
const getWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};


const [events, setEvents] = useState([]);        // backend reminders
const [loadingReminders, setLoadingReminders] = useState(false);
const userId = JSON.parse(localStorage.getItem("user"))?._id;
useEffect(() => {
  console.log(token)
  fetch("https://internal-website-rho.vercel.app/api/reminder/week", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.reminders)) {
        setWeeklyReminders(data.reminders);
      } else {
        setWeeklyReminders([]);
      }
    })
    .catch(err => console.error("Error fetching weekly reminders:", err));
}, []);


const [birthdays, setBirthdays] = useState([]);

useEffect(() => {
  fetch("https://internal-website-rho.vercel.app/api/birthdays/week", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("birthdays", data)

      // if (!Array.isArray(data.birthdays)) {
      //   setBirthdays([]);
      //   return;
      // }

      // const { monday, sunday } = getWeekRange();

      // const filtered = data.birthdays.filter(b => {
      //   const bDate = new Date(b.dob);   // FIXED FIELD
      //   return bDate >= monday && bDate <= sunday;
      // });

      setBirthdays(data.birthdays);
    })
    .catch(err => console.error("Error fetching birthdays:", err));
}, []);

console.log("birthdays",birthdays)



const [weekEvents, setWeekEvents] = useState([]);
useEffect(() => {
  fetch("https://internal-website-rho.vercel.app/api/holidays/hr", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("Fetched week events:", data.holidays); // check the array
      setWeekEvents(Array.isArray(data.holidays) ? data.holidays : []);
    })
    .catch(err => console.error("Error fetching week events:", err));
}, []);

  const [summary, setSummary] = useState({
  date: "",
  totalEmployees: 0,
  presentToday: 0,
  absentToday: 0,
  presentEmployees: [],
  absentEmployees: []
});

const presentPercentage =
  summary.totalEmployees > 0
    ? ((summary.presentToday / summary.totalEmployees) * 100).toFixed(1)
    : 0;

const onLeavePercent =
  summary.totalEmployees > 0
    ? ((summary.absentToday / summary.totalEmployees) * 100).toFixed(1)
    : 0;

useEffect(() => {
  async function loadSummary() {
    try {
      const res = await fetch("https://internal-website-rho.vercel.app/api/attendance/attendance/today-summary");
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  }

  loadSummary();
}, []);

const [weeklyReminders, setWeeklyReminders] = useState([]);

useEffect(() => {
  if (!events || events.length === 0) {
    setWeeklyReminders([]);
    return;
  }

  const { monday, sunday } = getWeekRange();

  const filtered = events.filter(ev => {
    const d = new Date(ev.reminderDate);  // FIXED
    return d >= monday && d <= sunday;
  });

  setWeeklyReminders(filtered);
}, [events]);


  return (
    <div className="hr-dashboard">

     {/* ===== FIXED TOP BAR ===== */}
<div className="top-status-bar">
  <div className="top-left-title"></div>

  <div className="top-right-icons">
    <FaBell className="top-icon" />
<div
  ref={profileRef}
  onClick={() => setShowProfilePopup((prev) => !prev)}
>
  <FaUserCircle className="top-icon" />
</div>

  </div>
</div>

      {/* ===== TOP GRID: LEFT (cards + graph) + RIGHT PANEL ===== */}
      <div className="top-grid">

        {/* LEFT: Summary + Attendance */}
        <div className="left-top">
          {/* SUMMARY CARDS */}
          <div className="summary-cards">
            <div className="summary-card-emp" onClick={() => navigate("/admin/employees")}>
              <h3>{summary.totalEmployees}</h3>
              <p>Total Employees</p>
            </div>
            <div className="summary-card-present">
              <h3>{summary.presentToday}</h3>
              <p>Present Today ({presentPercentage}%)</p>
             </div>

            <div className="summary-card-leave">
           <h3>{summary.absentToday}</h3>
            <p>On Leave ({onLeavePercent}%)</p>
          </div>

          </div>

          {/* YEARLY ATTENDANCE BAR GRAPH */}
          <div className="attendance-graph-box">
          <div className="attendance-graph-container">
            <div className="graph-header">
              <h3 className="graph-title">
                Attendance Overview - FY {selectedFY}-{selectedFY + 1}
              </h3>
              <div className="fy-nav-buttons">
                {selectedFY > currentFYStart && (
                  <button
                    onClick={() => setSelectedFY(selectedFY - 1)}
                    className="fy-btn"
                  >
                    🢀
                  </button>
                )}
                {selectedFY < currentFYStart + 9 && (
                  <button
                    onClick={() => setSelectedFY(selectedFY + 1)}
                    className="fy-btn"
                  >
                    🢂
                  </button>
                )}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={(() => {
                  const monthlyData = attendanceData[selectedFY] || [];

                  if (selectedFY > currentFYStart) {
                    // Future FY: display all months but no value
                    return monthlyData.map(m => ({ month: m.month, value: null }));
                  }

                  // Current FY: display only months up to current month
                  const fyStartMonth = 3; // April = index 3
                  const monthsElapsed =
                    today.getFullYear() === selectedFY
                      ? today.getMonth() - fyStartMonth + 1
                      : 12; // past FY: all months
                  return monthlyData.slice(0, monthsElapsed);
                })()}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#4a99f3ff" radius={[2, 2, 0, 0]} barSize={25}/>
              </BarChart>
            </ResponsiveContainer>

            {selectedFY > currentFYStart && (
              <p style={{ textAlign: "center", marginTop: "10px", color: "#777" }}>
                Attendance data not available for FY {selectedFY}-{selectedFY + 1} yet.
              </p>
            )}
          </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-fixed-panel">
          <div className="right-big-box">
          <div className="right-box">
  <h3>Events</h3>
  <div className="right-content">

    {weekEvents.length === 0 ? (
      <p>No events this week</p>
    ) : (
      weekEvents.map((ev, i) => (
        <p key={i}>
          {ev.name} – {new Date(ev.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short"
          })}
        </p>
      ))
    )}

  </div>
</div>
          <div className="right-box">
            <h3>Reminders</h3>
            <div className="right-content">
{weeklyReminders.length === 0 ? (
  <p>No reminders this week</p>
) : (
  weeklyReminders.map((ev, i) => {
    const d = new Date(ev.reminderDate);
    return (
      <p key={i}>
        {d.getDate()} {d.toLocaleString("en-US", { month: "short" })} - {ev.title}
      </p>
    );
  })
)}
            </div>
          </div>
<div className="right-box">
  <h3>Birthdays</h3>
  <div className="right-content">
    {birthdays.length === 0 ? (
      <p>No birthdays this week</p>
    ) : (
      birthdays.map((b, i) => (
        <p key={i}>
          {b.name} - {new Date(b.dob).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short"
          })}
        </p>
      ))
    )}
  </div>
</div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM SECTION: FOLLOW-UP + CALENDAR + REMINDERS ===== */}
      <div className="bottom-section">
        <div className="followup-section">


          <div className="followup-main">
            {/* FOLLOWUP CARDS LEFT SIDE */}
            <div className="followup-card">
            <div className="followup-cards">
              <button className="quick-btn add-emp" onClick={() => navigate("/admin/employees")}>
                👤 Add Employee
              </button>
              <button className="quick-btn training" onClick={() => navigate("/admin/traininganddevelopment")}>
                🎓 Assign Training
              </button>
              <button className="quick-btn leave" onClick={() => navigate("/admin/leaves")}>
                📝 Leave Request
              </button>
              <button className="quick-btn post-job" onClick={() => navigate("/admin/careers")}>
                💼 Post Job
              </button>
              <button className="quick-btn attendance" onClick={() => navigate("/admin/attendance")}>
              🕒 Attendance
              </button>

            </div>
            </div>

            {/* CALENDAR */}
            <div className="calendar-box">
              <div className="calendar-header">
                <button className="cal-btn" onClick={prevMonth}>◀</button>
                <div className="year-select-box">
                  <span>{monthNames[calMonth]}</span>
                  <span
                    className="year-display"
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                  >
                    {calYear} ▼
                  </span>
                  {showYearDropdown && (
                    <div className="year-dropdown">
                      {Array.from({ length: 20 }, (_, i) => calYear - 10 + i).map((yr) => (
                        <div key={yr} className="year-option">{yr}</div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="cal-btn" onClick={nextMonth}>▶</button>
              </div>

              <table className="calendar-table">
                <thead>
                  <tr>
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                      <th key={d}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calendar.map((week, i) => (
                    <tr key={i}>
                      {week.map((day, j) => {
                        const fullDate =
                          day &&
                          `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isPast =
                          day &&
                          new Date(calYear, calMonth, day).setHours(0, 0, 0, 0) <
                            new Date().setHours(0, 0, 0, 0);
                        return (
                          <td
  key={fullDate || `${i}-${j}`}
  className={`day
    ${getEventForDate(day) ? "highlight" : ""}
    ${selectedDate === fullDate ? "selected" : ""}
    ${isPast ? "past-day" : ""}`}
  style={{
    pointerEvents: isPast ? "none" : "auto",
    opacity: isPast ? 0.4 : 1,
    position: "relative"
  }}

  // SINGLE CLICK → select date
  onClick={() => {
  if (!isPast && day) {
    const ev = getEventForDate(day);

    // 🔥 TOGGLE LOGIC
    if (selectedDate === fullDate) {
      setSelectedDate("");       // unselect
      setEditingEvent(null);
      return;
    }

    // Select new date
    setSelectedDate(fullDate);

    if (ev) {
      setEditingEvent(ev);
      setEditText(ev.title);
    } else {
      setEditingEvent(null);
    }
  }
}}
>
  {day}
</td>

                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {editingEvent && (
                <div className="reminder-popup-overlay" onClick={() => setEditingEvent(null)}>
                  <div className="reminder-popup" onClick={(e) => e.stopPropagation()}>
                    <h4>Edit Reminder</h4>

                    <input
                      type="text"
                      className="edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />

                    <div className="popup-actions">
                      <button
                        className="popup-btn save"
                        onClick={() => {
                          setEvents(events.map(ev =>
                            ev.type === editingEvent.type ? { ...ev, title: editText } : ev
                          ));
                          setEditingEvent(null);
                        }}
                      >
                        Save
                      </button>

                      <button
                        className="popup-btn delete"
                        onClick={() => {
                          setEvents(events.filter(ev => ev.type !== editingEvent.type));
                          setEditingEvent(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="add-reminder-box">
                <input
                  type="text"
                  className="reminder-input"
                  placeholder="Add reminder..."
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                />
                <button className="add-reminder-btn" onClick={handleAddReminder}>
                  ➕ Add Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-switch-box">
        {/* Switch buttons */}
        <div className="switch-buttons">
          <button
            className={`switch-btn ${activeTable === 1 ? "active" : ""}`}
            onClick={() => setActiveTable(1)}
          >
            Employee Performance
          </button>
          <button
            className={`switch-btn ${activeTable === 2 ? "active" : ""}`}
            onClick={() => setActiveTable(2)}
          >
            Project Details
          </button>
        </div>

        {/* Tables */}
        <div className="table-container">
          {activeTable === 1 && (
            <table className="data-table">
             <thead>
  <tr>
    <th>Name</th>

    <th>
  <div className="header-inline">

    <select
      name="role"
      value={filters.role}
      onChange={handleFilterChange}
      className="filter-header-select"
    >
      <option value="">Role</option>
      {getUniqueValues("role").map((val) => (
        <option key={val} value={val}>
          {val}
        </option>
      ))}
    </select>
  </div>
</th>
   <th>
  <div className="header-inline">
   <select
  name="score"
  value={filters.score}
  onChange={handleFilterChange}
  className="filter-header-select"
>
  <option value="">Rating</option>
  <option value="4-5">4 - 5</option>
  <option value="3-4">3 - 4</option>
  <option value="3-below">Below 3</option>
</select>
  </div>
</th>
    <th>
  <div className="header-inline">

    <select
      name="performance"
      value={filters.performance}
      onChange={handleFilterChange}
      className="filter-header-select"
    >
      <option value="">Performance</option>
      {getUniqueValues("performance").map((val) => (
        <option key={val} value={val}>
          {val}
        </option>
      ))}
    </select>
  </div>
</th>
    <th>Action</th>
  </tr>
</thead>

              <tbody>
  {filteredData.map((row, i) => (
    <tr key={i}>
      <td>{row.name}</td>
      <td>{row.role}</td>
      <td>{row.score}</td>
      <td>{row.performance}</td>
      <td>View</td>
    </tr>
  ))}
</tbody>

            </table>
          )}
          {activeTable === 2 && (
            <table className="data-table">
              <thead>
  <tr>
    <th>Project Name</th>
    <th>Project ID</th>

  {/* FROM DATE HEADER */}
<th style={{ width: "120px", position: "sticky" }}>
  <div
    className="header-inline"
    onClick={() => setShowProjectFromPicker(!showProjectFromPicker)}
    style={{
      cursor: "pointer",
      justifyContent: "center",
      width: "100px",
    }}
  >
    From 📅
  </div>

  {showProjectFromPicker && (
    <input
      type="date"
      className="header-date-picker"
      name="projectFrom"
      value={filters.projectFrom}
      onChange={handleFilterChange}
    />
  )}
</th>

{/* TO DATE HEADER */}
<th style={{ width: "120px", position: "sticky" }}>
  <div
    className="header-inline"
    onClick={() => setShowProjectToPicker(!showProjectToPicker)}
    style={{
      cursor: "pointer",
      justifyContent: "center",
      width: "100px",
    }}
  >
    To 📅
  </div>

  {showProjectToPicker && (
    <input
      type="date"
      className="header-date-picker"
      name="projectTo"
      value={filters.projectTo}
      onChange={handleFilterChange}
    />
  )}
</th>


    <th>No. of Employees</th>
  </tr>
</thead>

              <tbody>
  {filteredProjects.map((p, i) => (
    <tr key={i}>
      <td>{p.name}</td>
      <td>{p.id}</td>
      <td>{p.from}</td>
      <td>{p.to}</td>
      <td>{p.employees}</td>
    </tr>
  ))}
</tbody>
            </table>
          )}
        </div>
      </div>
      <div className={`profile-side-panel ${showProfilePopup ? "open" : ""}`}>
  <div className="profile-panel-header">
    <h3>Profile Details</h3>
    <span className="hr-close-btn" onClick={() => setShowProfilePopup(false)}>×</span>
  </div>

  <div className="profile-image-section">
    {profileImage ? (
      <>
        <img src={profileImage} alt="Profile" className="profile-img" />
        <button className="remove-img-btn" onClick={handleRemoveImage}>
          Remove
        </button>
      </>
    ) : (
      <label className="upload-label">
        Upload Image
        <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
      </label>
    )}
  </div>

  <div className="profile-details">
    <p><strong>Name:</strong> {userDetails.name}</p>
    <p><strong>Designation:</strong> {userDetails.designation}</p>
    <p><strong>Email:</strong> {userDetails.email}</p>
    <p><strong>Employee ID:</strong> {userDetails.empId}</p>
  </div>
</div>

    </div>
  );
};

export default AdminDashboard;
