import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FiFilter } from "react-icons/fi";
import "./AdminJobApplicants.css";

const JobApplicants = ({ data = [], onAdminJobApplicants }) => {
  // 🟢 Filters
  const [filters, setFilters] = useState({
    applicant: "",
    skill: "",
    experience: "",
    salary: "",
    location: "",
  });
  const [filterDOJ, setFilterDOJ] = useState("");
  const [showFilterBox, setShowFilterBox] = useState(false);

  // 🟢 Extract unique options
  const allSkills = data.flatMap((a) =>
    a.skills ? a.skills.split(",").map((s) => s.trim()) : []
  );
  const unique = {
    applicants: [...new Set(data.map((a) => a.name))],
    skills: [...new Set(allSkills)],
    experience: [...new Set(data.map((a) => a.experience))],
    salary: [...new Set(data.map((a) => a.salary?.toString()))],
    location: [...new Set(data.map((a) => a.location))],
    doj: [...new Set(data.map((a) => a.doj))],
  };

  // 🟢 Handle change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🟢 Reset
  const resetFilters = () => {
    setFilters({
      applicant: "",
      skill: "",
      experience: "",
      salary: "",
      location: "",
    });
    setFilterDOJ("");
  };

  // 🟢 Filter logic
  const filteredApplicants = useMemo(() => {
    return data.filter((a) => {
      const matchApplicant = a.name
        .toLowerCase()
        .includes(filters.applicant.toLowerCase());
      const matchSkill = a.skills
        .toLowerCase()
        .includes(filters.skill.toLowerCase());
      const matchExp = a.experience
        .toLowerCase()
        .includes(filters.experience.toLowerCase());
      const matchSalary = a.salary.toString().includes(filters.salary);
      const matchLocation = a.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());
      const matchDOJ = !filterDOJ || a.doj === filterDOJ;
      return (
        matchApplicant &&
        matchSkill &&
        matchExp &&
        matchSalary &&
        matchLocation &&
        matchDOJ
      );
    });
  }, [filters, filterDOJ, data]);

  // 🟢 Export Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredApplicants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "JobApplicants");
    XLSX.writeFile(wb, "JobApplicants_List.xlsx");
  };

  return (
    <div className="applicants-container">
      <div className="header-section">
        <h2>Job Applicants</h2>

        <FiFilter
          className="filter-icon"
          title="Show Filters"
          onClick={() => setShowFilterBox(!showFilterBox)}
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
                onChange={(e) =>
                  handleFilterChange("applicant", e.target.value)
                }
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
                onChange={(e) =>
                  handleFilterChange("experience", e.target.value)
                }
              />
              <datalist id="expList">
                {unique.experience.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>

            {/* Salary */}
            <div className="filter-item">
              <label>Expected Salary</label>
              <input
                list="salaryList"
                placeholder="Search..."
                value={filters.salary}
                onChange={(e) => handleFilterChange("salary", e.target.value)}
              />
              <datalist id="salaryList">
                {unique.salary.map((v) => (
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

            <div className="reset-btn-wrapper">
              <button className="reset-filters-btn" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🟢 Table */}
      <div className="table-wrapper">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>
                <input
                  placeholder="Applicant"
                  value={filters.applicant}
                  onChange={(e) =>
                    handleFilterChange("applicant", e.target.value)
                  }
                />
              </th>
              <th>Contact</th>
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
                  onChange={(e) =>
                    handleFilterChange("experience", e.target.value)
                  }
                />
              </th>
              <th>
                <input
                  placeholder="Expected Salary"
                  value={filters.salary}
                  onChange={(e) => handleFilterChange("salary", e.target.value)}
                />
              </th>
              <th>
                <input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </th>
              <th>
                <input
                  type="date"
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
                <td>{a.salary}</td>
                <td>{a.location}</td>
                <td>{a.doj}</td>
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

      {/* 🟢 Footer with count */}
      <div className="export-btn-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
        <p>
          Total Applicants: <strong>{filteredApplicants.length}</strong>
        </p>
        <button className="export-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default JobApplicants;
