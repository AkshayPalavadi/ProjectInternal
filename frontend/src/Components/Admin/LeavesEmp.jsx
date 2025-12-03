// src/pages/LeavesEmp.jsx
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

export default function LeavesEmp() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterRef = useRef(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

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
  const fetchLeaves = async () => {
    try {
      const res = await fetch("https://internal-website-rho.vercel.app/api/hrleaves/hr");
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected HR data:", data);
        return;
      }

      const sortedRequests = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setLeaveRequests(sortedRequests);
      setFilteredData(sortedRequests);
    } catch (err) {
      console.error("Error fetching HR leaves:", err);
    }
  };

  fetchLeaves();
}, []);


  // Filter table data only
  const handleFilterChange = (e) => {
  const { name, value } = e.target;

  // IMPORTANT FIX: Reset filteredData first before applying new filter
  let updatedFilters;

  if (name === "fromDate" || name === "toDate") {
    updatedFilters = {
      ...filters,
      [name]: value,        // update only the selected date
      // remove the previous date filters to prevent mixed results
      ...(name === "fromDate" && { toDate: "" }),
      ...(name === "toDate" && { fromDate: "" }),
    };
  } else {
    updatedFilters = { ...filters, [name]: value };
  }

  setFilters(updatedFilters);

  // Apply filters
  const filtered = leaveRequests.filter((row) => {
    const matchesTextFilters = Object.keys(updatedFilters).every((key) => {
      if (key === "fromDate" || key === "toDate") return true;
      const filterVal = updatedFilters[key].toString().toLowerCase();
      const cellVal = (row[key] ?? "").toString().toLowerCase();
      return filterVal === "" || cellVal.includes(filterVal);
    });

    if (!matchesTextFilters) return false;

    const rowFrom = new Date(row.fromDate);
    const rowTo = new Date(row.toDate);
    const filterFrom = updatedFilters.fromDate ? new Date(updatedFilters.fromDate) : null;
    const filterTo = updatedFilters.toDate ? new Date(updatedFilters.toDate) : null;

   // DATE FILTERING (fixed)
// DATE FILTERING (overlap logic)
if (filterFrom && !filterTo) {
    // Only From Date selected → show leaves that cover this date
    if (!(rowFrom <= filterFrom && rowTo >= filterFrom)) return false;
}
if (!filterFrom && filterTo) {
    // Only To Date selected → show leaves that cover this date
    if (!(rowFrom <= filterTo && rowTo >= filterTo)) return false;
}
if (filterFrom && filterTo) {
    // Both From & To selected → show leaves overlapping the range
    if (!(rowFrom <= filterTo && rowTo >= filterFrom)) return false;
}

  return true;
});

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

    // Handle both file URLs and base64 data
    if (fileData.path) {
      window.open(fileData.path, "_blank");
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
const leavesCount = leaveRequests.filter((l) => {
  const from = new Date(l.fromDate).toISOString().split("T")[0];
  const to = new Date(l.toDate).toISOString().split("T")[0];
  return from <= isoDate && to >= isoDate;
}).length;
      data.push({
        date: isoDate,
        leaves: leavesCount,
        totalEmployees,
      });
    }
    return data;
  };

  const [weekData, setWeekData] = useState([]);

useEffect(() => {
  const fetchWeeklyAnalytics = async () => {
    try {
      const res = await fetch("https://internal-website-rho.vercel.app/api/hrleaves/analytics/weekly");
      const data = await res.json();

      setWeekData(data); // data = [{date:"2025-01-05", leaves:4, totalEmployees:20}, ...]
    } catch (err) {
      console.error("Error fetching weekly analytics:", err);
    }
  };

  fetchWeeklyAnalytics();
}, []);


