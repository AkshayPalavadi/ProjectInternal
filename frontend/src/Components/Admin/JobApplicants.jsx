import React, { useState, useMemo, useEffect } from "react";

import * as XLSX from "xlsx";

import "./JobApplicants.css";

import { useNavigate } from "react-router-dom";
 
const JobApplicants = ({ onAdminJobApplicants }) => {

  const [rows, setRows] = useState([]);

  const [totalAppliedJobs, setTotalAppliedJobs] = useState(0);

  const navigate = useNavigate();
 
  // ✅ Fetch Applicants + Summary Count

  useEffect(() => {

    // ✅ HR Applicants List

    fetch("https://public-website-drab-ten.vercel.app/api/applications/hr")

      .then((res) => res.json())

      .then((data) => {

        const docs = Array.isArray(data) ? data : data.data || [];
 
        // ✅ FLATTEN BACKEND STRUCTURE FOR UI

        // const mapped = docs.map((d) => ({

        //   ...d,

        //   name: d.personal?.name || "",

        //   email: d.personal?.email || "",

        //   contact: d.personal?.contact || "",

        //   location: d.personal?.location || "",

        //   appliedPosition:

        //     d.jobTitle || d.jobEmbedded?.jobTitle || "",

        //   skills: d.professional?.skills || "",

        //   experience: d.professional?.experience || "",

        // }));

        const mapped = docs.map((d) => ({
  ...d,
 
  // ✅ CORRECT NAME (you store first + last name)
  name: `${d.personal?.firstName || ""} ${d.personal?.lastName || ""}`.trim(),
 
  // ✅ CORRECT EMAIL
  email: d.personal?.email || "",
 
  // ✅ CORRECT PHONE
  contact: d.personal?.phone || "",
 
  // ✅ CORRECT LOCATION (based on your form)
  location:
    d.personal?.state ||
    d.personal?.currentAddress ||
    d.personal?.village ||
    "",
 
  // ✅ JOB TITLE (already correct)
  appliedPosition:
    d.jobTitle || d.jobEmbedded?.jobTitle || "",
 
  // ✅ SKILLS (array → string)
  skills: Array.isArray(d.professional?.skills)
    ? d.professional.skills.join(", ")
    : d.professional?.skills || "",
 
  // ✅ EXPERIENCE (array → string)
  experience: Array.isArray(d.professional?.experiences)
    ? d.professional.experiences.join(", ")
    : d.professional?.experiences || "",
}));
 
        setRows(mapped);

      })

      .catch((err) => console.error("Error fetching applicants:", err));
 
    // ✅ Total Applied Summary

    fetch("https://public-website-drab-ten.vercel.app/api/applications/stats/summary")

      .then((res) => res.json())

      .then((data) => {

        setTotalAppliedJobs(data.totalApplied || 0);

      })

      .catch((err) => console.error("Error fetching stats:", err));

  }, []);
 
  // ✅ FILTER STATE

  const [filters, setFilters] = useState({

    applicantId: "",

    applicant: "",

    appliedPosition: "",

    email: "",

    appliedDate: "",

    skill: "",

    experience: "",

    location: "",

    reference: "",

    status: "",

    reason: "",

  });
 
  const [editingReasonId, setEditingReasonId] = useState(null);

  const [selectedApplicant, setSelectedApplicant] = useState(null);
 
  // ✅ Update row status / reason (UI ONLY)

  const updateRow = (id, updatedFields) => {

    setRows((prev) =>

      prev.map((row) => (row._id === id ? { ...row, ...updatedFields } : row))

    );
 
    if (onAdminJobApplicants) {

      onAdminJobApplicants({ id, ...updatedFields });

    }

  };
 
  // ✅ SAFE FILTER LOGIC

  const filteredApplicants = useMemo(() => {

    return rows.filter((a) => {

      const idStr = String(a._id || "");

      const nameStr = String(a.name || "").toLowerCase();

      const positionStr = String(a.appliedPosition || "").toLowerCase();

      const emailStr = String(a.email || "").toLowerCase();

      const dateStr = String(a.createdAt || "").slice(0, 10);

      const skillsStr = String(a.skills || "").toLowerCase();

      const expStr = String(a.experience || "").toLowerCase();

      const locStr = String(a.location || "").toLowerCase();

      const refStr = String(a.reference || "").toLowerCase();

      const statusStr = String(a.status || "").toLowerCase();

      const reasonStr = String(a.reason || "").toLowerCase();
 
      return (

        (!filters.applicantId || idStr.includes(filters.applicantId)) &&

        nameStr.includes(filters.applicant.toLowerCase()) &&

        positionStr.includes(filters.appliedPosition.toLowerCase()) &&

        emailStr.includes(filters.email.toLowerCase()) &&

        dateStr.includes(filters.appliedDate) &&

        skillsStr.includes(filters.skill.toLowerCase()) &&

        expStr.includes(filters.experience.toLowerCase()) &&

        locStr.includes(filters.location.toLowerCase()) &&

        refStr.includes(filters.reference.toLowerCase()) &&

        statusStr.includes(filters.status.toLowerCase()) &&

        reasonStr.includes(filters.reason.toLowerCase())

      );

    });

  }, [filters, rows]);
 
  return (
<div className="applicants-container">

      {/* ✅ FULL APPLICANT VIEW */}

      {selectedApplicant ? (
<div className="skill-map-full-card">
<button className="back-btn" onClick={() => setSelectedApplicant(null)}>
      ← Back
</button>
 
    <h2>Applicant Full Details</h2>
 
    {/* ✅ PERSONAL DETAILS */}

 
    {/* ✅ PROFESSIONAL DETAILS */}

{/* 🔹 PERSONAL DETAILS */}
<h3>Personal Details</h3>
<div className="details-grid">
  <p><strong>Name:</strong> {selectedApplicant.personal?.firstName} {selectedApplicant.personal?.lastName}</p>
  <p><strong>Email:</strong> {selectedApplicant.personal?.email}</p>
  <p><strong>Phone:</strong> {selectedApplicant.personal?.phone}</p>
  <p><strong>Alternate Phone:</strong> {selectedApplicant.personal?.alternativePhone}</p>
  <p><strong>Gender:</strong> {selectedApplicant.personal?.gender}</p>
  <p><strong>Blood Group:</strong> {selectedApplicant.personal?.bloodGroup}</p>
  <p><strong>Address:</strong> {selectedApplicant.personal?.currentAddress}</p>
  <p><strong>State:</strong> {selectedApplicant.personal?.state}</p>
  <p><strong>Pincode:</strong> {selectedApplicant.personal?.pincode}</p>
</div>

<hr />

{/* 🔹 EDUCATION DETAILS */}
<h3>Education Details</h3>
{selectedApplicant.educations?.length ? (
  selectedApplicant.educations.map((edu, index) => (
    <div key={index} className="edu-card">
      <p><strong>Level:</strong> {edu.educationLevel}</p>
      <p><strong>Type:</strong> {edu.educationType}</p>
      <p><strong>School:</strong> {edu.schoolName}</p>
      <p><strong>College:</strong> {edu.collegeName}</p>
      <p><strong>Department:</strong> {edu.department}</p>
      <p><strong>Specialization:</strong> {edu.specilization}</p>
      <p><strong>Board:</strong> {edu.board}</p>
      <p><strong>Year:</strong> {edu.yearOfPassing}</p>
      <p><strong>Percentage:</strong> {edu.percentage}</p>
    </div>
  ))
) : (
  <p>No education details</p>
)}

<hr />

{/* 🔹 PROFESSIONAL DETAILS */}
<h3>Professional Details</h3>
<div className="details-grid">
  <p><strong>Job Type:</strong> {selectedApplicant.professional?.jobType}</p>
  <p><strong>Heard From:</strong> {selectedApplicant.professional?.heardFrom}</p>
  <p><strong>Platform:</strong> {selectedApplicant.professional?.platformName}</p>
  <p><strong>Skills:</strong> {selectedApplicant.professional?.skills?.join(", ")}</p>
  <p><strong>Projects:</strong> {selectedApplicant.professional?.projects}</p>
  <p><strong>LinkedIn:</strong> {selectedApplicant.professional?.linkedin}</p>
  <p><strong>Achievements:</strong> {selectedApplicant.professional?.achievements}</p>
</div>

<h4 style={{ marginTop: "14px" }}><strong>Experience:</strong></h4>
{selectedApplicant.professional?.experiences?.length ? (
  <ul>
    {selectedApplicant.professional.experiences.map((exp, i) => (
      <li key={i}>{exp}</li>
    ))}
  </ul>
) : (
  <p>No experience data</p>
)}

    {/* ✅ RESUME DOWNLOAD */}
<p>
<strong>Resume:</strong>{" "}
      {selectedApplicant.professional?.resumeUrl ? (
<a
          href={selectedApplicant.professional.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
>
          Download Resume
</a>
      ) : (
        "No Resume"
      )}
</p>
</div>
) :  (
<>

          {/* ✅ APPLICANTS TABLE */}
<div className="table-wrapper">
<table className="applicants-table">
<thead>
<tr className="filters-row">
<th>ID</th>
<th>Applicant</th>
<th>Job Title</th>
<th>Email</th>
<th>Date</th>
<th>Skills</th>
<th>Experience</th>
<th>Location</th>
<th>Reference</th>
<th>Resume</th>
<th>Status</th>
<th>Reason</th>
</tr>
</thead>
 
              <tbody> 

                {filteredApplicants.map((a) => (
<tr key={a._id}>
<td>{a._id}</td>
 
                    <td

                      className="clickable-name"

                      onClick={() => setSelectedApplicant(a)}
>

                      {a.name}
</td>
 
                    <td>{a.appliedPosition}</td>
<td>{a.email}</td>
<td>{a.createdAt?.slice(0, 10)}</td>
<td>{a.skills}</td>
<td>{a.experience}</td>
<td>{a.location}</td>
<td>{a.reference || "N/A"}</td>
 
  <td>
  {a.professional?.resumeUrl ? (
<a
      href={a.professional.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="resume-icon-btn"
      download
>
      📄
</a>
  ) : (
<span style={{ color: "#999" }}>No Resume</span>
  )}
</td>
 
                    <td>
<select

                        value={a.status || ""}

                        onChange={(e) =>

                          updateRow(a._id, { status: e.target.value })

                        }
>
<option value="">Select</option>
<option value="Selected">Selected</option>
<option value="Rejected">Rejected</option>
<option value="Shortlisted">Hold</option>
</select>
</td>
 
                    <td>

                      {editingReasonId === a._id ? (
<input

                          type="text"

                          value={a.reason || ""}

                          onChange={(e) =>

                            updateRow(a._id, { reason: e.target.value })

                          }

                          onBlur={() => setEditingReasonId(null)}

                          autoFocus

                        />

                      ) : (
<span

                          onClick={() => setEditingReasonId(a._id)}

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
 
      {/* ✅ FOOTER + EXPORT */}
{/* 🔹 EXPORT EXCEL — show only when NOT viewing full details */}
{!selectedApplicant && (
  <div className="export-btn-container">
    <p>Total Applied Jobs: <strong>{totalAppliedJobs}</strong></p>
    {/* <p>Showing: <strong>{filteredApplicants.length}</strong> applicants</p> */}

    <button
      className="export-btn"
      onClick={() => {
        const ws = XLSX.utils.json_to_sheet(filteredApplicants);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Applicants");
        XLSX.writeFile(wb, "Applicants.xlsx");
      }}
    >
      Export to Excel
    </button>
  </div>
)}
</div>
  );
} 
 
export default JobApplicants;

 