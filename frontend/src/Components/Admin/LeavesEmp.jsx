// src/pages/LeavesAdmin.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import "./LeavesEmp.css";

export default function LeavesAdmin() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterRef = useRef(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const [filters, setFilters] = useState({
    employeeId: "",
    employeeName: "",
    employeeDesignation: "",
    employeeDepartment: "",
    fromDate: "",
    toDate: "",
    leaveType: "",
    reason: "",
    status: "",
  });

  const totalEmployees = 20;

useEffect(() => {
  const storedRequests =
    JSON.parse(localStorage.getItem("leaveRequests")) || [];

  // Sort by most recent request time (latest first)
// Show latest *submitted* request first
const sortedRequests = [...storedRequests].reverse();

  setLeaveRequests(sortedRequests);
  setFilteredData(sortedRequests);
}, []);

  // Filter table data only
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    const filtered = leaveRequests.filter((row) =>
      Object.keys(updatedFilters).every((key) => {
        const filterVal = updatedFilters[key].toString().toLowerCase();
        const cellVal = (row[key] ?? "").toString().toLowerCase();
        return filterVal === "" || cellVal.includes(filterVal);
      })
    );
    setFilteredData(filtered);
  };


const handleFilterReset = () => {
  const resetFilters = {
    employeeId: "",
    employeeName: "",
    employeeDesignation: "",
    employeeDepartment: "",
    fromDate: "",
    toDate: "",
    leaveType: "",
    status: "",
    reason: "",
  };
  setFilters(resetFilters);
  setFilteredData(leaveRequests);
};

  // Close filter panel when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUniqueValues = (col) => {
    return [...new Set(leaveRequests.map((item) => item[col]))].filter(
      (v) => v && v !== "-"
    );
  };

  // File view
  const openFile = (fileData) => {
    try {
      if (!fileData) {
        alert("No file available");
        return;
      }
      if (typeof fileData === "string" && fileData.startsWith("data:application/pdf")) {
        const newTab = window.open();
        newTab.document.write(
          `<iframe src="${fileData}" width="100%" height="100%"></iframe>`
        );
        return;
      }
      alert("Unsupported file format.");
    } catch (err) {
      console.error("Error opening file:", err);
    }
  };

  // Weekly leave data
  const getWeekData = () => {
    const today = new Date();
    const day = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - day);
    let data = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      const isoDate = date.toISOString().split("T")[0];
      const leavesCount = leaveRequests.filter(
        (l) => l.fromDate <= isoDate && l.toDate >= isoDate
      ).length;
      data.push({
        date: isoDate,
        leaves: leavesCount,
        totalEmployees,
      });
    }
    return data;
  };

  const weekData = getWeekData();

  // Verify leave
  const verifyLeave = (leave) => {
    const updatedRequests = leaveRequests.map((l) =>
      l.employeeId === leave.employeeId && l.fromDate === leave.fromDate
        ? { ...l, status: "Approved" }
        : l
    );
    localStorage.setItem("leaveRequests", JSON.stringify(updatedRequests));
    setLeaveRequests(updatedRequests);
    setFilteredData(updatedRequests);
  };

  // Submit HR Reason
  const handleHRReasonSubmit = (leave, hrReason) => {
    if (!hrReason.trim()) {
      alert("Please enter a valid reason before submitting.");
      return;
    }

    const updatedRequests = leaveRequests.map((l) =>
      l.employeeId === leave.employeeId && l.fromDate === leave.fromDate
        ? { ...l, hrReason }
        : l
    );

    localStorage.setItem("leaveRequests", JSON.stringify(updatedRequests));
    setLeaveRequests(updatedRequests);
    setFilteredData(updatedRequests);
    // alert("HR Reason saved successfully!");
  };

  return (
    <div className="leavesAdmin-emp">
      {/* Header */}
      <div className="table-header">
        <h3>Employee Leave Requests</h3>
        <FaFilter
          className="filter-icon"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        />
      </div>

      {/* Weekly Graph */}
      <div className="graph-card">
  <h4 className="graph-title">Weekly Leave Overview</h4>
  <ResponsiveContainer width="100%" height={250}>
    <LineChart
      data={weekData}
      margin={{ top: 20, bottom: 20, right: 30, left: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        angle={-30}
        textAnchor="end"
        interval={0}
        height={60}
      />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="leaves"
        stroke="#2563eb"
        strokeWidth={3}
        name="Leaves Applied"
      />
    </LineChart>
  </ResponsiveContainer>
</div>


      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="filter-panel-fixed" ref={filterRef}>
          <div className="filter-item">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              placeholder="Search ID..."
            />
          </div>
          <div className="filter-item">
            <label>Employee Name</label>
            <input
              type="text"
              name="employeeName"
              value={filters.employeeName}
              onChange={handleFilterChange}
              placeholder="Search name..."
            />
          </div>
          <div className="filter-item">
            <label>Designation</label>
            <select
              name="employeeDesignation"
              value={filters.employeeDesignation}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="UIUX">UI/UX</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Department</label>
            <select
              name="employeeDepartment"
              value={filters.employeeDepartment}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Development">Development</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="filter-item">
            <label>From Date</label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <label>To Date</label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <label>Leave Type</label>
            <select
              name="leaveType"
              value={filters.leaveType}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Custom">Custom</option>
              <option value="Earned">Earned</option>
              <option value="Optional">Optional</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Sent">Sent</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="filter-buttons">
  <button onClick={handleFilterReset} className="reset-btn">Reset</button>
</div>

        </div>
      )}

      {/* Scrollable Table */}
      <div className="table-container" style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table className="leavesAdmin-table">
          <thead>
      <tr>
        <th><div style={{ width: "30px" }}>ID</div></th>
        <th><div style={{width: "80px"}}>Name</div></th>
        <th>
          <div className="header-inline" style={{ justifyContent: "space-between" }}>
            <select
              name="employeeDesignation"
              value={filters.employeeDesignation}
              onChange={handleFilterChange}
              style={{ marginLeft: "5px" }}
            >
              <option value="">Designation</option>
              {getUniqueValues("employeeDesignation").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </th>
        <th>
          <div className="header-inline" style={{ justifyContent: "space-between" }}>
            <select
              name="employeeDepartment"
              value={filters.employeeDepartment}
              onChange={handleFilterChange}
              style={{ marginLeft: "5px" }}
            >
              <option value="">Department</option>
              {getUniqueValues("employeeDepartment").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </th>
    <th style={{ width: "100px", position: "sticky" }}>
      <div
        className="header-inline"
        onClick={() => setShowFromDatePicker(!showFromDatePicker)}
        style={{ cursor: "pointer", justifyContent: "center", width: "80px" }}
      >
        From 📅
      </div>
      {showFromDatePicker && (
        <input
          type="date"
          className="header-date-picker"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
        />
      )}
    </th>

    {/* TO DATE HEADER WITH TOGGLE */}
    <th style={{ width: "100px", position: "sticky" }}>
      <div
        className="header-inline"
        onClick={() => setShowToDatePicker(!showToDatePicker)}
        style={{ cursor: "pointer", justifyContent: "center", width: "80px" }}
      >
        To 📅
      </div>
      {showToDatePicker && (
        <input
          type="date"
          className="header-date-picker"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
        />
      )}
    </th>
        <th style={{ width: "100px" }}>
          <div className="header-inline" style={{ justifyContent: "space-between" }}>
            <select
              name="leaveType"
              value={filters.leaveType}
              onChange={handleFilterChange}
              style={{ marginLeft: "5px" }}
            >
              <option value="">Type</option>
              {getUniqueValues("leaveType").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </th>
        <th><div style={{width: "100px"}}>Reason</div></th>
        <th><div style={{ width: "50px" }}>File</div></th>
                <th style={{ width: "100px" }}>
          <div className="header-inline" style={{ justifyContent: "space-between" }}>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              style={{ marginLeft: "5px" }}
            >
              <option value="">Status</option>
              {getUniqueValues("status").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </th>
        <th><div style={{ width: "120px" }}>Reason (HR)</div></th>
        <th>Verify</th>
      </tr>
    </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.employeeId ?? "—"}</td>
                  <td>{leave.employeeName ?? "—"}</td>
                  <td>{leave.employeeDesignation ?? "—"}</td>
                  <td>{leave.employeeDepartment ?? "—"}</td>
                  <td>{leave.fromDate ?? "—"}</td>
                  <td>{leave.toDate ?? "—"}</td>
                  <td>{leave.leaveType ?? "—"}</td>
                  <td className="reason-box">{leave.reason ?? "—"}</td>
                  <td>
                    {leave.file ? (
                      <button
                        onClick={() => openFile(leave.file)}
                        className="view-file-btn"
                      >
                        📄
                      </button>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`status ${leave.status?.toLowerCase() || ""}`}>
                      {leave.status ?? "Pending"}
                    </span>
                  </td>
                <td>
  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
    <textarea
      className="rejection-input"
      placeholder="Enter reason"
      defaultValue={leave.hrReason || ""}
      rows={2}
      id={`hrReason-${index}`}
      disabled={!!leave.hrReason} // Disable if already submitted
      style={{
        backgroundColor: leave.hrReason ? "#f0f0f0" : "white",
        cursor: leave.hrReason ? "not-allowed" : "text",
      }}
    ></textarea>
    <button
      className="view-file-btn"
      style={{
        background: leave.hrReason ? "#9ca3af" : "#2563eb",
        cursor: leave.hrReason ? "not-allowed" : "pointer",
      }}
      onClick={() => {
        if (leave.hrReason) return; // Prevent re-submission
        const hrReason = document.getElementById(`hrReason-${index}`).value;
        handleHRReasonSubmit(leave, hrReason);
      }}
      disabled={!!leave.hrReason} // Disable button after submission
    >
      {leave.hrReason ? "Submitted" : "Submit"}
    </button>
  </div>
</td>

                  <td>
                    {leave.status !== "Approved" ? (
                      <button
                        className="view-file-btn"
                        style={{ background: "#10b981" }}
                        onClick={() => verifyLeave(leave)}
                      >
                        Verify
                      </button>
                    ) : (
                      <span className="status approved">Verified</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
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
