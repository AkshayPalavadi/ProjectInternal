import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminEmployee.css";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  // --- Load Static Data ---
  useEffect(() => {
    const staticData = [
      {
        id: "1",
        empId: "E001",
        personal: { firstName: "Akshay", lastName: "Patil" },
        designation: "Software Engineer",
        project: "Time Tracker",
        manager: "Riya Sharma",
      },
      {
        id: "2",
        empId: "E002",
        personal: { firstName: "Neha", lastName: "Verma" },
        designation: "UI/UX Designer",
        project: "HR Portal",
        manager: "Rajesh Kumar",
      },
      {
        id: "3",
        empId: "E003",
        personal: { firstName: "Rahul", lastName: "Mehta" },
        designation: "Frontend Developer",
        project: "Performance Dashboard",
        manager: "Riya Sharma",
      },
      {
        id: "4",
        empId: "E004",
        personal: { firstName: "Sneha", lastName: "Iyer" },
        designation: "Backend Developer",
        project: "Employee Portal",
        manager: "Karan Singh",
      },
      {
        id: "5",
        empId: "E005",
        personal: { firstName: "Vikram", lastName: "Das" },
        designation: "QA Engineer",
        project: "Timesheet Automation",
        manager: "Karan Singh",
      },
    ];
    setEmployees(staticData);
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    (emp.empId || "").toLowerCase().includes(searchId.toLowerCase())
  );

  const HandleSubmit = () => {
    navigate("/employee");
  };

  return (
    <div className="adminemployee-dashboard-layout">
      <div className="adminemployee-hr-container">
        <h2 className="adminemployee-title">Employee Management</h2>

        <div className="adminemployee-top-bar">
          <input
            type="text"
            className="adminemployee-search-box"
            placeholder="🔍 Search by ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button className="adminemployee-add-btn" onClick={HandleSubmit}>
            + Add Employee
          </button>
        </div>

        <table className="adminemployee-employee-table">
          <thead>
            <tr>
              <th>EMP-ID</th>
              <th>EMP-Name</th>
              <th>Designation</th>
              <th>Project</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <Link className="adminemployee-emp-link" to={`/admin/employees/${emp.id}`}>
  {emp.empId}
</Link>

                  </td>
                  <td>
                    {emp.personal?.firstName} {emp.personal?.lastName}
                  </td>
                  <td>{emp.designation}</td>
                  <td>{emp.project}</td>
                  <td>{emp.manager}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
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
