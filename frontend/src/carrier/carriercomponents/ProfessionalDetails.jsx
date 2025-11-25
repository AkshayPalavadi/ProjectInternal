import React, { useState, useEffect } from 'react';

const ProfessionalDetails = ({ data, setData, setActive, errors, setErrors }) => {
  const [localData, setLocalData] = useState({
    ...data,
    jobType: data?.jobType || "",
    skillsList: data.skillsList || [],
    certificationsList: data.certificationsList || [],
    platformName: data.platformName || "",
    specifyOther: data.specifyOther || ""
  });

  const [skillInput, setSkillInput] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [certFile, setCertFile] = useState(null);

  useEffect(() => {
    if (localData.jobType === 'experience' && localData.experiences.length === 0) {
      setLocalData((prev) => ({
        ...prev,
        experiences: [
          {
            companyName: "",
            companyLocation: "",
            jobTitle: "",
            startDate: "",
            endDate: "",
            duration: "",
            roles: "",
            projects: "",
            skills: "",
            salary: "",
            resume: null,
          },
        ],
      }));
    }
  }, [localData.jobType]);

  const handleAlphabeticChange = (e) => {
    const { name, value } = e.target;
    const alphaOnly = value.replace(/[^A-Za-z\s,]/g, '');
    setLocalData((prev) => ({ ...prev, [name]: alphaOnly }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleResumeUpload = (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf'];

    if (!validTypes.includes(file.type)) {
      setResumeError('Invalid file format. Please upload PDF or DOC/DOCX.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setResumeError('File size must be less than 3MB.');
      return;
    }

    if (localData.jobType === 'experience' && index !== null) {
      const newExperiences = [...localData.experiences];
      newExperiences[index].resume = file;
      setLocalData((prev) => ({ ...prev, experiences: newExperiences }));
    } else {
      setLocalData((prev) => ({ ...prev, resume: file }));
    }

    setResumeError('');
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperiences = [...localData.experiences];

    const alphaFields = ['companyName', 'companyLocation', 'jobTitle', 'roles', 'projects', 'skills'];
    newExperiences[index][name] = alphaFields.includes(name)
      ? value.replace(/[^A-Za-z\s,]/g, '')
      : value;

    const start = new Date(newExperiences[index].startDate);
    const end = new Date(newExperiences[index].endDate);

    if (start && end && !isNaN(start) && !isNaN(end) && end > start) {
      const diffYears = end.getFullYear() - start.getFullYear();
      const diffMonths = end.getMonth() - start.getMonth();

      let years = diffYears;
      let months = diffMonths;

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      newExperiences[index].duration =
        years > 0 && months > 0
          ? `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`
          : years > 0
            ? `${years} year${years > 1 ? "s" : ""}`
            : `${months} month${months > 1 ? "s" : ""}`;
    } else {
      newExperiences[index].duration = "";
    }

    setLocalData((prev) => ({ ...prev, experiences: newExperiences }));
    setErrors((prev) => ({ ...prev, [`${name}_${index}`]: "" }));
  };

  const addExperience = () => {
    setLocalData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          companyName: "",
          companyLocation: "",
          jobTitle: "",
          startDate: "",
          endDate: "",
          duration: "",
          roles: "",
          projects: "",
          skills: "",
          salary: "",
          resume: null,
        },
      ],
    }));
  };

  const handleSalaryChange = (index, e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9,]/g, "");
    value = value.replace(/,{2,}/g, ",");
    if (value.startsWith(",")) value = value.substring(1);
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }

    const newExperiences = [...localData.experiences];
    newExperiences[index].salary = value;

    setLocalData((prev) => ({ ...prev, experiences: newExperiences }));
    setErrors((prev) => ({ ...prev, [`salary_${index}`]: "" }));
  };

  const removeExperience = (index) => {
    const updated = localData.experiences.filter((_, i) => i !== index);
    setLocalData((prev) => ({ ...prev, experiences: updated }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;

    setLocalData((prev) => ({
      ...prev,
      skillsList: [...prev.skillsList, skillInput.trim()],
    }));

    setSkillInput("");
  };

  const removeSkill = (idx) => {
    setLocalData((prev) => ({
      ...prev,
      skillsList: prev.skillsList.filter((_, i) => i !== idx),
    }));
  };

  const handleCertUpload = (e) => {
    setCertFile(e.target.files[0] || null);
  };

  const addCertification = () => {
    if (!certFile) return;

    setLocalData((prev) => ({
      ...prev,
      certificationsList: [...prev.certificationsList, certFile],
    }));

    setCertFile(null);
  };

  const removeCertification = (idx) => {
    setLocalData((prev) => ({
      ...prev,
      certificationsList: prev.certificationsList.filter((_, i) => i !== idx),
    }));
  };

  // ==============================
  // VALIDATION
  // ==============================
  const next = () => {
    const errs = {};

    if (!localData.jobType) errs.jobType = "Please select Fresher or Experience";

    if (!localData.heardFrom) {
      errs.heardFrom = "This field is required";
    }

    if (localData.heardFrom === "employee") {
      if (!localData.employeeName?.trim()) errs.employeeName = "Employee name is required";
      if (!localData.employeeEmail?.trim()) errs.employeeEmail = "Employee email is required";
    }

    if (localData.heardFrom === "socialMedia") {
      if (!localData.platformName?.trim())
        errs.platformName = "Please mention the social media platform";
    }

    if (localData.heardFrom === "other") {
      if (!localData.specifyOther?.trim())
        errs.specifyOther = "Please specify the source";
    }

    if (localData.jobType === 'fresher') {
      if (localData.skillsList.length === 0) errs.skills = 'Add at least one skill';
      if (localData.certificationsList.length === 0)
        errs.certifications = 'Add at least one certification';
      if (!localData.resume?.name) errs.resume = 'This field is required';
      if (!localData.projects?.trim()) errs.projects = 'This field is required';
    }

    if (localData.jobType === 'experience') {
      localData.experiences.forEach((exp, i) => {
        if (!exp.companyName.trim()) errs[`companyName_${i}`] = 'This field is required';
        if (!exp.companyLocation.trim()) errs[`companyLocation_${i}`] = 'This field is required';
        if (!exp.jobTitle.trim()) errs[`jobTitle_${i}`] = 'This field is required';
        if (!exp.startDate.trim()) errs[`startDate_${i}`] = 'This field is required';
        if (!exp.endDate.trim()) errs[`endDate_${i}`] = 'This field is required';
        if (!exp.roles.trim()) errs[`roles_${i}`] = 'This field is required';
        if (!exp.projects.trim()) errs[`projects_${i}`] = 'This field is required';
        if (!exp.skills.trim()) errs[`skills_${i}`] = 'This field is required';
        if (!exp.salary.trim()) errs[`salary_${i}`] = 'This field is required';
        if (!exp.resume?.name) errs[`resume_${i}`] = 'This field is required';
      });
    }

    setErrors(errs);

    if (Object.keys(errs).length === 0 && !resumeError) {
      setData(localData);
      setActive('review');
    }
  };

  return (
    <div className="form-wrap">
      <h3>Professional Details</h3>

      {/* WHERE DID YOU HEAR ABOUT US */}
      <div className="field full">
        <label>Where did you hear about the company? *</label>
        <select name="heardFrom" value={localData.heardFrom} onChange={handleChange}>
          <option value="">Select</option>
          <option value="naukri">Naukri</option>
          <option value="linkedin">LinkedIn</option>
          <option value="glassdoor">Glassdoor</option>
          <option value="friends">Friends</option>
          <option value="employee">Employee</option>
          <option value="socialMedia">Social Media</option>
          <option value="other">Other</option>
        </select>
        {errors.heardFrom && <small className="err">{errors.heardFrom}</small>}
      </div>

      {/* EMPLOYEE FIELDS */}
      {localData.heardFrom === "employee" && (
        <div className="form-grid">
          <div className="field">
            <label>Employee Name *</label>
            <input
              name="employeeName"
              value={localData.employeeName}
              onChange={handleAlphabeticChange}
            />
            {errors.employeeName && <small className="err">{errors.employeeName}</small>}
          </div>

          <div className="field">
            <label>Employee Email *</label>
            <input
              name="employeeEmail"
              type="email"
              value={localData.employeeEmail}
              onChange={handleChange}
            />
            {errors.employeeEmail && <small className="err">{errors.employeeEmail}</small>}
          </div>
        </div>
      )}

      {/* SOCIAL MEDIA FIELD */}
      {localData.heardFrom === "socialMedia" && (
        <div className="field full">
          <label>Mention Social Media Platform *</label>
          <input
            name="platformName"
            value={localData.platformName}
            onChange={handleAlphabeticChange}
            placeholder="Instagram, Facebook, YouTube, etc."
          />
          {errors.platformName && <small className="err">{errors.platformName}</small>}
        </div>
      )}

      {/* OTHER FIELD */}
      {localData.heardFrom === "other" && (
        <div className="field full">
          <label>Specify *</label>
          <input
            name="specifyOther"
            value={localData.specifyOther}
            onChange={handleAlphabeticChange}
            placeholder="Enter details"
          />
          {errors.specifyOther && <small className="err">{errors.specifyOther}</small>}
        </div>
      )}

      {/* JOB TYPE RADIO */}
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="jobType"
            value="fresher"
            checked={localData.jobType === "fresher"}
            onChange={handleChange}
          />
          Fresher
        </label>
        <label>
          <input
            type="radio"
            name="jobType"
            value="experience"
            checked={localData.jobType === "experience"}
            onChange={handleChange}
          />
          Experience
        </label>
        {errors.jobType && <small className="err">{errors.jobType}</small>}
      </div>

      {/* FRESHER SECTION */}
      {localData.jobType === "fresher" && (
        <div className="form-grid">
          <div className="field full">
            <label>Upload Resume *</label>
            <input type="file" accept=".pdf" onChange={handleResumeUpload} />
            {(errors.resume || resumeError) && (
              <small className="err">{errors.resume || resumeError}</small>
            )}
          </div>

          <div className="field full">
            <label>Skills *</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={skillInput}
                placeholder="Enter a skill"
                onChange={(e) => setSkillInput(e.target.value)}
              />
              <button type="button" className="btn primary_app" onClick={addSkill}>
                + Add Skill
              </button>
            </div>

            {errors.skills && <small className="err">{errors.skills}</small>}
            <div className="skill-tags">
              {localData.skillsList.map((skill, idx) => (
                <div key={idx} className="skill-tag">
                  {skill}
                  <span onClick={() => removeSkill(idx)}>&times;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="field full">
            <label>Certifications *</label>

            <div style={{ display: "flex", gap: "10px" }}>
              <input type="file" onChange={handleCertUpload} />
              <button type="button" className="btn primary_app" onClick={addCertification}>
                + Add Certification
              </button>
            </div>

            {errors.certifications && (
              <small className="err">{errors.certifications}</small>
            )}

            <ul className="cert-list">
              {localData.certificationsList.map((file, idx) => (
                <li key={idx}>
                  {file.name}
                  <span
                    onClick={() => removeCertification(idx)}
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                  >
                    ❌
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="field full">
            <label>LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin"
              placeholder="https://linkedin.com/in/yourprofile"
              value={localData.linkedin || ""}
              onChange={handleChange}
            />
          </div>

          <div className="field full">
            <label>Projects *</label>
            <textarea
              name="projects"
              value={localData.projects}
              onChange={handleAlphabeticChange}
            />
            {errors.projects && <small className="err">{errors.projects}</small>}
          </div>

          <div className="field full">
            <label>Achievements </label>
            <input
              name="achievements"
              value={localData.achievements}
              onChange={handleAlphabeticChange}
            />
          </div>
        </div>
      )}

      {/* EXPERIENCE SECTION */}
      {localData.jobType === "experience" && (
        <div>
          {localData.experiences.map((exp, index) => (
            <div key={index} className="experience-block">
              <h4>Experience {index + 1}</h4>

              <div className="form-grid">
                <div className="field">
                  <label>Company Name *</label>
                  <input
                    name="companyName"
                    value={exp.companyName}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {errors[`companyName_${index}`] && (
                    <small className="err">{errors[`companyName_${index}`]}</small>
                  )}
                </div>

                <div className="field">
                  <label>Company Location *</label>
                  <input
                    name="companyLocation"
                    value={exp.companyLocation}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {errors[`companyLocation_${index}`] && (
                    <small className="err">{errors[`companyLocation_${index}`]}</small>
                  )}
                </div>

                <div className="field">
                  <label>Job Title *</label>
                  <input
                    name="jobTitle"
                    value={exp.jobTitle}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {errors[`jobTitle_${index}`] && (
                    <small className="err">{errors[`jobTitle_${index}`]}</small>
                  )}
                </div>

                <div className="field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {errors[`startDate_${index}`] && (
                    <small className="err">{errors[`startDate_${index}`]}</small>
                  )}
                </div>

                <div className="field">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {errors[`endDate_${index}`] && (
                    <small className="err">{errors[`endDate_${index}`]}</small>
                  )}
                </div>

                <div className="field full">
                  <label>Roles & Responsibilities *</label>
                  <textarea
                    name="roles"
                    value={exp.roles}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {errors[`roles_${index}`] && (
                    <small className="err">{errors[`roles_${index}`]}</small>
                  )}
                </div>

                <div className="field">
                  <label>Duration *</label>
                  <input name="duration" value={exp.duration} readOnly />
                </div>

                <div className="field">
                  <label>Upload Resume *</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleResumeUpload(e, index)}
                  />
                  {(errors[`resume_${index}`] || resumeError) && (
                    <small className="err">
                      {errors[`resume_${index}`] || resumeError}
                    </small>
                  )}
                </div>

                <div className="field full">
                  <label>Projects *</label>
                  <textarea
                    name="projects"
                    value={exp.projects}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {errors[`projects_${index}`] && (
                    <small className="err">{errors[`projects_${index}`]}</small>
                  )}
                </div>

                <div className="field">
                  <label>Skills *</label>
                  <input
                    name="skills"
                    value={exp.skills}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {errors[`skills_${index}`] && (
                    <small className="err">{errors[`skills_${index}`]}</small>
                  )}
                </div>

                <div className="field">
                  <label>Salary *</label>
                  <input
                    name="salary"
                    value={exp.salary}
                    onChange={(e) => handleSalaryChange(index, e)}
                    placeholder="Enter salary (digits & commas only)"
                  />
                  {errors[`salary_${index}`] && (
                    <small className="err">{errors[`salary_${index}`]}</small>
                  )}
                </div>
              </div>

              {localData.experiences.length > 1 && (
                <button
                  type="button"
                  className="btn remove"
                  onClick={() => removeExperience(index)}
                >
                  Remove Experience
                </button>
              )}
            </div>
          ))}

          <div className="add-exp-btn-wrap">
            <button type="button" className="btn add" onClick={addExperience}>
              Add More Experience
            </button>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn secondary" onClick={() => setActive('education')}>
          Back
        </button>
        <button className="btn primary_app" onClick={next}>
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
};

export default ProfessionalDetails;
