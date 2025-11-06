import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FiDownload, FiFilter } from "react-icons/fi";
import "./AdminHiredApplicants.css";

const Hired = () => {
  const [filters, setFilters] = useState({
    name: "",
    skills: "",
    experience: "",
    salary: "",
    location: "",
    doj: "",
  });

  const [showFilterBox, setShowFilterBox] = useState(false);

  const applicants = useMemo(
    () => [
      { id: "001", name: "Deepika", skills: "HTML, React JS, Java", experience: "0yrs", salary: "20000", location: "Hyderabad", doj: "2025-12-22" },
      { id: "002", name: "Divya Sree", skills: "Python, React JS, Java", experience: "2yrs", salary: "35000", location: "Hyderabad", doj: "2025-11-15" },
      { id: "003", name: "Sravya", skills: "Python, React JS, Java, SQL", experience: "1yr", salary: "25000", location: "Chennai", doj: "2025-12-05" },
      { id: "004", name: "Kumar", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30000", location: "Bangalore", doj: "2025-12-22" },
      { id: "005", name: "Phani", skills: "MongoDB, Node JS, React", experience: "0yrs", salary: "15000", location: "Hyderabad", doj: "2025-12-10" },
      { id: "006", name: "Naveen", skills: "HTML, CSS, Javascript", experience: "2yrs", salary: "40000", location: "Mumbai", doj: "2025-05-30" },
    ],
    []
  );

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      return (
        a.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        a.skills.toLowerCase().includes(filters.skills.toLowerCase()) &&
        a.experience.toLowerCase().includes(filters.experience.toLowerCase()) &&
        a.salary.toString().includes(filters.salary) &&
        a.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        (filters.doj === "" || a.doj === filters.doj)
      );
    });
  }, [applicants, filters]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplicants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hired");
    XLSX.writeFile(workbook, "Hired_List.xlsx");
  };

  return (
    <div className="adminhiredapplicants-onhold-container">
      {/* Header */}
      <div className="adminhiredapplicants-onhold-header">
        <h2>Hired Applicants</h2>
        <div className="adminhiredapplicants-onhold-header-actions">
          <div className="adminhiredapplicants-filter-dropdown-wrapper">
            <FiFilter
              className={`filter-icon ${showFilterBox ? "active" : ""}`}
              title="Filter"
              onClick={() => setShowFilterBox(!showFilterBox)}
            />
            {showFilterBox && (
              <div className="adminhiredapplicants-filter-box">
                <h4>Advanced Filters</h4>
                {["name","skills","experience","salary","location"].map((key) => (
                  <div className="adminhiredapplicants-filter-field" key={key}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      type="text"
                      placeholder={`Search ${key}`}
                      value={filters[key]}
                      onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="adminhiredapplicants-filter-field">
                  <label>Date of Joining</label>
                  <input
                    type="date"
                    value={filters.doj}
                    onChange={(e) => setFilters({ ...filters, doj: e.target.value })}
                  />
                </div>

                <div className="adminhiredapplicants-filter-actions">
                  <button
                    onClick={() =>
                      setFilters({ name: "", skills: "", experience: "", salary: "", location: "", doj: "" })
                    }
                  >
                    Clear
                  </button>
                  <button onClick={() => setShowFilterBox(false)}>Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="adminhiredapplicants-onhold-table-wrapper">
        <table className="adminhiredapplicants-onhold-table">
          <thead>
            <tr className="adminhiredapplicants-filter-row">
              <th>S.No</th>
              <th>
                <input type="text" placeholder="Search Applicant" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
              </th>
              <th>
                <input type="text" placeholder="Search Skills" value={filters.skills} onChange={(e) => setFilters({ ...filters, skills: e.target.value })} />
              </th>
              <th>
                <input type="text" placeholder="Search Exp" value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })} />
              </th>
              <th>
                <input type="text" placeholder="Search Salary" value={filters.salary} onChange={(e) => setFilters({ ...filters, salary: e.target.value })} />
              </th>
              <th>
                <input type="text" placeholder="Search Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
              </th>
              <th>
                <input type="date" value={filters.doj} onChange={(e) => setFilters({ ...filters, doj: e.target.value })} />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((a, index) => (
                <tr key={a.id}>
                  <td>{index + 1}</td>
                  <td>{a.name}</td>
                  <td>{a.skills}</td>
                  <td>{a.experience}</td>
                  <td>₹{Number(a.salary).toLocaleString("en-IN")}</td>
                  <td>{a.location}</td>
                  <td>{a.doj}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="adminhiredapplicants-no-data">
                  No hired applicants match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with total and export */}
      <div className="adminhiredapplicants-onhold-footer">
        <p>Total Applicants: {filteredApplicants.length}</p>
        <button className="adminhiredapplicants-onhold-export-btn" onClick={exportToExcel}>
          <FiDownload /> Export
        </button>
      </div>
    </div>
  );
};

export default Hired;
