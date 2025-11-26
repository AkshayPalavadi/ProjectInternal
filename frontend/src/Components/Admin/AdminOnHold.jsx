import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { FaUserCheck, FaSearch } from "react-icons/fa";
import "./AdminOnHold.css";
import { onHoldApplicants as applicantsData } from "../../data";
import { useNavigate } from "react-router-dom";


const LS_KEY = "onhold_applicants_saved"; // 🔹 LocalStorage Key

const getRandomDate = () => {
  const start = new Date(2023, 0, 1).getTime();
  const end = new Date().getTime();
  const random = new Date(start + Math.random() * (end - start));
  return random.toISOString().split("T")[0];
};

const getEmailByName = (name) => {
  const lower = name.toLowerCase();

  if (lower.includes("gangadar") || lower.includes("gangadhar"))
    return "gangadar@gmail.com";

  if (lower.includes("vignesh")) return "vignesh@gmail.com";

  if (lower.includes("jagadeesh")) return "jagadeesh@gmail.com";

  if (lower.includes("tataji")) return "tataji@gmail.com";

  if (
    lower.includes("likith") ||
    lower.includes("likhith") ||
    lower.includes("likitha") ||
    lower.includes("likhitha")
  )
    return "likith@gmail.com";

  if (lower.includes("akshay") || lower.includes("akash"))
    return "akshay@gmail.com";

  if (lower.includes("sai")) return "sai@gmail.com";

  return "";
};