// Verify leave - binary flag (0 = Unverified, 1 = Verified)
const verifyLeave = async (leave) => {
  try {
    const res = await fetch(
      `https://internal-website-rho.vercel.app/api/hrleaves/hr/verify/employee/${leave.employeeId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: 1 }),
      }
    );

    const updated = await res.json();

    setLeaveRequests((prev) =>
      prev.map((l) =>
        l._id === leave._id
          ? { ...l, verified: 1, status: "Approved" }
          : l
      )
    );
    setFilteredData((prev) =>
      prev.map((l) =>
        l._id === leave._id
          ? { ...l, verified: 1, status: "Approved" }
          : l
      )
    );
  } catch (err) {
    console.error("Error verifying leave:", err);
  }
};

// Submit HR Reason and store in backend
const handleHRReasonSubmit = async (leave, hrReason) => {
  if (!hrReason.trim()) {
    alert("Please enter a valid HR reason.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    console.log("token", token)

    const res = await fetch(
      `https://internal-website-rho.vercel.app/api/hrleaves/hr/reason/employee/${leave._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json",Authorization:`Bearer ${token}` },
        body: JSON.stringify({ hrReason }),
      }
    );

    const updated = await res.json();
    console.log("HR Reason API Response:", updated);
    console.log("leave data", leave)

    // Update UI
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l._id === leave._id ? { ...l, hrReason } : l
      )
    );
    setFilteredData((prev) =>
      prev.map((l) =>
        l._id === leave._id ? { ...l, hrReason } : l
      )
    );

    alert("HR reason saved!");
  } catch (err) {
    console.error("Error updating HR reason:", err);
  }
};


useEffect(() => {
  console.log("🔹 All Leave Requests:", leaveRequests);
  console.log("🔹 Filtered Data (Table Display):", filteredData);
  console.log("🔹 Pending Local Changes (Not yet sent to backend):", pendingChanges);
}, [leaveRequests, filteredData, pendingChanges]);

// STEP 5️⃣ — HR STATUS UPDATE
const updateHRStatus = async (leave, status) => {
  try {
    await fetch(
      `https://internal-website-rho.vercel.app/api/hrleaves/hr/status/employee/${leave.employeeId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    // Update UI
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l._id === leave._id ? { ...l, status } : l
      )
    );
    setFilteredData((prev) =>
      prev.map((l) =>
        l._id === leave._id ? { ...l, status } : l
      )
    );
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

// STEP 6️⃣ — REJECT LEAVE
const rejectLeave = async (leave) => {
  try {
    await fetch(
      `https://internal-website-rho.vercel.app/api/hrleaves/reject/${leave.employeeId}`,
      {
        method: "PUT",
      }
    );

    setLeaveRequests((prev) =>
      prev.map((l) =>
        l._id === leave._id
          ? { ...l, status: "Rejected" }
          : l
      )
    );
    setFilteredData((prev) =>
      prev.map((l) =>
        l._id === leave._id
          ? { ...l, status: "Rejected" }
          : l
      )
    );
  } catch (err) {
    console.error("Error rejecting leave:", err);
  }
};

console.log("weekData", weekData)

  return (
    <div className="leavesAdmin-emp">
      {/* Header */}
      <div className="table-header">
        <h3>Employee Leave Requests</h3>
        {/* <FaFilter
          className="filter-icon"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        /> */}
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
        dataKey="_id"
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
      <div className="table-header">
        <h3>Employee Leaves Table</h3>
        <FaFilter
          className="filter-icon"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        />
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
          <div className="header-inline" style={{ justifyContent: "space-between", width: "130px" }}>
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
          <div className="header-inline" style={{ justifyContent: "space-between", width: "120px" }}>
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
        <th>
          <div className="header-inline" style={{ justifyContent: "space-between", width: "100px" }}>
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
        <th><div style={{ width: "140px" }}>Comment (Manager)</div></th>

        <th><div style={{ width: "120px" }}>Comment (HR)</div></th>
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
                    <td>{new Date(leave.fromDate).toLocaleDateString("en-GB") ?? "—"}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString("en-GB") ?? "—"}</td>
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
                      {leave.status ?? "Sent"}
                    </span>
                  </td>
                  <td className="reason-box">
  {leave.managerReason ?? "—"}
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
  {leave.verified === 1 ? (
    <span className="status approved">Verified</span>
  ) : (
    <button
      className="view-file-btn"
      style={{
        background: leave.hrReason ? "#10b981" : "#9ca3af",
        cursor: leave.hrReason ? "pointer" : "not-allowed",
      }}
      onClick={() => leave.hrReason && verifyLeave(leave)}
      disabled={!leave.hrReason}
    >
      Verify
    </button>
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
