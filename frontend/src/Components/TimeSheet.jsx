import React, { useMemo, useState, useRef } from "react";
import Select from "react-select";
import "./TimeSheet.css";

export default function TimeSheet() {
  // --- State ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState({});
  const [category, setCategory] = useState("");
  const [projectName, setProjectName] = useState(null);
  const [projectCode, setProjectCode] = useState(null);
  const [projectType, setProjectType] = useState("billable");
  const [hours, setHours] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const formRef = useRef(null);
  const calendarRef = useRef(null);

  // --- Categories with projects and codes ---
  const CATEGORIES = {
    Finance: {
      "Budget Analysis": ["FIN101", "FIN102", "FIN103", "FIN104"],
      "Payroll Management": ["PAY201", "PAY202", "PAY203"],
      "Audit & Compliance": ["AUD301", "AUD302", "AUD303"],
    },
    "Front-End Developer": {
      "UI Enhancement": ["FE101", "FE102", "FE103"],
      "React UI Design": ["FE201", "FE202", "FE203"],
      "Website Optimization": ["FE301", "FE302", "FE303"],
    },
    "Back-End Developer": {
      "API Development": ["BE101", "BE102", "BE103"],
      "Database Management": ["BE201", "BE202", "BE203"],
      "Microservices": ["BE301", "BE302", "BE303"],
    },
    Marketing: {
      "Digital Campaigns": ["MKT101", "MKT102", "MKT103"],
      "SEO Optimization": ["MKT201", "MKT202", "MKT203"],
      "Brand Strategy": ["MKT301", "MKT302", "MKT303"],
    },
    "HR(Human Resources)": {
      "Recruitment Drive": ["HR101", "HR102", "HR103"],
      "Employee Training": ["HR201", "HR202", "HR203"],
      "Employee Engagement": ["HR301", "HR302", "HR303"],
    },
    Sales: {
      "Lead Generation": ["SAL101", "SAL102", "SAL103"],
      "Client Acquisition": ["SAL201", "SAL202", "SAL203"],
      "CRM Maintenance": ["SAL301", "SAL302", "SAL303"],
    },
    Design: {
      "UX Research": ["DSN101", "DSN102", "DSN103"],
      "Wireframing": ["DSN201", "DSN202", "DSN203"],
      "Graphic Design": ["DSN301", "DSN302", "DSN303"],
    },
    Operations: {
      "Workflow Automation": ["OPS101", "OPS102", "OPS103"],
      "Inventory Management": ["OPS201", "OPS202", "OPS203"],
      "Process Optimization": ["OPS301", "OPS302", "OPS303"],
    },
    "IT Support": {
      "Helpdesk Support": ["IT101", "IT102", "IT103"],
      "System Maintenance": ["IT201", "IT202", "IT203"],
      "Network Setup": ["IT301", "IT302", "IT303"],
    },
  };

  // Holidays placeholder
  const holidaysSet = useMemo(() => new Set(), []);

  const fmtKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const monthName = useMemo(
    () => new Date(year, month).toLocaleString("default", { month: "long" }),
    [month, year]
  );

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
    setSelectedDate(null);
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const totalHours = Object.entries(entries).reduce((sum, [k, e]) => {
    const parts = k.split("-").map((x) => parseInt(x, 10));
    if (parts[0] === year && parts[1] === month + 1) return sum + (e.hours || 0);
    return sum;
  }, 0);

  const isDateEditable = (dateObj) => {
    const key = fmtKey(dateObj);
    if (holidaysSet.has(key)) return false;
    const entryDate = new Date(dateObj);
    entryDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - entryDate) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  };

  const buildWeeks = () => {
    const weeks = [];
    const firstOfMonth = new Date(year, month, 1);
    const start = new Date(firstOfMonth);
    start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }
    for (let w = 0; w < 6; w++) {
      weeks.push(cells.slice(w * 7, w * 7 + 7));
    }
    return weeks;
  };

  const weeks = buildWeeks();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate) return alert("Select a date first!");
    if (!isDateEditable(selectedDate))
      return alert("Cannot update timesheet for holidays or older than 2 days.");
    if (!projectName || !projectCode) return alert("Select project and code!");

    const key = fmtKey(selectedDate);
    const h = parseFloat(hours || 0);
    if (isNaN(h) || h < 0 || h > 9) return alert("Enter valid hours (0 - 9).");

    setEntries({
      ...entries,
      [key]: {
        category,
        projectName: projectName.value,
        projectCode: projectCode.value,
        projectType,
        hours: h,
      },
    });

    // reset form
    setCategory("");
    setProjectName(null);
    setProjectCode(null);
    setProjectType("billable");
    setHours("");

    if (calendarRef.current)
      calendarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="timesheet-container">
      {/* Calendar */}
      <div ref={calendarRef}>
        <header className="header">
          <button onClick={handlePrev}>&lt;</button>
          <h2>
            {monthName} {year}
          </h2>
          <button onClick={handleNext}>&gt;</button>
        </header>

        <div className="weekday-row">
          {weekDays.map((d) => (
            <div key={d} className="weekday">
              {d}
            </div>
          ))}
          <div className="week-total-header">Weekly Hours</div>
        </div>

        <div className="weeks-wrapper">
          {weeks.map((week, wi) => {
            const weekTotal = week.reduce((sum, dateObj) => {
              const key = fmtKey(dateObj);
              return sum + ((entries[key] && entries[key].hours) || 0);
            }, 0);

            return (
              <div className="week-row" key={wi}>
                {week.map((dateObj, ci) => {
                  const key = fmtKey(dateObj);
                  const entry = entries[key];
                  const currentMonth = dateObj.getMonth() === month && dateObj.getFullYear() === year;
                  const editable = isDateEditable(dateObj);
                  const isSunday = dateObj.getDay() === 0;

                  const hoursValue = entry?.hours ?? null;

                  let cellClass = "cell";
                  if (!currentMonth) cellClass += " other-month";
                  if (hoursValue >= 9) cellClass += " cell-green";
                  else if (hoursValue > 0) cellClass += " cell-yellow";
                  else if (hoursValue === 0) cellClass += " cell-red";
                  if (dateObj.getDay() === 6) cellClass += " weekend";
                  if (isSunday) cellClass += " sunday-cell";
                  if (!editable) cellClass += " not-editable";
                  if (sameDay(selectedDate, dateObj)) cellClass += " selected-day";

                  return (
                    <div
                      key={ci}
                      className={cellClass}
                      onClick={() => {
                        if (!currentMonth) {
                          setMonth(dateObj.getMonth());
                          setYear(dateObj.getFullYear());
                        }
                        setSelectedDate(new Date(dateObj));
                        if (entries[key]) setShowPopup(true);
                        if (formRef.current)
                          formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      <div className="day">{dateObj.getDate()}</div>
                      {entry && <div className="hours">{entry.hours}h</div>}
                    </div>
                  );
                })}
                <div className="week-total-cell">{weekTotal.toFixed(1)}h</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="summary total-summary" style={{ marginTop: 18 }}>
        <h3>Monthly Total: {totalHours.toFixed(1)} hours</h3>
      </div>

      {selectedDate && (
        <div className="selected-date-display" style={{ marginTop: 12 }}>
          <span>📅 Selected Date:</span> <strong>{selectedDate.toDateString()}</strong>
        </div>
      )}

      {/* --- Entry Form --- */}
      <form className="entry-form" onSubmit={handleSubmit} ref={formRef} style={{ marginTop: 20 }}>
        <h4>Add / Update Entry</h4>

        {/* Category */}
        <div className="form-row">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setProjectName(null);
              setProjectCode(null);
            }}
            required
          >
            <option value="">Select Category</option>
            {Object.keys(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Project Name */}
        <div className="form-row">
          <label>Project Name:</label>
          <Select
            className="project-name"
            value={projectName}
            onChange={(val) => {
              setProjectName(val);
              setProjectCode(null);
            }}
            options={
              category
                ? Object.keys(CATEGORIES[category]).map((p) => ({ value: p, label: p }))
                : []
            }
            placeholder="Search or select project"
            isDisabled={!category}
            isSearchable
          />
        </div>

        {/* Project Code */}
        <div className="form-row">
          <label>Project Code:</label>
          <Select
            className="project-name"
            value={projectCode}
            onChange={(val) => setProjectCode(val)}
            options={
              projectName
                ? CATEGORIES[category][projectName.value].map((c) => ({ value: c, label: c }))
                : []
            }
            placeholder="Search or select code"
            isDisabled={!projectName}
            isSearchable
          />
        </div>

        {/* Project Type */}
        <div className="project-type">
          <label>Project Type:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="projectType"
                value="billable"
                checked={projectType === "billable"}
                onChange={(e) => setProjectType(e.target.value)}
              />
              <span>Billable</span>
            </label>
            <label>
              <input
                type="radio"
                name="projectType"
                value="non-billable"
                checked={projectType === "non-billable"}
                onChange={(e) => setProjectType(e.target.value)}
              />
              <span>Non-Billable</span>
            </label>
          </div>
        </div>

        {/* Hours */}
        <div className="form-row">
          <label>Hours:</label>
          <input
            type="number"
            min="0"
            max="9"
            step="0.1"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save Entry</button>
      </form>

      {/* Popup */}
      {showPopup && selectedDate && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedDate.toDateString()} - Project Details</h3>
            <hr />
            {entries[fmtKey(selectedDate)] ? (
              <>
                <p>
                  <strong>Category:</strong> {entries[fmtKey(selectedDate)].category}
                </p>
                <p>
                  <strong>Project Name:</strong> {entries[fmtKey(selectedDate)].projectName}
                </p>
                <p>
                  <strong>Project Code:</strong> {entries[fmtKey(selectedDate)].projectCode}
                </p>
                <p>
                  <strong>Project Type:</strong> {entries[fmtKey(selectedDate)].projectType}
                </p>
                <p>
                  <strong>Hours:</strong> {entries[fmtKey(selectedDate)].hours}h
                </p>
              </>
            ) : (
              <p>No data available for this date.</p>
            )}
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
