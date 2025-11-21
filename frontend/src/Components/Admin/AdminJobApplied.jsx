import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FiFilter } from "react-icons/fi";
import "./AdminJobApplied.css";

const JobApplied = () => {
  const applicants = [
    { id: "001", name: "N.Gangadhar", contact: "9876543210", skills: "HTML, React JS, Java", experience: "0yrs", location: "Hyderabad", doj: "2024-10-01" },
    { id: "002", name: "C.Vignesh", contact: "9123456780", skills: "Python, React JS, Java", experience: "2yrs", location: "Hyderabad", doj: "2023-12-15" },
    { id: "003", name: "R.Jagadeesh", contact: "9988776655", skills: "Python, React JS, SQL", experience: "1yr", location: "Chennai", doj: "2024-03-20" },
    { id: "004", name: "N.Tataji", contact: "9876512340", skills: "React Native, JS, NodeJS", experience: "1.5yrs", location: "Bangalore", doj: "2024-06-05" },
  ];

  // 🟢 Unique filter values
  const allSkills = applicants.flatMap((a) => a.skills.split(",").map((s) => s.trim()));
  const unique = {
    applicants: [...new Set(applicants.map((a) => a.name))],
    skills: [...new Set(allSkills)],
    experience: [...new Set(applicants.map((a) => a.experience))],
    location: [...new Set(applicants.map((a) => a.location))],
    doj: [...new Set(applicants.map((a) => a.doj))],
  };

  // 🟢 Filters
  const [filters, setFilters] = useState({
    applicant: "",
    skill: "",
    experience: "",
    location: "",
  });
  const [filterDOJ, setFilterDOJ] = useState("");
  const [showFilterBox, setShowFilterBox] = useState(false);

  // 🟢 Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🟢 Reset all filters
  const resetFilters = () => {
    setFilters({
      applicant: "",
      skill: "",
      experience: "",
      location: "",
    });
    setFilterDOJ("");
  };

  // 🟢 Filtering logic
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const matchApplicant = a.name.toLowerCase().includes(filters.applicant.toLowerCase());
      const matchSkill = a.skills.toLowerCase().includes(filters.skill.toLowerCase());
      const matchExp = a.experience.toLowerCase().includes(filters.experience.toLowerCase());
      const matchLocation = a.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchDOJ = !filterDOJ || a.doj === filterDOJ;
      return matchApplicant && matchSkill && matchExp && matchLocation && matchDOJ;
    });
  }, [filters, filterDOJ]);

  // 🟢 Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplicants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "jobapplied");
    XLSX.writeFile(workbook, "jobapplied_Applicants.xlsx");
  };

  return (
    <div className="jobapplied-container">
      <div className="jobapplied-header">
        <h2>Job Applicants</h2>
        <div className="filter-icon-wrapper">
          <FiFilter
            className="filter-icon"
            onClick={() => setShowFilterBox((prev) => !prev)}
            title="Show Filters"
          />
          {showFilterBox && (
            <div className="filter-box">
              <h4>Filters</h4>

              {/* Applicant */}
              <div className="filter-item">
                <label>Applicant</label>
                <input
                  list="applicantList"
                  placeholder="Search..."
                  value={filters.applicant}
                  onChange={(e) => handleFilterChange("applicant", e.target.value)}
                />
                <datalist id="applicantList">
                  {unique.applicants.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>

              {/* Skills */}
              <div className="filter-item">
                <label>Skills</label>
                <input
                  list="skillsList"
                  placeholder="Search..."
                  value={filters.skill}
                  onChange={(e) => handleFilterChange("skill", e.target.value)}
                />
                <datalist id="skillsList">
                  {unique.skills.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>

              {/* Experience */}
              <div className="filter-item">
                <label>Experience</label>
                <input
                  list="expList"
                  placeholder="Search..."
                  value={filters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.value)}
                />
                <datalist id="expList">
                  {unique.experience.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>

              {/* Location */}
              <div className="filter-item">
                <label>Location</label>
                <input
                  list="locList"
                  placeholder="Search..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
                <datalist id="locList">
                  {unique.location.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>

              {/* DOJ */}
              <div className="filter-item">
                <label>DOJ</label>
                <input
                  type="date"
                  value={filterDOJ === "All" ? "" : filterDOJ}
                  onChange={(e) => setFilterDOJ(e.target.value || "All")}
                  className="doj-input"
                />
              </div>

              {/* 🟢 Reset Filters Button */}
              <div className="reset-btn-wrapper">
                <button className="reset-filters-btn" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🟢 Table */}
      <div className="jobapplied-table-wrapper">
        <table className="jobapplied-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>
                <input
                  list="applicantList"
                  placeholder="Applicant Name"
                  value={filters.applicant}
                  onChange={(e) => handleFilterChange("applicant", e.target.value)}
                />
              </th>
              <th>Contact</th>
              <th>
                <input
                  list="skillsList"
                  placeholder="Skills"
                  value={filters.skill}
                  onChange={(e) => handleFilterChange("skill", e.target.value)}
                />
              </th>
              <th>
                <input
                  list="expList"
                  placeholder="Experience"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.value)}
                />
              </th>
              <th>
                <input
                  list="locList"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </th>
              <th>
                <input
                  type="date"
                  placeholder="DOJ"
                  value={filterDOJ === "All" ? "" : filterDOJ}
                  onChange={(e) => setFilterDOJ(e.target.value || "All")}
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
                <td>{a.location}</td>
                <td>{a.doj}</td>
              </tr>
            ))}
            {filteredApplicants.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">
                  No applicants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="jobapplied-footer">
        <p>
          Total Applicants: <strong>{filteredApplicants.length}</strong>
        </p>
        <button onClick={exportToExcel} className="jobapplied-export-btn">
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default JobApplied;
