import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
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

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null / "success" / "error"

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Job Title: letters only
    if (name === "jobTitle") {
      const lettersOnly = value.replace(/[^a-zA-Z ]/g, "");
      setFormData({ ...formData, [name]: lettersOnly });
      setErrors({ ...errors, [name]: "" });
      return;
    }

    // Salary: numbers only and 
    if (name === "salary") {
      const numbersOnly = value.replace(/[^0-9] - /g, "");
      setFormData({ ...formData, [name]: numbersOnly });
      setErrors({ ...errors, [name]: "" });
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      if (onSubmitJob) onSubmitJob(formData);

      setStatus("success"); // show success popup
      setTimeout(() => setStatus(null), 2000); // hide after 2s

      setFormData({
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
    } else {
      setStatus("error"); // show error popup
      setTimeout(() => setStatus(null), 2000); // hide after 2s
    }
  };

  return (
    <div className="adminjobform-job-form-container">
      <h2 className="adminjobform-form-title">Job Form</h2>

      <form className="adminjobform-job-form" onSubmit={handleSubmit}>
        <div className="adminjobform-form-grid">
          {/* Fields */}
          {[
            { label: "Job Title", name: "jobTitle", type: "text" },
            { label: "Department", name: "department", type: "select", options: ["Engineering", "Marketing", "HR", "Sales"] },
            { label: "Employment Type", name: "employmentType", type: "select", options: ["Full-time", "Part-time", "Internship", "Contract"] },
            { label: "Job Category", name: "jobCategory", type: "select", options: ["Software Development", "Design", "Management", "Operations"] },
            { label: "No. of Vacancies", name: "vacancies", type: "number" },
            { label: "Salary Range", name: "salary", type: "text", placeholder: "Enter Salary" },
            { label: "Job Location", name: "location", type: "select", options: ["Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai"] },
            { label: "Experience Required", name: "experience", type: "select", options: ["0-1 yrs", "1-3 yrs", "3-5 yrs", "5+ yrs"] },
            { label: "Educational Qualification", name: "qualification", type: "select", options: ["High School", "B.Tech", "Degree", "MSC", "BSC", "MCA", "PhD"] },
          ].map((field, idx) => (
            <div className="adminjobform-form-group" key={idx}>
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select name={field.name} value={formData[field.name]} onChange={handleChange} className={errors[field.name] ? "error" : ""}>
                  <option value="">Select</option>
                  {field.options.map((opt, i) => (<option key={i}>{opt}</option>))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  className={errors[field.name] ? "error" : ""}
                />
              )}
              {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
            </div>
          ))}

          {/* Role Overview */}
          <div className="adminjobform-form-group full-width">
            <label>Job Description / Role Overview</label>
            <textarea
              name="roleOverview"
              rows="4"
              value={formData.roleOverview}
              onChange={handleChange}
              placeholder="Describe the role"
              className={errors.roleOverview ? "error" : ""}
            ></textarea>
            {errors.roleOverview && <p className="error-text">{errors.roleOverview}</p>}
          </div>

          {/* Skills */}
          <div className="adminjobform-form-group">
            <label>Key Responsibilities</label>
            <input type="text" name="responsibilities" value={formData.responsibilities} onChange={handleChange} placeholder="List key responsibilities" className={errors.responsibilities ? "error" : ""} />
            {errors.responsibilities && <p className="error-text">{errors.responsibilities}</p>}
          </div>

          <div className="adminjobform-form-group">
            <label>Required Skills</label>
            <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} placeholder="Enter required skills" className={errors.requiredSkills ? "error" : ""} />
            {errors.requiredSkills && <p className="error-text">{errors.requiredSkills}</p>}
          </div>

          <div className="adminjobform-form-group">
            <label>Preferred Skills</label>
            <input type="text" name="preferredSkills" value={formData.preferredSkills} onChange={handleChange} placeholder="Enter preferred skills" className={errors.preferredSkills ? "error" : ""} />
            {errors.preferredSkills && <p className="error-text">{errors.preferredSkills}</p>}
          </div>
        </div>

        <button type="submit" className="adminjobform-submit-btn">Post Job</button>
      </form>

      {/* Overlay */}
      {status && <div className="adminjobform-overlay"></div>}

      {/* Popup */}
      {status === "success" && (
        <div className="adminjobform-popup success">
          <FaCheckCircle className="popup-icon" />
          <p>Job Posted Successfully!</p>
        </div>
      )}
      {status === "error" && (
        <div className="adminjobform-popup error">
          <FaExclamationCircle className="popup-icon" />
          <p>Please fill all required fields!</p>
        </div>
      )}
    </div>
  );
};

export default AdminJobform;

