import React, { useState } from "react";
import "./AdminJobform.css";

const AdminJobform = ({ onSubmitJob }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    jobType: "",
    location: [],
    roleOverview: "",
    responsibilities: [],
    preferredSkills: "",
    experience: "",
    qualification: "",
    salary: "",
    contactOrEmail: "",
    deadline: "",
  });

  const [locationInput, setLocationInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() ? "" : "This field is required",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;
    if (name === "jobTitle") updatedValue = value.replace(/[^a-zA-Z ]/g, "");
    if (name === "salary") updatedValue = value.replace(/[^0-9]/g, "");

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    validateField(name, updatedValue);
  };

  const handleAddLocation = () => {
    if (!locationInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      location: [...prev.location, locationInput.trim()],
    }));
    setLocationInput("");
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  const removeLocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      location: prev.location.filter((_, i) => i !== index),
    }));
  };

  const handleAddResponsibility = () => {
    if (!responsibilityInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, responsibilityInput.trim()],
    }));
    setResponsibilityInput("");
    setErrors((prev) => ({ ...prev, responsibilities: "" }));
  };

  const removeResponsibility = (index) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  // const validateForm = () => {
  //   const required = [
  //     "jobTitle",
  //     "department",
  //     "jobType",
  //     "location",
  //     "roleOverview",
  //     "responsibilities",
  //     "preferredSkills",
  //     "experience",
  //     "qualification",
  //     "salary",
  //     "contactOrEmail",
  //     "deadline",
  //   ];

  //   const newErrors = {};
  //   let valid = true;

  //   required.forEach((field) => {
  //     if (!formData[field].trim()) {
  //       newErrors[field] = "This field is required";
  //       valid = false;
  //     }
  //   });

  //   if (formData.location.length === 0) {
  //     newErrors.location = "At least one location is required";
  //     valid = false;
  //   }
  //   if (formData.responsibilities.length === 0) {
  //     newErrors.responsibilities = "At least one responsibility is required";
  //     valid = false;
  //   }

  //   setErrors(newErrors);
  //   return valid;
  // };
  const validateForm = () => {
  const required = [
    "jobTitle",
    "department",
    "jobType",
    "roleOverview",
    "preferredSkills",
    "experience",
    "qualification",
    "salary",
    "contactOrEmail",
    "deadline",
  ];

  const newErrors = {};
  let valid = true;

  required.forEach((field) => {
    if (
      formData[field] === "" ||
      formData[field] === null ||
      formData[field] === undefined ||
      (Array.isArray(formData[field]) && formData[field].length === 0)
    ) {
      newErrors[field] = "This field is required";
      valid = false;
    }
  });

  if (!formData.location || formData.location.length === 0) {
    newErrors.location = "At least one location is required";
    valid = false;
  }

  if (!formData.responsibilities || formData.responsibilities.length === 0) {
    newErrors.responsibilities = "At least one responsibility is required";
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const response = await fetch(
      "https://internal-website-rho.vercel.app/api/jobs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          jobType: formData.jobType // ✅ only normalize JobType
        })
      }
    );

    if (!response.ok) {
      console.error("API ERROR:", await response.text());
      return;
    }

    const savedJob = await response.json();

    if (onSubmitJob) onSubmitJob(savedJob);

    setFormData({
      jobTitle: "",
      department: "",
      jobType: "",
      location: [],
      roleOverview: "",
      responsibilities: [],
      preferredSkills: "",
      experience: "",
      qualification: "",
      salary: "",
      contactOrEmail: "",
      deadline: ""
    });

  } catch (err) {
    console.error("JOB POST ERROR:", err);
  }
};

  return (
    <div className="adminjobform-job-form-container">
      <h2 className="adminjobform-form-title">Hiring Form</h2>

      <form onSubmit={handleSubmit} className="adminjobform-job-form">
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
              name: "jobType",
              type: "select",
              options: ["Full-time", "Part-time", "Internship", "Contract"],
            },
            { label: "Salary", name: "salary", type: "number" },
            {
              label: "Experience",
              name: "experience",
              type: "select",
              options: ["Fresher", "1-2 yrs", "2-4 yrs", "4-6 yrs", "6+ yrs"],
            },
            {
              label: "Qualification",
              name: "qualification",
              type: "select",
              options: ["Bachelors", "Masters", "PhD"],
            },
            { label: "Contact / Email", name: "contactOrEmail", type: "text" },
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

              {errors[field.name] && (
                <p className="error-text">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* LOCATION INPUT */}
          {/* <div className="adminjobform-form-group full-width">
            <label>Job Location</label>
            <div className="input-add-wrapper">
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter location"
              />
              <button type="button" className="add-btn" onClick={handleAddLocation}>
                Add
              </button>
            </div>
            {errors.location && <p className="error-text">{errors.location}</p>}
            <div className="chips-container">
              {formData.location.map((loc, i) => (
                <span key={i} className="chip">
                  {loc}
                  <button type="button" className="remove-chip" onClick={() => removeLocation(i)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div> */}

          <div className="adminjobform-form-group full-width">
  <label>Job Location</label>
  <div className="input-add-wrapper">
    <input
      value={locationInput}
      onChange={(e) => setLocationInput(e.target.value)}
      placeholder="Enter location and press Enter"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddLocation();
        }
      }}
    />
  </div>

  {errors.location && <p className="error-text">{errors.location}</p>}

  <div className="chips-container">
    {formData.location.map((loc, i) => (
      <span key={i} className="chip">
        {loc}
        <button
          type="button"
          className="remove-chip"
          onClick={() => removeLocation(i)}
        >
          ×
        </button>
      </span>
    ))}
  </div>
</div>


          {/* RESPONSIBILITIES INPUT */}

          <div className="adminjobform-form-group full-width">
  <label>Key Responsibilities</label>
  <div className="input-add-wrapper">
    <input
      value={responsibilityInput}
      onChange={(e) => setResponsibilityInput(e.target.value)}
      placeholder="Enter responsibility and press Enter"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddResponsibility();
        }
      }}
    />
  </div>

  {errors.responsibilities && (
    <p className="error-text">{errors.responsibilities}</p>
  )}

  <div className="chips-container">
    {formData.responsibilities.map((res, i) => (
      <span key={i} className="chip">
        {res}
        <button
          type="button"
          className="remove-chip"
          onClick={() => removeResponsibility(i)}
        >
          ×
        </button>
      </span>
    ))}
  </div>
</div>
          {/* SKILLS */}
          <div className="adminjobform-form-group full-width">
            <label>Preferred Skills</label>
            <input
              type="text"
              name="preferredSkills"
              value={formData.preferredSkills}
              onChange={handleChange}
            />
            {errors.preferredSkills && (
              <p className="error-text">{errors.preferredSkills}</p>
            )}
          </div>

          {/* ROLE OVERVIEW */}
          <div className="adminjobform-form-group full-width">
            <label>Job Description / Role Overview</label>
            <textarea
              name="roleOverview"
              rows="4"
              value={formData.roleOverview}
              onChange={handleChange}
              placeholder="Describe the job"
            />
            {errors.roleOverview && (
              <p className="error-text">{errors.roleOverview}</p>
            )}
          </div>

          {/* SKILLS
          <div className="adminjobform-form-group full-width">
            <label>Preferred Skills</label>
            <input
              type="text"
              name="preferredSkills"
              value={formData.preferredSkills}
              onChange={handleChange}
            />
            {errors.preferredSkills && (
              <p className="error-text">{errors.preferredSkills}</p>
            )}
          </div> */}
        </div>

        <button type="submit" className="adminjobform-submit-btn">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AdminJobform;
