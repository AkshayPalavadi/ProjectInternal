import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaFilter } from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./AttendanceEmp.css";

export default function AttendanceEmp() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filterRef = useRef(null);

  const [filters, setFilters] = useState({
    employeeId: "",
    employeeName: "",
    role: "",
    department: "",
    project: "",
    date: "",
    status: "",
    workHours: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  // 🔹 Fetch timesheet from API
  useEffect(() => {
    async function fetchTimesheet() {
      try {
        const res = await fetch(
          "https://internal-website-rho.vercel.app/api/timesheet/all/employees"
        );

        const data = await res.json();

        const formatted = data.timesheet.map((item) => ({
          employeeId: item.employeeId,
          employeeName: item.employeeName,
          role: item.role,
          department: item.department,
          date: item.date,
          project: item.project,
          status: item.status,
          workHours: item.workHours, // Already numbers (8,9, etc.)
        }));

        setAttendanceData(formatted);
      } catch (error) {
        console.error("Failed to load timesheet:", error);
      }
    }

    fetchTimesheet();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getUniqueValues = (col) =>
    [...new Set(attendanceData.map((item) => item[col]))].filter(
      (v) => v && v !== "-"
    );

  // 🔹 Table filtering logic
  const tableData = useMemo(() => {
    let filtered = attendanceData;

    // Search bar
    if (searchTerm) {
      filtered = filtered.filter(
        (row) =>
          row.employeeId.toString() === searchTerm ||
          row.employeeName.toLowerCase() === searchTerm.toLowerCase()
      );
    }

    // Filters
    filtered = filtered.filter((row) =>
      Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        return row[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
      })
    );

    // Default show today
    if (!searchTerm && Object.values(filters).every((v) => v === "")) {
      filtered = filtered.filter((row) => row.date === formattedToday);
    }

    return filtered;
  }, [attendanceData, searchTerm, filters]);

  // 🔹 Graph Data
  const getCurrentWeekDates = () => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1;
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(curr);
      d.setDate(first + i);
      return d.toISOString().split("T")[0];
    });
  };
  const currentWeekDates = getCurrentWeekDates();

  // Line chart
  const lineChartData = useMemo(() => {
    const isSearching = searchTerm !== "";
    const relevant = isSearching
      ? attendanceData.filter(
          (r) =>
            r.employeeId.toString() === searchTerm ||
            r.employeeName.toLowerCase() === searchTerm.toLowerCase()
        )
      : attendanceData.filter((r) => currentWeekDates.includes(r.date));

    const map = {};
    if (isSearching) {
      relevant.forEach((r) => {
        if (r.status === "Absent") return;
        const key = `${r.employeeName} (${r.employeeId})`;
        if (!map[r.date]) map[r.date] = { date: r.date };
        map[r.date][key] = Number(r.workHours);
      });
    } else {
      relevant.forEach((r) => {
        if (r.status === "Absent") return;
        if (!map[r.date]) map[r.date] = { date: r.date, total: 0, count: 0 };
        map[r.date].total += Number(r.workHours);
        map[r.date].count++;
      });
      Object.keys(map).forEach(
        (d) => (map[d].avgHours = (map[d].total / map[d].count).toFixed(2))
      );
    }

    return Object.values(map);
  }, [attendanceData, searchTerm]);

  // Bar chart
  const barChartData = useMemo(() => {
    const isSearching = searchTerm !== "";
    const relevant = isSearching
      ? attendanceData.filter(
          (r) =>
            r.employeeId.toString() === searchTerm ||
            r.employeeName.toLowerCase() === searchTerm.toLowerCase()
        )
      : attendanceData.filter((r) => new Date(r.date) <= today);

    const map = {};
    relevant.forEach((r) => {
      if (r.status === "Absent") return;
      const week = Math.ceil(new Date(r.date).getDate() / 7);
      const hrs = Number(r.workHours);
      if (!map[week]) map[week] = { week: `W${week}`, total: 0, count: 0 };
      map[week].total += hrs;
      map[week].count++;
    });
    Object.keys(map).forEach(
      (w) => (map[w].avgHours = (map[w].total / map[w].count).toFixed(2))
    );

    return Object.values(map);
  }, [attendanceData, searchTerm]);

  // Close filter panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.classList.contains("filter-icon")
      ) {
        setShowFilterPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="attendance-emp">
      <div className="search-bar" style={{ marginBottom: "15px" }}>
        <input
          className="input-search-bar"
          type="text"
          placeholder="Search by Employee ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Graphs */}
      <div className="attendance-graphs">
        <div className="graph-box">
          <h4>Current Week Attendance (Mon–Fri)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-30} textAnchor="end" height={60} interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              {lineChartData[0] &&
                (searchTerm ? (
                  Object.keys(lineChartData[0])
                    .filter((k) => k !== "date")
                    .map((k, i) => (
                      <Line
                        key={k}
                        dataKey={k}
                        stroke={`hsl(${i * 60},70%,50%)`}
                        strokeWidth={3}
                      />
                    ))
                ) : (
                  <Line type="monotone" dataKey="avgHours" stroke="#007bff" strokeWidth={3} />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-box">
          <h4>Monthly Attendance (Weekly Avg Hours)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgHours" barSize={35} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="table-header">
        <h3>Employee Attendance Table</h3>
        <FaFilter
          className="filter-icon"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        />
      </div>

      {showFilterPanel && (
        <div className="filter-panel-fixed" ref={filterRef}>
          {Object.keys(filters).map((col) => (
            <div key={col} className="filter-item">
              <label>{col.charAt(0).toUpperCase() + col.slice(1)}</label>

              {col === "date" ? (
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                />
              ) : (
                <>
                  <input
                    type="text"
                    list={`${col}-list`}
                    name={col}
                    value={filters[col]}
                    onChange={handleFilterChange}
                    placeholder="Type to search..."
                  />
                  <datalist id={`${col}-list`}>
                    {getUniqueValues(col).map((val) => (
                      <option key={val} value={val} />
                    ))}
                  </datalist>
                </>
              )}
            </div>
          ))}

          <button
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "200",
            }}
            onClick={() =>
              setFilters({
                employeeId: "",
                employeeName: "",
                role: "",
                department: "",
                project: "",
                date: "",
                status: "",
                workHours: "",
              })
            }
          >
            Reset
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>
                <select name="role" value={filters.role} onChange={handleFilterChange}>
                  <option value="">Role</option>
                  {getUniqueValues("role").map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                <select name="department" value={filters.department} onChange={handleFilterChange}>
                  <option value="">Department</option>
                  {getUniqueValues("department").map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                <select name="project" value={filters.project} onChange={handleFilterChange}>
                  <option value="">Project</option>
                  {getUniqueValues("project").map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  Date
                </div>
                {showDatePicker && (
                  <input
                    type="date"
                    value={filters.date}
                    name="date"
                    style={{ marginTop: "5px" }}
                    onChange={(e) => {
                      handleFilterChange(e);
                      setShowDatePicker(false);
                    }}
                  />
                )}
              </th>
              <th>
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">Status</option>
                  {getUniqueValues("status").map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </th>
              <th>Work Hours</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, i) => (
                <tr key={`${row.employeeId}-${row.date}-${i}`}>
                  <td>{row.employeeId}</td>
                  <td>{row.employeeName}</td>
                  <td>{row.role}</td>
                  <td>{row.department}</td>
                  <td>{row.project}</td>
                  <td>{row.date}</td>
                  <td>{row.status}</td>
                  <td>{row.workHours}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
