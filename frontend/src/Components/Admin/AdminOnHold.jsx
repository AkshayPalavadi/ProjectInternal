import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AdminOnHold.css";

const OnHold = () => {
  const navigate = useNavigate();

  const applicants = [
    { id: "001", name: "N.Gangadhar", contact: "9876543210", skills: "HTML, React JS, Java", experience: "0yrs", salary: 20000, location: "Hyderabad", status: "On Hold" },
    { id: "002", name: "C.Vignesh", contact: "9123456780", skills: "Python, React JS, Java", experience: "2yrs", salary: 35000, location: "Hyderabad", status: "On Hold" },
    { id: "003", name: "R.Jagadeesh", contact: "9988776655", skills: "Python, React JS, SQL", experience: "1yr", salary: 25000, location: "Chennai", status: "On Hold" },
    { id: "004", name: "N.Tataji", contact: "9876512340", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: 30000, location: "Bangalore", status: "On Hold" },
    { id: "005", name: "A.Likhith", contact: "9876541230", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: 15000, location: "Hyderabad", status: "On Hold" },
    { id: "006", name: "Akshay", contact: "9123467890", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: 40000, location: "Mumbai", status: "On Hold" },
  ];

  // 🔍 Filter state for each column
  const [filters, setFilters] = useState({
    name: "",
    contact: "",
    skills: "",
    experience: "",
    salary: "",
    location: "",
    status: "",
  });

  // 🧮 Filter logic
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const nameMatch = a.name.toLowerCase().includes(filters.name.toLowerCase());
      const contactMatch = a.contact.toLowerCase().includes(filters.contact.toLowerCase());
      const skillMatch = a.skills.toLowerCase().includes(filters.skills.toLowerCase());
      const expMatch = a.experience.toLowerCase().includes(filters.experience.toLowerCase());
      const salaryMatch = a.salary.toString().includes(filters.salary);
      const locationMatch = a.location.toLowerCase().includes(filters.location.toLowerCase());
      const statusMatch = a.status.toLowerCase().includes(filters.status.toLowerCase());

      return nameMatch && contactMatch && skillMatch && expMatch && salaryMatch && locationMatch && statusMatch;
    });
  }, [filters]);

  // 📂 Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplicants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OnHold");
    XLSX.writeFile(workbook, "OnHold_Applicants.xlsx");
  };

  // ♻️ Reset Filters
  const resetFilters = () => {
    setFilters({
      name: "",
      contact: "",
      skills: "",
      experience: "",
      salary: "",
      location: "",
      status: "",
    });
  };

  return (
    <div className="onhold-container">
      {/* Header */}
      <div className="onhold-header">
        {/* <button className="onhold-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button> */}
        <h2>On Hold Applicants</h2>
        <FiFilter className="filter-icon" title="Reset Filters" onClick={resetFilters} />
      </div>

      {/* Table */}
      <div className="onhold-table-wrapper">
        <table className="onhold-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>
                <input
                  type="text"
                  placeholder="Applicant"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Contact"
                  value={filters.contact}
                  onChange={(e) => setFilters({ ...filters, contact: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Skills"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Experience"
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Exp Salary"
                  value={filters.salary}
                  onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Status"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredApplicants.map((a, index) => (
              <tr key={a.id}>
                <td>{index + 1}</td>
                <td>{a.name}</td>
                <td>{a.contact}</td>
                <td>{a.skills}</td>
                <td>{a.experience}</td>
                <td>₹{a.salary}</td>
                <td>{a.location}</td>
                <td>{a.status}</td>
              </tr>
            ))}
            {filteredApplicants.length === 0 && (
              <tr>
                <td colSpan="8" className="no-data">
                  No applicants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="onhold-footer">
        <p>
          Total Applicants: <strong>{filteredApplicants.length}</strong>
        </p>
        <button onClick={exportToExcel} className="onhold-export-btn">
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default OnHold;