const Hold = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    sno: "",
    applicantId: "",
    name: "",
    jobTitle: "",
    contact: "",
    email: "",
    date: "",
    skills: "",
    experience: "",
    location: "",
    resume: "",
    status: "",
    reason: "",
  });

  // 🔹 FIRST: Load from localStorage OR fallback to initial applicants
  const loadInitialApplicants = () => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) return JSON.parse(saved);

    return applicantsData.map((a, i) => {
      const cleanedName = a.name
        .replace(/^(mr|ms|mrs|miss|dr|prof)\.?\s+/i, "")
        .trim();

      const lname = cleanedName.toLowerCase();

      let assignedTitle = "Frontend Developer";
      if (lname.includes("jagadeesh")) assignedTitle = "Backend Developer";
      if (lname.includes("sai")) assignedTitle = "UI/UX Designer";

      return {
        ...a,
        name: cleanedName,
        applicantId: a.applicantId || `APP-${i + 1}`,
        email: getEmailByName(cleanedName),
        jobTitle: a.jobTitle || assignedTitle,
        reason: a.reason || "",
        date: a.date || getRandomDate(),
        id: a.id ?? `app-${i + 1}`,

        resume:
          a.resume ||
          (
            lname.includes("gangadhar") ? "resume_gangadhar.pdf" :
            lname.includes("vignesh") ? "resume_vignesh.pdf" :
            lname.includes("jagadeesh") ? "resume_jagadeesh.pdf" :
            lname.includes("tataji") ? "resume_tataji.pdf" :
            lname.includes("likith") ||
            lname.includes("likhith") ||
            lname.includes("likitha") ||
            lname.includes("likhitha")
              ? "resume_likith.pdf" :
            lname.includes("akshay") || lname.includes("akash")
              ? "resume_akshay.pdf" :
            lname.includes("sai") ? "resume_sai.pdf" :
            "not_uploaded.pdf"
          ),

        status: a.status || "On Hold",
      };
    });
  };

  const [applicantList, setApplicantList] = useState(loadInitialApplicants);

  // 🔹 SAVE CHANGES (STATUS + REASON) to localStorage
  const saveData = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(applicantList));
    alert("Applicant changes saved successfully!");
  };

  // 🔹 Make filtering work normally
  const filteredApplicants = useMemo(() => {
    return applicantList.filter((a, idx) => {
      return (
        (idx + 1).toString().includes(filters.sno) &&
        a.applicantId.toLowerCase().includes(filters.applicantId.toLowerCase()) &&
        a.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        a.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase()) &&
        (a.contact || "").toLowerCase().includes(filters.contact.toLowerCase()) &&
        (a.email || "").toLowerCase().includes(filters.email.toLowerCase()) &&
        a.date.includes(filters.date) &&
        a.skills.toLowerCase().includes(filters.skills.toLowerCase()) &&
        a.experience.toLowerCase().includes(filters.experience.toLowerCase()) &&
        a.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        a.resume.toLowerCase().includes(filters.resume.toLowerCase()) &&
        (filters.status ? a.status === filters.status : true) &&
        a.reason.toLowerCase().includes(filters.reason.toLowerCase())
      );
    });
  }, [filters, applicantList]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredApplicants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OnHold");
    XLSX.writeFile(wb, "OnHold_Applicants.xlsx");
  };

  const resetFilters = () => {
    setFilters({
      sno: "",
      applicantId: "",
      name: "",
      jobTitle: "",
      contact: "",
      email: "",
      date: "",
      skills: "",
      experience: "",
      location: "",
      resume: "",
      status: "",
      reason: "",
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setApplicantList((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: newStatus } : x))
    );
  };

  const handleReasonChange = (id, newReason) => {
    setApplicantList((prev) =>
      prev.map((x) => (x.id === id ? { ...x, reason: newReason } : x))
    );
  };

  return (
    <div className="onhold-container">

      <div className="onhold-header">
        <h2>Hold Applicants</h2>

        <div className="header-actions">
          <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>

      <div className="onhold-table-wrapper">
        <table className="onhold-table">
          <thead>
            <tr className="filters-row">

              {/* S.No */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="S.No"
                    value={filters.sno}
                    onChange={(e) => setFilters({ ...filters, sno: e.target.value })}
                  />
                  <FaSearch className="filter-search-icon" />
                </div>
              </th>

              {/* Applicant ID */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Applicant ID"
                    value={filters.applicantId}
                    onChange={(e) => setFilters({ ...filters, applicantId: e.target.value })}
                  />
                  <FaSearch className="filter-search-icon" />
                </div>
              </th>

              {/* Applicant Name */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Applicant"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  />
                  <FaSearch className="filter-search-icon" />
                </div>
              </th>

              {/* Job Title */}
              <th>
                <div className="filter-input-wrapper">
                  <select
                    className="job-filter-dropdown"
                    value={filters.jobTitle}
                    onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
                  >
                    <option value="">Job Title</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Software Tester">Software Tester</option>
                    <option value="HR Recruiter">HR Recruiter</option>
                  </select>
                </div>
              </th>

              {/* Contact */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Contact"
                    value={filters.contact}
                    onChange={(e) => setFilters({ ...filters, contact: e.target.value })}
                  />
                </div>
              </th>

              {/* Email */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Email"
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                  />
                </div>
              </th>

              {/* Date */}
              <th>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="date-box"
                />
              </th>

              {/* Skills */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Skills"
                    value={filters.skills}
                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  />
                  <FaSearch className="filter-search-icon" />
                </div>
              </th>

              {/* Experience */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Experience"
                    value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  />
                  <FaSearch className="filter-search-icon" />
                </div>
              </th>

              {/* Location */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                  <FaSearch className="filter-search-icon" />
                </div>
              </th>

              {/* Resume */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Resume"
                    value={filters.resume}
                    onChange={(e) => setFilters({ ...filters, resume: e.target.value })}
                  />
                </div>
              </th>

              {/* Status */}
              <th>
                <select
                  className="status-box"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="Hold">Hold</option>
                  {/* <option value="Hold">Hold</option> */}
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </th>

              {/* Reason */}
              <th>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Reason"
                    value={filters.reason}
                    onChange={(e) => setFilters({ ...filters, reason: e.target.value })}
                  />
                  <FaSearch className="filter-search-icon" />
                </div>
              </th>

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

                  {/* Resume */}
                  <td>
                      <button
                        onClick={() => navigate(`/admin/resume/${a.id}`)}
                        className="resume-icon-btn"
                      >
                        📄
                      </button>
                    </td>


                  {/* Status */}
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                    >
                      <option value="On Hold">Hold</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    {a.status === "Selected" && <FaUserCheck className="selected-icon" />}
                  </td>

                  {/* Reason */}
                  <td>
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
                <td colSpan="13" className="no-data">
                  No applicants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="onhold-footer">
        <p>Total Applicants: <strong>{filteredApplicants.length}</strong></p>

        <div className="footer-buttons">

          {/* Excel Export */}
          <button className="export-btn" onClick={exportToExcel}>
            Export to Excel
          </button>

          {/* SAVE — Saves Status + Reason */}
          <button className="save-btn" onClick={saveData}>
            Save
          </button>
        </div>
      </div>

    </div>
  );
};

export default Hold;
