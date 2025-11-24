import React, { useMemo, useState, useEffect, useRef } from "react";
import "./AdminDashboard.css";
import axios from "axios";

import {
  FiSearch,
  FiBell,
  FiChevronDown,
  FiClock,
  FiSun,
  FiMoon,
  FiPlus,
  FiEdit2,
} from "react-icons/fi";
 import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/**
 * Advanced Admin Dashboard (full)
 * - Full feature set: stats, attendance pie, training bar, calendar, events, pending, tasks, reminders
 * - Search behavior (MODIFIED): user types full employee name or ID and presses Enter -> selects employee
 *   and auto-scrolls to the charts section (attendance + training) showing that employee's details.
 *
 * Modifications included:
 * - Enter on full name/ID selects employee and auto-scrolls.
 * - Clearing the search input (backspace to empty) clears selection and shows Company overview.
 * - Calendar date clicking is disabled for today & past dates; only future dates can be added/edited.
 * - Attendance month dropdown disables future months.
 * - Chart colors adapt to darkMode for visibility.
 *
 * Replace your AdminDashboard.jsx with this file.
 */

export default function AdminDashboard() {
  // ---------- UI state ----------
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // drives calendar month/year

  // SPLIT the month state: one for calendar navigation, one for attendance/training charts
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().getMonth());
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // ref used for auto-scrolling to chart area
  const chartsRef = useRef(null);

  // ---------- Employee dataset (sample) ----------
  // keep many sample employees as you requested (expand as required)
  const employees = [
    { id: "E001", name: "Likith", role: "frontend", attendance: 90 },
    { id: "E002", name: "Jagadeesh", role: "backend", attendance: 80 },
    { id: "E003", name: "Tataji", role: "frontend", attendance: 72 },
    { id: "E004", name: "Rohith", role: "backend", attendance: 85 },
    { id: "E005", name: "Vignesh", role: "frontend", attendance: 95 },
    { id: "E006", name: "Balaji", role: "frontend", attendance: 88 },
    { id: "E007", name: "Karthik", role: "backend", attendance: 82 },
    { id: "E008", name: "Akashay", role: "frontend", attendance: 76 },
    { id: "E009", name: "Guru", role: "backend", attendance: 79 },
    { id: "E010", name: "Devi", role: "UI/UX", attendance: 92 },
    // add more as needed...
  ];

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // ---------- Notifications & pending actions ----------
  const [notifications] = useState([
    {
      title: "Approvals",
      icon: "✅",
      items: ["2 new leave approvals", "1 pending expense claim"],
    },
    {
      title: "Requests",
      icon: "📩",
      items: ["3 support requests pending", "1 team request"],
    },
    {
      title: "Payroll",
      icon: "💰",
      items: ["Payroll review required", "Salary sheet update"],
    },
    {
      title: "Timesheet",
      icon: "🕒",
      items: ["5 timesheets need validation"],
    },
  ]);

  const [pending] = useState([
    { id: "approvals", label: "Approvals" },
    { id: "requests", label: "Requests" },
    { id: "payroll", label: "Payroll" },
    { id: "timesheet", label: "Time sheet" },
  ]);

  // ---------- Events & tasks ----------
  const [events, setEvents] = useState([
    { date: "2025-10-31", label: "Devi Birthday", type: "birthday" },
    { date: "2025-11-02", label: "Team Outing", type: "custom" },
    { date: "2025-11-11", label: "Company Meeting", type: "meeting" },
    { date: "2025-11-15", label: "Client Review Call", type: "meeting" },
    { date: "2025-11-24", label: "Project Deadline", type: "custom" },
  ]);

  // ---------- Company stats ----------
  const [stats, setStats] = useState({
    totalEmployees: 50,
    jobApplied: 77,
    leaveRequests: 35,
    tasks: [],
    employeesAdded: 0,
  });

  // ---------- Months ----------
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // keep calendarMonth in sync with selectedDate (calendar browsing)
  useEffect(() => {
    setCalendarMonth(selectedDate.getMonth());
  }, [selectedDate]);

  // ensure attendanceMonth is not a future month (run once on mount)
  useEffect(() => {
    const current = new Date().getMonth();
    if (attendanceMonth > current) {
      setAttendanceMonth(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- COMPANY MONTHLY ATTENDANCE (derived) ----------
  const monthlyAttendance = useMemo(() => {
    const baseData = [
      { present: 65, absent: 35 },
      { present: 70, absent: 30 },
      { present: 80, absent: 20 },
      { present: 60, absent: 40 },
      { present: 75, absent: 25 },
      { present: 68, absent: 32 },
      { present: 85, absent: 15 },
      { present: 72, absent: 28 },
      { present: 90, absent: 10 },
      { present: 65, absent: 35 },
      { present: 78, absent: 22 },
      { present: 82, absent: 18 },
    ];

    return baseData.map((m) => {
      const presentCount = Math.round((m.present / 100) * stats.totalEmployees);
      const absentCount = stats.totalEmployees - presentCount;
      const presentPercent = Math.round((presentCount / stats.totalEmployees) * 100);
      const absentPercent = 100 - presentPercent;
      return {
        present: presentPercent,
        absent: absentPercent,
        presentCount,
        absentCount,
      };
    });
  }, [stats.totalEmployees]);

  // ---------- PIE DATA (attendance) ----------
  // NOTE: charts use attendanceMonth now (separate from calendarMonth)
  const pieData = useMemo(() => {
    if (selectedEmployee) {
      const att = Math.min(100, Math.max(0, Number(selectedEmployee.attendance || 0)));
      return [
        { name: "Present", value: att },
        { name: "Absent", value: 100 - att },
      ];
    }
    const company = monthlyAttendance[attendanceMonth] || { present: 0, absent: 100 };
    return [
      { name: "Present", value: company.present },
      { name: "Absent", value: company.absent },
    ];
  }, [selectedEmployee, monthlyAttendance, attendanceMonth]);

  // ---------- Training / Development ----------
  const allDevCourses = {
    frontend: {
      reactjs: [40, 60, 80, 90],
      reactnative: [30, 50, 70, 85],
    },
    backend: {
      nodejs: [35, 55, 75, 85],
    },
  };

  // default selectedDev will be overwritten when user selects an employee
  const [selectedDev, setSelectedDev] = useState("frontend");
  const [selectedCourse, setSelectedCourse] = useState("");
  

  // When user selects employee, auto-set dev type and clear course
  useEffect(() => {
    if (selectedEmployee) {
      setSelectedDev(selectedEmployee.role);
      setSelectedCourse("");
    }
  }, [selectedEmployee]);

  const trainingBarData = useMemo(() => {
    const defaultCourse =
      selectedDev === "frontend" ? allDevCourses.frontend.reactjs : allDevCourses.backend.nodejs;

    const chosenArr = (() => {
      if (selectedDev === "frontend") {
        return selectedCourse && allDevCourses.frontend[selectedCourse]
          ? allDevCourses.frontend[selectedCourse]
          : allDevCourses.frontend.reactjs;
      }
      if (selectedDev === "backend") {
        return selectedCourse && allDevCourses.backend[selectedCourse]
          ? allDevCourses.backend[selectedCourse]
          : allDevCourses.backend.nodejs;
      }
      return defaultCourse;
    })();

    return chosenArr.map((val, idx) => {
      const prev = idx === 0 ? 0 : chosenArr[idx - 1];
      const base = prev;
      const increment = Math.max(0, val - prev);
      return {
        name: `Week ${idx + 1}`,
        base,
        increment,
      };
    });
  }, [selectedDev, selectedCourse]);

  // ---------- Compose tasks from events ----------
  useEffect(() => {
    const today = new Date();
    const futureEvents = events.filter((ev) => new Date(ev.date) >= today);
    const sortedEvents = [...futureEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
    const formattedTasks = sortedEvents.map((ev) => {
      const d = new Date(ev.date);
      const options = { month: "short", day: "numeric" };
      return `${d.toLocaleDateString("en-US", options)} — ${ev.label}`;
    });
    setStats((prev) => ({
      ...prev,
      tasks: formattedTasks.length > 0 ? formattedTasks : ["No upcoming tasks or events"],
    }));
  }, [events]);

  // ---------- Calendar generation ----------
  const calYear = selectedDate.getFullYear();
  // calMonth MUST come from calendarMonth (so calendar navigation won't affect charts)
  const calMonth = calendarMonth;

  const buildCalendar = (year, month) => {
    const first = new Date(year, month, 1);
    const startDay = first.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let week = new Array(7).fill(null);
    let dayCounter = 1;

    // Fill first week starting at startDay index
    for (let i = startDay; i < 7; i++) {
      week[i] = dayCounter++;
    }
    weeks.push(week.slice());

    // Continue weeks
    while (dayCounter <= daysInMonth) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
        week[i] = dayCounter++;
      }
      weeks.push(week.slice());
    }
    return weeks;
  };

  // calendar uses calYear and calMonth (calendarMonth)
  const calendar = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);

  const prevMonth = () => {
    // navigate calendar month by moving selectedDate (keeps calendarMonth in sync via effect)
    setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  // handler for clicking a date in calendar
  // IMPORTANT: only allow adding/editing events for future dates (strictly greater than today)
  const handleDateClick = (day) => {
    if (!day) return;

    const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const clickedDate = new Date(`${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    const todayNoTime = new Date();
    todayNoTime.setHours(0, 0, 0, 0);

    // disable if clicked date is today or in the past
    if (clickedDate <= todayNoTime) {
      // do nothing; past and today's dates are disabled for editing
      return;
    }

    const existing = events.find((ev) => ev.date === dateKey);
    const label = prompt("Enter event label", existing ? existing.label : "");
    if (label !== null) {
      const newEvents = events.filter((ev) => ev.date !== dateKey);
      if (label.trim() !== "") newEvents.push({ date: dateKey, label, type: "custom" });
      setEvents(newEvents);
    }
  };

  const isEvent = (day) => {
    if (!day) return false;
    const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.some((ev) => ev.date === dateKey);
  };

  // ---------- Update employees prompt ----------
  const handleUpdateEmployees = () => {
    const input = prompt("Enter new total employee count", stats.totalEmployees);
    if (input !== null && !isNaN(input)) {
      const newCount = parseInt(input, 10);
      const added = newCount > stats.totalEmployees ? newCount - stats.totalEmployees : 0;
      setStats((prev) => ({ ...prev, totalEmployees: newCount, employeesAdded: added }));
    }
  };

  // ---------- Dark mode side effect ----------
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ---------- Auto-scroll helper ----------
  const scrollToCharts = (delay = 120) => {
    setTimeout(() => {
      if (chartsRef.current) chartsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }, delay);
  };

  // ---------- Modified Search handling (ENTER -> select full name / id and scroll) ----------
  const handleSearchKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = search.trim();
    if (!value) {
      setSelectedEmployee(null);
      return;
    }

    // match exact full name (case-insensitive) OR exact id (case-insensitive)
    const found = employees.find(
      (emp) => emp.name.toLowerCase() === value.toLowerCase() || emp.id.toLowerCase() === value.toLowerCase()
    );

    if (found) {
      setSelectedEmployee(found);
      setSelectedDev(found.role);
      setSelectedCourse("");
      // when selecting employee, keep charts showing attendanceMonth (unchanged)
      scrollToCharts();
    } else {
      // not found: alert (or you can show inline message)
      alert("Employee not found. Please enter the full name or the exact ID and press Enter.");
      setSelectedEmployee(null);
    }
  };

  // For typing behaviour: update search value.
  // If the user clears the input (empty), clear selectedEmployee so charts revert to Company view.
  const handleSearchChange = (value) => {
    setSearch(value);
    if (value.trim() === "") {
      // user cleared the search input -> revert to company view
      setSelectedEmployee(null);
      // reset role selection if you want; here we keep selectedDev untouched (it will default)
      setSelectedCourse("");
    }
  };

  // pie colors
  const pieColors = ["#10b981", "#7c3aed"];

  // today's date for calendar highlight
  const today = new Date();
  const todayDate = today.getDate();
  // isThisMonth should compare with calendarMonth (for the calendar view)
  const isThisMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;

  // helper for upcoming tasks (first 6)
  const upcomingList = useMemo(() => {
    const now = new Date();
    const list = events
      .map((ev) => ({ ...ev, dateObj: new Date(ev.date) }))
      .filter((e) => e.dateObj >= now)
      .sort((a, b) => a.dateObj - b.dateObj)
      .slice(0, 6)
      .map((ev) => `${ev.dateObj.toLocaleString("en-US", { month: "short", day: "numeric" })} — ${ev.label}`);

    if (list.length === 0) {
      return stats.tasks && stats.tasks.length ? stats.tasks.slice(0, 6) : ["No upcoming events"];
    }
    return list;
  }, [events, stats.tasks]);

  // sample employee list UI for directory (scroll not to employee card but charts; still show directory)
  // to indicate selection visually in the employee list we can highlight selectedEmployee's row
  const employeeList = employees; // alias

  // ---------- Helpers for disabling future months in attendance/training dropdown ----------
  const currentMonthIndex = new Date().getMonth();
  const monthOptions = monthNames.map((m, i) => ({ label: m, value: i, disabled: i > currentMonthIndex }));

  return (
    <div className="dashboard-wrap">
      {/* HEADER */}
      <header className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h2>Company Dashboard</h2>

          <div className="search" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiSearch color="currentColor" />
            <input
              placeholder="Search by full name or ID and press Enter..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Theme toggle */}
          <button
            className="mode-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle theme"
            title={darkMode ? "Switch to light" : "Switch to dark"}
          >
            {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
        </div>
      </header>

      {/* STATS GRID */}
      <section className="stats-grid">
        <div className="card">
          <div className="small">Total Employees</div>
          <div className="big">{stats.totalEmployees}</div>
          {/* <button className="btn-update" onClick={handleUpdateEmployees}>Add / Update</button> */}
          <div className="footer-note" style={{ marginTop: 8 }}>
            {stats.employeesAdded > 0 ? `${stats.employeesAdded} new employees added` : "No new employees"}
          </div>
        </div>

        <div className="card">
          <div className="small">Job Applied</div>
          <div className="big">{stats.jobApplied}</div>
          <div className="footer-note">+22.0%</div>
        </div>

        <div className="card">
          <div className="small">Leave Request</div>
          <div className="big">{stats.leaveRequests}</div>
          <div className="footer-note">+12.0%</div>
        </div>

        <div className="card upcoming-events">
          <div className="small">Upcoming Tasks & Events</div>
          <ol style={{ margin: "8px 0 0 18px", padding: 0 }}>
            {(stats.tasks || []).slice(0, 5).map((t, i) => (
              <li key={i} style={{ fontSize: 13 }}>{t}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="main-grid">
        <div style={{ display: "grid", gridTemplateRows: "auto auto", gap: 18 }}>
          {/* PENDING ACTIONS */}
          <div className="card pending">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="title" style={{ fontWeight: 700 }}>Pending Actions</div>
              </div>

              {/* Notification bell moved next to Pending Actions per request */}
              <div style={{ position: "relative" }}>
                <div
                  className="notification-icon"
                  onClick={() => setShowNotifications((s) => !s)}
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                >
                  <FiBell />
                  <span className="badge">{notifications.length}</span>
                </div>

                {showNotifications && (
                  <div className="notification-dropdown">
                    {notifications.map((g, i) => (
                      <div key={i} style={{ marginBottom: 8 }}>
                        <strong>{g.icon} {g.title}</strong>
                        <ul style={{ paddingLeft: 16, marginTop: 6 }}>
                          {g.items.map((it, idx) => <li key={idx} style={{ fontSize: 13, color: "var(--muted)" }}>{it}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              {pending.map((p) => (
                <div key={p.id} className="btn" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FiClock />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.label}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Review</div>
                    </div>
                  </div>
                  <FiChevronDown />
                </div>
              ))}
            </div>
          </div>

          {/* Widgets - Attendance & Training */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* Attendance */}
            <div className="widget card" ref={chartsRef}>
              <h4 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  Monthly Attendance Overview
                  {selectedEmployee ? (
                    <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>
                      — {selectedEmployee.name} ({selectedEmployee.id})
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>
                      — Company
                    </span>
                  )}
                </span>

                {/* dropdown must control attendanceMonth only (not calendar month) */}
                <select
                  value={attendanceMonth}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    // disallow selecting future months (safety check)
                    const current = new Date().getMonth();
                    if (v <= current) setAttendanceMonth(v);
                    else setAttendanceMonth(current);
                  }}
                  style={{ border: "none", background: "transparent", fontWeight: 600 }}
                >
                  {monthOptions.map((opt, i) => (
                    <option key={i} value={opt.value} disabled={opt.disabled}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </h4>

              <div style={{ height: 190 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={50}
                      outerRadius={75}
                      dataKey="value"
                      label={({ value }) => `${value}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, idx) => <Cell key={idx} fill={pieColors[idx] || "#ccc"} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: pieColors[0] }} />
                  <small>Present — {Array.isArray(pieData) ? pieData[0].value : "0"}%</small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: pieColors[1] }} />
                  <small>Absent — {Array.isArray(pieData) ? pieData[1].value : "0"}%</small>
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
                {selectedEmployee ? `Employee Attendance: ${selectedEmployee.attendance}%` : `Total Employees: ${stats.totalEmployees}`}
              </div>
            </div>

            {/* Training & Dev */}
            <div className="widget card">
              <h4 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  Training and Development — {monthNames[attendanceMonth]}
                  {selectedEmployee && (
                    <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>
                      — {selectedEmployee.role === "frontend" ? "Frontend Developer" : "Backend Developer"} ({selectedEmployee.name})
                    </span>
                  )}
                </span>

                {/* Role selector: disabled when an employee is selected so UI reflects employee's role */}
                <select
                  value={selectedDev}
                  onChange={(e) => setSelectedDev(e.target.value)}
                  style={{ border: "none", background: "transparent", fontWeight: 600 }}
                  disabled={!!selectedEmployee}
                  title={selectedEmployee ? "Role fixed for selected employee" : "Select role"}
                >
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                </select>
              </h4>

              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                {/* Show only the course dropdown for the selectedDev (if employee selected, dev matches their role) */}
                {selectedDev === "frontend" ? (
                  <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="">Select Course</option>
                    <option value="reactjs">React JS</option>
                    <option value="reactnative">React Native</option>
                  </select>
                ) : (
                  <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="">Select Course</option>
                    <option value="nodejs">Node.js</option>
                  </select>
                )}
              </div>

              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trainingBarData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    {/* Use colors that remain visible in dark mode */}
                    <Bar dataKey="base" stackId="a" fill={darkMode ? "#60a5fa" : "#3b82f6"} />
                    <Bar dataKey="increment" stackId="a" fill={darkMode ? "#34d399" : "#10b981"} />
                  </BarChart>
                </ResponsiveContainer>

                <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: darkMode ? "#60a5fa" : "#3b82f6" }} />
                    <small style={{ fontSize: 12 }}>Previous progress</small>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: darkMode ? "#34d399" : "#10b981" }} />
                    <small style={{ fontSize: 12 }}>New progress</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDAR / REMINDERS (right column) */}
        {/* <aside> */}
          <div className="calendar-card card" style={{ padding: 16 }}>
            {/* Reminders Title */}
            <h3 className="reminder-heading" style={{ marginBottom: 10 }}>Reminders</h3>

            {/* Month Navigation */}
            <div className="calendar-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button className="cal-btn" onClick={prevMonth} aria-label="Previous month">◀</button>
              <div style={{ fontWeight: 700 }}>{monthNames[calMonth]} {calYear}</div>
              <button className="cal-btn" onClick={nextMonth} aria-label="Next month">▶</button>
            </div>

            {/* Calendar Table */}
            <table className="calendar-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <th key={d} style={{ fontSize: 12, color: "var(--muted)", paddingBottom: 8 }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calendar.map((week, i) => (
                  <tr key={i}>
                    {week.map((day, j) => {
                      const isTodayCell = isThisMonth && day === todayDate;
                      const event = isEvent(day);
                      return (
                        <td
                          key={j}
                          onClick={() => handleDateClick(day)}
                          className={`day-cell ${!day ? "empty" : ""} ${event ? "event-day" : ""} ${isTodayCell ? "today" : ""}`}
                          style={{
                            padding: 8,
                            textAlign: "center",
                            cursor: day ? "pointer" : "default",
                            borderRadius: 6,
                            userSelect: "none",
                          }}
                        >
                          {day || ""}
                          {event && <div style={{ fontSize: 10, marginTop: 6, color: "var(--muted)" }}>●</div>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        {/* </aside> */}
      </div>

    </div>
  );
}

