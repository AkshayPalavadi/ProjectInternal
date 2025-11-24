import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FaUserCheck } from "react-icons/fa";
import "./AdminOnHold.css";
import { onHoldApplicants as applicants } from "../../data";

// Generate random date between 2023 and today
const getRandomDate = () => {
  const start = new Date(2023, 0, 1).getTime();
  const end = new Date().getTime();
  const random = new Date(start + Math.random() * (end - start));
  return random.toISOString().split("T")[0];
};

// Assign email based on name (keeps previous mapping)
const getEmailByName = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("gangadar") || lower.includes("gangadhar")) return "gangadar@gmail.com";
  if (lower.includes("vignesh")) return "vignesh@gmail.com";
  if (lower.includes("jagadeesh")) return "jagadeesh@gmail.com";
  if (lower.includes("tataji")) return "tataji@gmail.com";
  if (lower.includes("likith")) return "likith@gmail.com";
  if (lower.includes("akash") || lower.includes("akashay")) return "akashay@gmail.com";
  if (lower.includes("sai")) return "sai@gmail.com";
  return "";
};

const Hold = () => {
  // filters shown under column headers (always visible)
  const [filters, setFilters] = useState({
    applicantId: "",
    name: "",
    jobTitle: "",
    date: "",
    skills: "",
    experience: "",
    location: "",
  });

  // applicants list prepared once (you can keep this in state to mutate status/reason)
  const [applicantList, setApplicantList] = useState(
    applicants.map((a, i) => {
      const cleanedName = a.name.replace(/^(mr|ms|mrs|miss|dr|prof)\.?\s+/i, "").trim();
      let assignedTitle = "Frontend Developer";
      if (cleanedName.toLowerCase().includes("jagadeesh")) assignedTitle = "Backend Developer";
      if (cleanedName.toLowerCase().includes("sai")) assignedTitle = "UI/UX Designer";

      return {
        ...a,
        name: cleanedName,
        applicantId: a.applicantId || `APP-${i + 1001}`,
        email: getEmailByName(cleanedName),
        reason: a.reason || "",
        jobTitle: a.jobTitle || assignedTitle,
        date: a.date || getRandomDate(),
        // keep id if provided; otherwise create unique
        id: a.id ?? `app-${i + 1}`,
      };
    })
  );

  // Filtering logic (applies all filter fields)
  const filteredApplicants = useMemo(() => {
    return applicantList.filter((a) => {
      return (
        a.applicantId.toLowerCase().includes(filters.applicantId.toLowerCase()) &&
        a.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        a.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase()) &&
        // date filter - match substring (exact chosen date will match)
        a.date.includes(filters.date) &&
        a.skills.toLowerCase().includes(filters.skills.toLowerCase()) &&
        a.experience.toLowerCase().includes(filters.experience.toLowerCase()) &&
        a.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    });
  }, [filters, applicantList]);

  // Export visible rows to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplicants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OnHold");
    XLSX.writeFile(workbook, "OnHold_Applicants.xlsx");
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      applicantId: "",
      name: "",
      jobTitle: "",
      date: "",
      skills: "",
      experience: "",
      location: "",
    });
  };

  // Update status inline
  const handleStatusChange = (id, status) => {
    setApplicantList((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  // Update reason inline
  const handleReasonChange = (id, reason) => {
    setApplicantList((prev) => prev.map((x) => (x.id === id ? { ...x, reason } : x)));
  };

  return (
    <div className="onhold-container">
      {/* Header with Reset */}
      <div className="onhold-header">
        <h2>On Hold Applicants</h2>
        <div className="header-actions">
          <button className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
          <button className="export-btn" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="onhold-table-wrapper">
        <table className="onhold-table">
          <thead>
            {/* Row 1: column labels */}
            <tr>
              <th>S.No</th>
              <th>Applicant ID</th>
              <th>Applicant</th>
              <th>Job Title</th>
              <th>Contact</th>
              <th>Email</th>
              <th>DOA</th>
              <th>Skills</th>
              <th>Experience</th>
              <th>Location</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>

            {/* Row 2: search inputs directly under each corresponding column */}
            <tr className="filters-row">
              {/* S.No - no filter */}
              <th></th>

              {/* Applicant ID */}
              <th>
                <input
                  type="text"
                  className="column-filter-input-onhold"
                  placeholder="Search Applicant ID"
                  value={filters.applicantId}
                  onChange={(e) => setFilters({ ...filters, applicantId: e.target.value })}
                />
              </th>

              {/* Name */}
              <th>
                <input
                  type="text"
                  className="column-filter-input"
                  placeholder="Search Applicant"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </th>

              {/* Job Title */}
              <th>
                <input
                  type="text"
                  className="column-filter-input"
                  placeholder="Search Job Title"
                  value={filters.jobTitle}
                  onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
                />
              </th>

              {/* Contact - no filter */}
              <th></th>

              {/* Email - no filter */}
              <th></th>

              {/* DOA (date picker) */}
              <th>
                <input
                  type="date"
                  className="column-filter-input"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                />
              </th>

              {/* Skills */}
              <th>
                <input
                  type="text"
                  className="column-filter-input"
                  placeholder="Search Skills"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                />
              </th>

              {/* Experience */}
              <th>
                <input
                  type="text"
                  className="column-filter-input"
                  placeholder="Search Experience"
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                />
              </th>

              {/* Location */}
              <th>
                <input
                  type="text"
                  className="column-filter-input"
                  placeholder="Search Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </th>

              {/* Status - no filter */}
              <th></th>

              {/* Reason - no filter */}
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((a, idx) => (
                <tr key={a.id}>
                  <td>{idx + 1}</td>
                  <td>{a.applicantId}</td>
                  <td>{a.name}</td>
                  <td>{a.jobTitle}</td>
                  <td>{a.contact}</td>
                  <td>{a.email}</td>
                  <td>{a.date}</td>
                  <td>{a.skills}</td>
                  <td>{a.experience}</td>
                  <td>{a.location}</td>

                  <td>
                    <select
                      value={a.status || "On Hold"}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                    >
                      <option value="On Hold">On Hold</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    {a.status === "Selected" && <FaUserCheck className="selected-icon" />}
                  </td>

                  <td>
                    {/* Reason textarea - horizontal scroll when long */}
                    <textarea
                      className="reason-textarea"
                      value={a.reason}
                      onChange={(e) => handleReasonChange(a.id, e.target.value)}
                      disabled={a.status === "Selected"}
                      placeholder={a.status === "Selected" ? "-" : "Enter reason"}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="no-data">
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
      </div>
    </div>
  );
};

export default Hold;
