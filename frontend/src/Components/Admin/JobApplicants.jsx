import React, { useState, useMemo } from "react";
import { FiSettings, FiSearch, FiArrowUp, FiArrowDown, FiArrowLeft } from "react-icons/fi";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./JobApplicants.css";

const JobApplicants = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const applicants = [
    { id: "001", name: "N.Gangadhar", contact: "9876543210", skills: "HTML, React JS, Java", experience: "0yrs", salary: 20000, location: "Hyderabad" },
    { id: "002", name: "C.Vignesh", contact: "9123456780", skills: "Python, React JS, Java", experience: "2yrs", salary: 35000, location: "Hyderabad" },
    { id: "003", name: "R.Jagadeesh", contact: "9988776655", skills: "Python, React JS, SQL", experience: "1yr", salary: 25000, location: "Chennai" },
    { id: "004", name: "N.Tataji", contact: "9876512340", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: 30000, location: "Bangalore" },
    { id: "005", name: "A.Likhith", contact: "9876541230", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: 15000, location: "Hyderabad" },
    { id: "006", name: "Akshay", contact: "9123467890", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: 40000, location: "Mumbai" },
    { id: "007", name: "Rohith", contact: "9876547890", skills: "HTML, CSS, JavaScript", experience: "2.5yrs", salary: 30000, location: "Bangalore" },
  ];

  const filteredApplicants = useMemo(() => {
    return applicants.filter(
      (app) =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contact.includes(searchTerm)
    );
  }, [searchTerm]);

  const sortedApplicants = useMemo(() => {
    if (!sortConfig.key) return filteredApplicants;
    const sorted = [...filteredApplicants].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredApplicants, sortConfig]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelected(sortedApplicants.map((app) => app.id));
    else setSelected([]);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sortedApplicants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");
    XLSX.writeFile(wb, "Filtered_Job_Applicants.xlsx");
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <motion.div className="applicant-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <button className="applicant-back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      <div className="applicant-header-section">
        <h2>Job Applicants</h2>
        <FiSettings className="settings-icon" />
      </div>

      <div className="applicant-search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, contact, skill, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="applicant-table-wrapper">
        <table className="applicant-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selected.length === sortedApplicants.length && sortedApplicants.length > 0}
                />
              </th>
              <th>S.No</th>
              <th>Applicant</th>
              <th>Contact Number</th>
              <th>Skills</th>
              <th onClick={() => handleSort("experience")} className="sortable">
                Experience {sortConfig.key === "experience" ? (sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />) : ""}
              </th>
              <th onClick={() => handleSort("salary")} className="sortable">
                Exp Salary/M {sortConfig.key === "salary" ? (sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />) : ""}
              </th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {sortedApplicants.map((app) => (
              <motion.tr
                key={app.id}
                whileHover={{ backgroundColor: "#f1f5ff" }}
                className={selected.includes(app.id) ? "selected-row" : ""}
              >
                <td>
                  <input type="checkbox" checked={selected.includes(app.id)} onChange={() => toggleSelect(app.id)} />
                </td>
                <td>{app.id}</td>
                <td>{app.name}</td>
                <td>{app.contact}</td>
                <td>{app.skills}</td>
                <td>{app.experience}</td>
                <td>{app.salary.toLocaleString()}</td>
                <td>{app.location}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="applicant-export-btn-container">
        <button className="export-btn" onClick={exportToExcel}>Export to Excel</button>
      </div>
    </motion.div>
  );
};

export default JobApplicants;
