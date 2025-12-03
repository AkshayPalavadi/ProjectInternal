import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminEmployee.css";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");

  // Filter menu states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const [filterDept, setFilterDept] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const menuRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/register");
  };


  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://internal-website-rho.vercel.app/api/employee");

        if (!res.ok) throw new Error("Unable to fetch employees");

        const data = await res.json();
        const empList = data.data || [];

        setEmployees(Array.isArray(empList) ? empList : []);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Close filter menu when clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowFilterMenu(false);
        setShowDeptDropdown(false);
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search + filter logic
  const filteredEmployees = employees.filter((emp) => {
    const empId = emp.professional?.employeeId?.toLowerCase() || "";
    const first = emp.personal?.firstName?.toLowerCase() || "";
    const last = emp.personal?.lastName?.toLowerCase() || "";
    const fullname = `${first} ${last}`.trim();

    const search = searchId.toLowerCase();

    return (
      (empId.includes(search) ||
        first.includes(search) ||
        last.includes(search) ||
        fullname.includes(search)) &&
      (filterDept ? emp.professional?.department === filterDept : true) &&
      (filterRole ? emp.professional?.role === filterRole : true)
    );
  });

  const departments = [
    ...new Set(employees.map((e) => e.professional?.department).filter(Boolean)),
  ];
  const roles = [
    ...new Set(employees.map((e) => e.professional?.role).filter(Boolean)),
  ];

  const clearFilters = () => {
    setFilterDept("");
    setFilterRole("");
    setSearchId("");
    setShowFilterMenu(false);
  };

  if (loading) return <div>Loading employees…</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="adminemployee-dashboard-layout">
      <div className="adminemployee-hr-container">
        <h2 className="adminemployee-title">Employee Management</h2>

        <div className="adminemployee-top-bar">

          {/* Search Input */}
          <input
            type="text"
            className="adminemployee-search-box"
            placeholder="🔍 Search by Employee ID or Name..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          {/* FILTER BUTTON */}
          <div className="filter-container" ref={menuRef}>
            <button
              className="filter-icon-btn"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              ⚙️ Filters
            </button>

            {/* Dropdown menu */}
            {showFilterMenu && (
              <div className="filter-menu">

                <div className="filter-options-row">
                  {/* Department Button */}
                  <div
                    className="filter-item-employee"
                    onClick={() => {
                      setShowDeptDropdown(!showDeptDropdown);
                      setShowRoleDropdown(false);
                    }}
                  >
                    Department ▸
                  </div>

                  {/* Designation Button */}
                  <div
                    className="filter-item-employee"
                    onClick={() => {
                      setShowRoleDropdown(!showRoleDropdown);
                      setShowDeptDropdown(false);
                    }}
                  >
                    Designation ▸
                  </div>
                </div>

                {/* DROPDOWNS SIDE-BY-SIDE */}
                <div className="dropdown-row">
                  {showDeptDropdown && (
                    <select
                      className="nested-dropdown"
                      value={filterDept}
                      onChange={(e) => {
                        setFilterDept(e.target.value);
                        setShowDeptDropdown(false);
                      }}
                    >
                      <option value="">All Departments</option>
                      {departments.map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  )}

                  {showRoleDropdown && (
                    <select
                      className="nested-dropdown"
                      value={filterRole}
                      onChange={(e) => {
                        setFilterRole(e.target.value);
                        setShowRoleDropdown(false);
                      }}
                    >
                      <option value="">All Designations</option>
                      {roles.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* CLEAR FILTER BUTTON */}
                <button className="clear-filter-btn" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div> 
            )}
          </div>
          <div className="register-container">
            <button className="adminemployee-add-btn" onClick={handleSubmit}>
              + Add Employee
            </button>
          </div>
        </div>

        <table className="adminemployee-employee-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Official Email</th>
              <th>Designation</th>
              <th>Phone No</th>
              <th>Department</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>{emp.professional?.employeeId || "N/A"}</td>

                  <td>{`${emp.personal?.firstName || ""} ${
                    emp.personal?.lastName || ""
                  }`}</td>

                  <td>
                    <Link
                      className="adminemployee-emp-link"
                      to={`/admin/employees/${encodeURIComponent(
                        emp.personal?.officialEmail || ""
                      )}`}
                    >
                      {emp.personal?.officialEmail || "N/A"}
                    </Link>
                  </td>

                  <td>{emp.professional?.role || "N/A"}</td>
                  <td>{emp.personal?.phone || "N/A"}</td>
                  <td>{emp.professional?.department || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No employee data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

