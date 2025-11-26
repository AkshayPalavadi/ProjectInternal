import React from "react";
import { useParams } from "react-router-dom";
import "./ResumeDetails.css";

const ResumeDetails = ({ applicants }) => {
  const { id } = useParams();

  const applicant = applicants.find((app) => app.id === id);

  if (!applicant) {
    return <h2>No Resume Found</h2>;
  }

  return (
    <div className="resume-container">
      <div className="resume-card">

        <h1 className="resume-name">{applicant.name}</h1>
        <p className="resume-position">
          {applicant.appliedPosition || applicant.Jobtitle}
        </p>

        <div className="resume-section">
          <h3>Personal Information</h3>
          <p><strong>Email:</strong> {applicant.email}</p>
          <p><strong>Contact:</strong> {applicant.contact}</p>
          <p><strong>Location:</strong> {applicant.location}</p>
        </div>

        <div className="resume-section">
          <h3>Skills</h3>
          <p>{applicant.skills}</p>
        </div>

        <div className="resume-section">
          <h3>Experience</h3>
          <p>{applicant.experience}</p>
        </div>

        <div className="resume-section">
          <h3>Education</h3>
          <p>{applicant.education || "Not Provided"}</p>
        </div>

        <div className="resume-section">
          <h3>Certificates</h3>
          <p>{applicant.certificates || "Not Provided"}</p>
        </div>

        <div className="resume-section">
          <h3>Projects</h3>
          <p>{applicant.projects || "Not Provided"}</p>
        </div>

        <div className="resume-section">
          <h3>Signature</h3>
          <p>{applicant.signature || "___________"}</p>
        </div>

        <button
          className="resume-btn"
          onClick={() => window.open(applicant.resume,"_blank")}
        >
        Download Resume
        </button>

      </div>
    </div>
  );
};

export default ResumeDetails;
