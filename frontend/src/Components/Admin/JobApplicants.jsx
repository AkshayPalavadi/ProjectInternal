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
import { FiFilter } from "react-icons/fi";
import "./AdminJobApplicants.css";

const JobApplicants = ({ data = [], onAdminJobApplicants }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(data.map((d) => ({ ...d })));
  }, [data]);

  const [filters, setFilters] = useState({
    applicantId: "",
    applicant: "",
    appliedPosition: "",
    email: "",
    date: "",
    skill: "",
    experience: "",
    location: "",
    reference: "",
    status: "",
    reason: "",
  });

  const [showFilterBox, setShowFilterBox] = useState(false);
  const [editingReasonId, setEditingReasonId] = useState(null);

  const allSkills = rows.flatMap((a) =>
    a.skills ? a.skills.split(",").map((s) => s.trim()) : []
  );

  const unique = {
    applicantIds: [...new Set(rows.map((a) => a.id))],
    applicants: [...new Set(rows.map((a) => a.name))],
    appliedPosition: [...new Set(rows.map((a) => a.appliedPosition))],
    email: [...new Set(rows.map((a) => a.email))],
    date: [...new Set(rows.map((a) => a.date || a.appliedDate))],
    skills: [...new Set(allSkills)],
    experience: [...new Set(rows.map((a) => a.experience))],
    location: [...new Set(rows.map((a) => a.location))],
    reference: [...new Set(rows.map((a) => a.reference))],
    status: [...new Set(rows.map((a) => a.status))],
    reason: [...new Set(rows.map((a) => a.reason))],
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      applicantId: "",
      applicant: "",
      appliedPosition: "",
      email: "",
      date: "",
      skill: "",
      experience: "",
      location: "",
      reference: "",
      status: "",
      reason: "",
    });
  };

  const updateRow = (id, updates) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...updates };
          if (onAdminJobApplicants) {
            try {
              onAdminJobApplicants(id, updates);
            } catch (e) {}
          }
          return updated;
        }
        return r;
      })
    );
  };

  const filteredApplicants = useMemo(() => {
    return rows.filter((a) => {
      const matchId =
        !filters.applicantId ||
        (a.id && a.id.toString().includes(filters.applicantId));

      const matchApplicant = a.name
        ?.toLowerCase()
        .includes(filters.applicant.toLowerCase());

      const matchAppliedPos =
        a.appliedPosition &&
        a.appliedPosition
          .toLowerCase()
          .includes(filters.appliedPosition.toLowerCase());

      const matchEmail =
        a.email && a.email.toLowerCase().includes(filters.email.toLowerCase());

      const rowDate = (a.date || a.appliedDate || "").toString();
      const matchDate =
        !filters.date || rowDate.includes(filters.date.toString());

      const matchSkill =
        a.skills && a.skills.toLowerCase().includes(filters.skill.toLowerCase());

      const matchExp =
        a.experience &&
        a.experience.toLowerCase().includes(filters.experience.toLowerCase());

      const matchLocation =
        a.location &&
        a.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchReference =
        !filters.reference ||
        (a.reference &&
          a.reference.toLowerCase().includes(filters.reference.toLowerCase()));

      const matchStatus =
        !filters.status ||
        (a.status && a.status.toLowerCase().includes(filters.status.toLowerCase()));

      const matchReason =
        !filters.reason ||
        (a.reason && a.reason.toLowerCase().includes(filters.reason.toLowerCase()));

      return (
        matchId &&
        matchApplicant &&
        matchAppliedPos &&
        matchEmail &&
        matchDate &&
        matchSkill &&
        matchExp &&
        matchLocation &&
        matchReference &&
        matchStatus &&
        matchReason
      );
    });
  }, [filters, rows]);

  const dummyResume = "/dummy-resume.pdf";

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredApplicants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "JobApplicants");
    XLSX.writeFile(wb, "JobApplicants_List.xlsx");
  };

  return (
    <div className="applicants-container">

      <div className="table-wrapper">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>S.No</th>

              {/* Applicant ID filter */}
              <th>
                <input
                  placeholder="Applicant ID"
                  value={filters.applicantId}
                  onChange={(e) => handleFilterChange("applicantId", e.target.value)}
                />
              </th>

              <th>
                <input
                  placeholder="Applicant Name"
                  value={filters.applicant}
                  onChange={(e) => handleFilterChange("applicant", e.target.value)}
                />
              </th>

              <th>
                <input
                  placeholder="Applied Position"
                  value={filters.appliedPosition}
                  onChange={(e) =>
                    handleFilterChange("appliedPosition", e.target.value)
                  }
                />
              </th>

              <th>
                <input
                  placeholder="Email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                />
              </th>

              <th>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                />
              </th>

              <th>
                <input
                  placeholder="Skills"
                  value={filters.skill}
                  onChange={(e) => handleFilterChange("skill", e.target.value)}
                />
              </th>

              <th>
                <input
                  placeholder="Experience"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.value)}
                />
              </th>

              <th>
                <input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </th>

              {/* Reference filter */}
              <th>
                <input
                  placeholder="Reference"
                  value={filters.reference}
                  onChange={(e) => handleFilterChange("reference", e.target.value)}
                />
              </th>

              {/* Resume column BEFORE Status */}
              <th>Resume</th>

              {/* Status filter */}
              <th>
                <input
                  placeholder="Status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
              </th>

              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplicants.map((a, index) => (
              <tr key={a.id ?? index}>
                <td>{index + 1}</td>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.appliedPosition}</td>
                <td>{a.email}</td>
                <td>{a.date || a.appliedDate}</td>
                <td>{a.skills}</td>
                <td>{a.experience}</td>
                <td>{a.location}</td>
                <td>{a.reference || "N/A"}</td>

                {/* Dummy resume link */}
                <td>
                  <a
                    href={dummyResume}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    Open Dummy Resume
                  </a>
                </td>

                {/* Status */}
                <td>
                  <select
                    value={a.status || ""}
                    onChange={(e) => updateRow(a.id, { status: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Shortlisted">Hold</option>
                  </select>
                </td>

                {/* Reason Editing */}
                <td
                  onClick={() =>
                    setEditingReasonId((cur) => (cur === a.id ? cur : a.id))
                  }
                  style={{ cursor: "pointer" }}
                >
                  {editingReasonId === a.id ? (
                    <input
                      type="text"
                      value={a.reason || ""}
                      onChange={(e) => updateRow(a.id, { reason: e.target.value })}
                      onBlur={() => setEditingReasonId(null)}
                      autoFocus
                    />
                  ) : (
                    a.reason || "Click to add"
                  )}
                </td>
              </tr>
            ))}

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
    </div>
>>>>>>> f4766d00b3e29c544d478223a031b506a2f4e6c4
  );
};

export default JobApplicants;
