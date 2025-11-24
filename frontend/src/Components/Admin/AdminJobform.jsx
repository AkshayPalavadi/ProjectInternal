import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./AdminJobform.css";

const AdminJobform = ({ onSubmitJob }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    JobType: "",
    jobCategory: "",
    location: [],
    roleOverview: "",
    responsibilities: [],
    preferredSkills: "",
    experience: "",
    qualification: "",
    salary: "",
    Contact: "",
    deadline: ""   // 👉 ADDED DEADLINE FIELD
  });

  const [locationInput, setLocationInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "jobTitle") {
      const lettersOnly = value.replace(/[^a-zA-Z ]/g, "");
      setFormData({ ...formData, [name]: lettersOnly });
      return;
    }

    if (name === "salary") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numbersOnly });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddLocation = () => {
    if (locationInput.trim() !== "") {
      setFormData({
        ...formData,
        location: [...formData.location, locationInput.trim()],
      });
      setLocationInput("");
    }
  };

  const removeLocation = (index) => {
    const updated = [...formData.location];
    updated.splice(index, 1);
    setFormData({ ...formData, location: updated });
  };

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim() !== "") {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, responsibilityInput.trim()],
      });
      setResponsibilityInput("");
    }
  };

  const removeResponsibility = (index) => {
    const updated = [...formData.responsibilities];
    updated.splice(index, 1);
    setFormData({ ...formData, responsibilities: updated });
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        if (formData[key].length === 0) {
          newErrors[key] = "This field is required";
        }
      } else {
        if (!formData[key].trim()) {
          newErrors[key] = "This field is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (onSubmitJob) onSubmitJob(formData);

      setStatus("success");
      setTimeout(() => setStatus(null), 2000);

      setFormData({
        jobTitle: "",
        department: "",
        JobType: "",
        jobCategory: "",
        location: [],
        roleOverview: "",
        responsibilities: [],
        preferredSkills: "",
        experience: "",
        qualification: "",
        salary: "",
        Contact: "",
        deadline: ""  // RESET DEADLINE
      });
    } else {
      setStatus("error");
      setTimeout(() => setStatus(null), 2000);
    }
  };

  return (
    <div className="adminjobform-job-form-container">
      <h2 className="adminjobform-form-title">Hiring Form</h2>

      <form className="adminjobform-job-form" onSubmit={handleSubmit}>
        <div className="adminjobform-form-grid">
          {[
            { label: "Job Title", name: "jobTitle", type: "text" },
            {
              label: "Department",
              name: "department",
              type: "select",
              options: ["Development", "Finance", "Support", "Marketing", "HR", "Sales"],
            },
            {
              label: "Job Type",
              name: "Job Type",
              type: "select",
              options: ["Full-time", "Part-time", "Internship", "Contract"],
            },
            { label: "Salary Range", name: "salary", type: "number" },
            {
              label: "Experience",
              name: "experience",
              type: "select",
              options: ["Fresher", "1-2 yrs", "2-4 yrs", "4-6 yrs", "6+ yrs"],
            },
            { label: "Qualification", name: "qualification", type: "text" },
            { label: "Contact / Email", name: "Contact", type: "email" },

            // 👉 ADDED DEADLINE FIELD (CALENDAR POPUP)
            { label: "Deadline", name: "deadline", type: "date" },

          ].map((field, i) => (
            <div key={i} className="adminjobform-form-group">
              <label>{field.label}</label>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {field.options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              )}

              {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
            </div>
          ))}

          {/* MULTIPLE LOCATIONS */}
          <div className="adminjobform-form-group full-width">
            <label>Job Location</label>

            <div className="input-add-wrapper">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z !@#$%^&*(),.\-_/]/g, "");
                  setLocationInput(value);
                }}
                placeholder="Enter location"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLocation();
                  }
                }}
              />
            </div>

            <div className="chips-container">
              {formData.location.map((loc, idx) => (
                <span key={idx} className="chip">
                  {loc}
                  <button className="remove-chip" onClick={() => removeLocation(idx)}>
                    ×
                  </button>
                </span>
              ))}
            </div>

            {errors.location && <p className="error-text">{errors.location}</p>}
          </div>

          {/* MULTIPLE RESPONSIBILITIES */}
          <div className="adminjobform-form-group full-width">
            <label>Key Responsibilities</label>

            <div className="input-add-wrapper">
              <input
                type="text"
                value={responsibilityInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z !@#$%^&*(),.\-_/]/g, "");
                  setResponsibilityInput(value);
                }}
                placeholder="Enter responsibility"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddResponsibility();
                  }
                }}
              />
            </div>

            <div className="chips-container">
              {formData.responsibilities.map((res, idx) => (
                <span key={idx} className="chip">
                  {res}
                  <button className="remove-chip" onClick={() => removeResponsibility(idx)}>
                    ×
                  </button>
                </span>
              ))}
            </div>

            {errors.responsibilities && <p className="error-text">{errors.responsibilities}</p>}
          </div>

          {/* ROLE OVERVIEW */}
          <div className="adminjobform-form-group full-width">
            <label>Job Description / Role Overview</label>
            <textarea
              rows="4"
              name="roleOverview"
              value={formData.roleOverview}
              onChange={handleChange}
              placeholder="Describe the role"
            ></textarea>
            {errors.roleOverview && <p className="error-text">{errors.roleOverview}</p>}
          </div>

          {/* PREFERRED SKILLS */}
          <div className="adminjobform-form-group full-width">
            <label>Preferred Skills</label>
            <input
              type="text"
              name="preferredSkills"
              value={formData.preferredSkills}
              onChange={handleChange}
            />
            {errors.preferredSkills && <p className="error-text">{errors.preferredSkills}</p>}
          </div>
        </div>

        <button type="submit" className="adminjobform-submit-btn">
          Post Job
        </button>
      </form>

      {status && <div className="adminjobform-overlay"></div>}

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






