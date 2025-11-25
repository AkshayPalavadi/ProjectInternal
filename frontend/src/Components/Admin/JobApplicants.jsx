<<<<<<< HEAD
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
=======
import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { FaSearch } from "react-icons/fa";
import "./JobApplicants.css";
import { useNavigate } from "react-router-dom";

const JobApplicants = ({ data = [], onAdminJobApplicants }) => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRows(data.map((d) => ({ ...d })));
  }, [data]);

  const [filters, setFilters] = useState({
    applicantId: "",
    applicant: "",
    appliedPosition: "",
    email: "",
    appliedDate: "", // ⭐ ADDED
    skill: "",
    experience: "",
    location: "",
    reference: "",
    status: "",
    reason: "",
  });

  const [editingReasonId, setEditingReasonId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const updateRow = (id, updatedFields) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updatedFields } : row))
    );

    if (onAdminJobApplicants) {
      onAdminJobApplicants({ id, ...updatedFields });
    }
  };

  // ⭐ FILTER LOGIC UPDATED (using appliedDate)
  const filteredApplicants = useMemo(() => {
    return rows.filter((a) => {
      return (
        (!filters.applicantId ||
          a.id.toString().includes(filters.applicantId)) &&
        a.name?.toLowerCase().includes(filters.applicant.toLowerCase()) &&
        a.appliedPosition
          ?.toLowerCase()
          .includes(filters.appliedPosition.toLowerCase()) &&
        a.email?.toLowerCase().includes(filters.email.toLowerCase()) &&
        a.appliedDate?.includes(filters.appliedDate) && // ⭐ Correct filter
        a.skills?.toLowerCase().includes(filters.skill.toLowerCase()) &&
        a.experience?.toLowerCase().includes(filters.experience.toLowerCase()) &&
        a.location?.toLowerCase().includes(filters.location.toLowerCase()) &&
        a.reference?.toLowerCase().includes(filters.reference.toLowerCase()) &&
        a.status?.toLowerCase().includes(filters.status.toLowerCase()) &&
        a.reason?.toLowerCase().includes(filters.reason.toLowerCase())
      );
    });
  }, [filters, rows]);

  return (
    <div className="applicants-container">
      {selectedApplicant ? (
        <div className="skill-map-full-card">
          <button className="back-btn" onClick={() => setSelectedApplicant(null)}>
            ← Back
          </button>

          <h2>Applicant Details</h2>
          <p><strong>Name:</strong> {selectedApplicant.name}</p>
          <p><strong>Email:</strong> {selectedApplicant.email}</p>
          <p><strong>Phone:</strong> {selectedApplicant.contact}</p>
          <p><strong>Skills:</strong> {selectedApplicant.skills}</p>
          <p><strong>Experience:</strong> {selectedApplicant.experience}</p>
          <p><strong>Education:</strong> {selectedApplicant.Education}</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="applicants-table">

              {/* HEADER FILTER ROW */}
              <thead>
                <tr className="filters-row">

                  {/* ID */}
                  <th>
                    <div className="filter-input-wrapper">
                      <input
                        type="text"
                        placeholder="ID"
                        value={filters.applicantId}
                        onChange={(e) =>
                          setFilters({ ...filters, applicantId: e.target.value })
                        }
                      />
                      <FaSearch className="filter-search-icon" />
                    </div>
                  </th>

                  {/* Applicant */}
                  <th>
                    <div className="filter-input-wrapper">
                      <input
                        type="text"
                        placeholder="Applicant"
                        value={filters.applicant}
                        onChange={(e) =>
                          setFilters({ ...filters, applicant: e.target.value })
                        }
                      />
                      <FaSearch className="filter-search-icon" />
                    </div>
                  </th>

                  {/* Applied Position */}
                  <th>
                    <div className="filter-input-wrapper">
                      <select
                        value={filters.appliedPosition}
                        onChange={(e) =>
                          setFilters({ ...filters, appliedPosition: e.target.value })
                        }
                      >
                        <option value="">Applied Position</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="React Native Developer">React Native Developer</option>
                      </select>
                    </div>
                  </th>

                  {/* Email */}
                  <th>
                    <div className="filter-input-wrapper">
                      <input
                        type="text"
                        placeholder="Email"
                        value={filters.email}
                        onChange={(e) =>
                          setFilters({ ...filters, email: e.target.value })
                        }
                      />
                      <FaSearch className="filter-search-icon" />
                    </div>
                  </th>

                  {/* ⭐ APPLIED DATE (with calendar icon) */}
                  <th>
                    <div className="date-wrapper">
                      <input
                        type="date"
                        className="date-input"
                        value={filters.appliedDate}
                        onChange={(e) =>
                          setFilters({ ...filters, appliedDate: e.target.value })
                        }
                      />
                      <span
                        className="calendar-icon"
                        onClick={(e) => e.target.previousSibling.showPicker()}
                      >
                      </span>
                    </div>
                  </th>

                  {/* Skills */}
                  <th>
                    <div className="filter-input-wrapper">
                      <input
                        type="text"
                        placeholder="Skills"
                        value={filters.skill}
                        onChange={(e) =>
                          setFilters({ ...filters, skill: e.target.value })
                        }
                      />
                      <FaSearch className="filter-search-icon" />
                    </div>
                  </th>

                  {/* Experience */}
                  <th>
                    <div className="filter-input-wrapper">
                      <select
                        value={filters.experience}
                        onChange={(e) =>
                          setFilters({ ...filters, experience: e.target.value })
                        }
                      >
                        <option value="">Experience</option>
                        <option value="0yrs">0 yrs</option>
                        <option value="1yr">1 yr</option>
                        <option value="1.5yrs">1.5 yrs</option>
                        <option value="2yrs">2 yrs</option>
                      </select>
                    </div>
                  </th>

                  {/* Location */}
                  <th>
                    <div className="filter-input-wrapper">
                      <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) =>
                          setFilters({ ...filters, location: e.target.value })
                        }
                      />
                      <FaSearch className="filter-search-icon" />
                    </div>
                  </th>

                  {/* Reference */}
                  <th>
                    <div className="filter-input-wrapper">
                      <select
                        value={filters.reference}
                        onChange={(e) =>
                          setFilters({ ...filters, reference: e.target.value })
                        }
                      >
                        <option value="">Reference</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Naukri">Naukri</option>
                        <option value="Employee Referral">Employee Referral</option>
                      </select>
                    </div>
                  </th>

                  <th>Resume</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {filteredApplicants.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>

                    <td
                      className="clickable-name"
                      onClick={() => setSelectedApplicant(a)}
                    >
                      {a.name}
                    </td>

                    <td>{a.appliedPosition}</td>
                    <td>{a.email}</td>

                    {/* ⭐ Applied Date shown here */}
                    <td>{a.appliedDate}</td>

                    <td>{a.skills}</td>
                    <td>{a.experience}</td>
                    <td>{a.location}</td>
                    <td>{a.reference || "N/A"}</td>

<<<<<<< HEAD
                    <td>
                      <button
                        onClick={() => navigate(`/admin/resume/${a.id}`)}
                        className="resume-icon-btn"
                      >
                        📄
                      </button>
                    </td>

                    <td>
                      <select
                        value={a.status || ""}
                        onChange={(e) =>
                          updateRow(a.id, { status: e.target.value })
                        }
                      >
                        <option value="">Select</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Shortlisted">Hold</option>
                      </select>
                    </td>

                    <td>
                      {editingReasonId === a.id ? (
                        <input
                          type="text"
                          value={a.reason || ""}
                          onChange={(e) =>
                            updateRow(a.id, { reason: e.target.value })
                          }
                          onBlur={() => setEditingReasonId(null)}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => setEditingReasonId(a.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {a.reason || "Click to add"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </>
      )}
=======
            {filteredApplicants.length === 0 && (
              <tr>
                <td colSpan="13" className="no-data">
                  No applicants found
                </td>
              </tr>
            )}
>>>>>>> f4766d00b3e29c544d478223a031b506a2f4e6c4
          </tbody>
        </table>
      </div>

<<<<<<< HEAD
      <div className="applicant-export-btn-container">
        <button className="export-btn" onClick={exportToExcel}>Export to Excel</button>
      </div>
    </motion.div>
=======
      <div className="export-btn-container">
        <p>
          Total Applicants: <strong>{filteredApplicants.length}</strong>
        </p>
        <button className="export-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>
>>>>>>> 0b40a69e161d35125ae11544ef3d22f36faae9a6
    </div>
>>>>>>> f4766d00b3e29c544d478223a031b506a2f4e6c4
  );
};

export default JobApplicants;
