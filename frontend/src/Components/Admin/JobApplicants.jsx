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
    </div>
  );
};

export default JobApplicants;
