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
          </tbody>
        </table>
      </div>

      <div className="export-btn-container">
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
