import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FiFilter, FiSearch, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./OnHold.css";

const OnHold = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");

  const applicants = [
     { id: "001", name: "N.Gangadhar", contact: "9876543210", skills: "HTML, React JS, Java", experience: "0yrs", salary: 20000, location: "Hyderabad" },
    { id: "002", name: "C.Vignesh", contact: "9123456780", skills: "Python, React JS, Java", experience: "2yrs", salary: 35000, location: "Hyderabad" },
    { id: "003", name: "R.Jagadeesh", contact: "9988776655", skills: "Python, React JS, SQL", experience: "1yr", salary: 25000, location: "Chennai" },
    { id: "004", name: "N.Tataji", contact: "9876512340", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: 30000, location: "Bangalore" },
    { id: "005", name: "A.Likhith", contact: "9876541230", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: 15000, location: "Hyderabad" },
    { id: "006", name: "Akshay", contact: "9123467890", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: 40000, location: "Mumbai" },,
  ];

  const uniqueLocations = ["All", ...new Set(applicants.map((a) => a.location))];

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.status.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = filterLocation === "All" || a.location === filterLocation;
      return matchesSearch && matchesLocation;
    });
  }, [searchTerm, filterLocation, applicants]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplicants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OnHold");
    XLSX.writeFile(workbook, "OnHold_Applicants.xlsx");
  };

  return (
    <div className="onhold-container">
      {/* Header */}
      <div className="onhold-header">
        <button className="onhold-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h2>On Hold Applicants</h2>
      </div>

      {/* Controls */}
      <div className="onhold-controls">
        <div className="onhold-search">
          <FiSearch className="onhold-search-icon" />
          <input
            type="text"
            placeholder="Search applicant, skill, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="onhold-filter-right">
          <FiFilter className="onhold-filter-icon" />
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="onhold-table-wrapper">
        <table className="onhold-table">
          <thead>
            <tr>
              <th></th>
              <th>S.No</th>
              <th>Applicant</th>
              <th>Contact Number</th>
              <th>Skills</th>
              <th>Experience</th>
              <th>Exp Salary/M</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((a) => (
              <tr key={a.id}>
                <td><input type="checkbox" /></td>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.contact}</td>
                <td>{a.skills}</td>
                <td>{a.exp}</td>
                <td>{a.salary}</td>
                <td>{a.location}</td>
                <td>{a.status}</td>
              </tr>
            ))}
            {filteredApplicants.length === 0 && (
              <tr>
                <td colSpan="9" className="no-data">
                  No applicants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="onhold-footer">
        <p>Total Applicants: <strong>{filteredApplicants.length}</strong></p>
        <button onClick={exportToExcel} className="onhold-export-btn">
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default OnHold;
