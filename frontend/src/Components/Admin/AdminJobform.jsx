import React, { useState } from "react";
import "./AdminJobform.css";

const AdminJobform = ({ onSubmitJob }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    employmentType: "",
    jobCategory: "",
    vacancies: "",
    location: "",
    roleOverview: "",
    responsibilities: "",
    requiredSkills: "",
    preferredSkills: "",
    experience: "",
    qualification: "",
    salary: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitJob) {
      onSubmitJob(formData); // ✅ Send data to parent
    }
    alert("Job Posted Successfully!");
  };

  return (
    <div className="adminjobform-job-form-container">
      <h2 className="adminjobform-form-title">Job Form</h2>
      <form className="adminjobform-job-form" onSubmit={handleSubmit}>
        <div className="adminjobform-form-grid">
          <div className="adminjobform-form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter job title"
            />
          </div>

          <div className="adminjobform-form-group">
            <label>Department</label>
            <select name="department" onChange={handleChange}>
              <option value="">Select</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>HR</option>
              <option>Sales</option>
            </select>
          </div>

          <div className="adminjobform-form-group">
            <label>Employment Type</label>
            <select name="employmentType" onChange={handleChange}>
              <option value="">Select</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </div>

          <div className="adminjobform-form-group">
            <label>Job Category</label>
            <select name="jobCategory" onChange={handleChange}>
              <option value="">Select</option>
              <option>Software Development</option>
              <option>Design</option>
              <option>Management</option>
              <option>Operations</option>
            </select>
          </div>

          <div className="adminjobform-form-group">
            <label>No. of Vacancies</label>
            <input
              type="number"
              name="vacancies"
              value={formData.vacancies}
              onChange={handleChange}
              placeholder="Enter vacancies"
            />
          </div>

          <div className="adminjobform-form-group">
            <label>Salary Range</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="₹4,00,000 - ₹6,00,000"
            />
          </div>

          <div className="adminjobform-form-group">
            <label>Job Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </div>

          <div className="adminjobform-form-group full-width">
            <label>Job Description / Role Overview</label>
            <textarea
              name="roleOverview"
              rows="4"
              value={formData.roleOverview}
              onChange={handleChange}
              placeholder="Describe the role"
            ></textarea>
          </div>

          <div className="adminjobform-form-group">
            <label>Key Responsibilities</label>
            <input
              type="text"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="List key responsibilities"
            />
          </div>

          <div className="adminjobform-form-group">
            <label>Required Skills</label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="Enter required skills"
            />
          </div>

          <div className="adminjobform-form-group">
            <label>Preferred Skills</label>
            <input
              type="text"
              name="preferredSkills"
              value={formData.preferredSkills}
              onChange={handleChange}
              placeholder="Enter preferred skills"
            />
          </div>

          <div className="adminjobform-form-group">
            <label>Experience Required</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 3+ years"
            />
          </div>

          <div className="adminjobform-form-group">
            <label>Educational Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Enter qualification"
            />
          </div>
        </div>

        <button type="submit" className="adminjobform-submit-btn">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AdminJobform;
