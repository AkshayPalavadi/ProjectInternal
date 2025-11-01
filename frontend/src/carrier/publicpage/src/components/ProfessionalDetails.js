import React, { useState, useEffect } from 'react';
import { simpleValidateProfessional } from './validation';

const ProfessionalDetails = ({ data, setData, setActive, errors, setErrors }) => {
  const [localData, setLocalData] = useState(data);

  // Initialize default experience when jobType = "experience"
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
          },
        ],
      }));
    }
  }, [localData.jobType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleExperienceChange = (index, e) => {
  const { name, value } = e.target;
  const newExperiences = [...localData.experiences];
  newExperiences[index][name] = value;

  // --- Auto-calculate duration when both dates are present ---
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

    const durationStr =
      years > 0 && months > 0
        ? `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`
        : years > 0
        ? `${years} year${years > 1 ? "s" : ""}`
        : `${months} month${months > 1 ? "s" : ""}`;

    newExperiences[index].duration = durationStr;
  } else {
    newExperiences[index].duration = "";
  }

  setLocalData((prev) => ({ ...prev, experiences: newExperiences }));
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
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    const updated = localData.experiences.filter((_, i) => i !== index);
    setLocalData((prev) => ({ ...prev, experiences: updated }));
  };

  const next = () => {
    const errs = simpleValidateProfessional(localData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setData(localData);
      setActive('review');
    }
  };

  return (
    <div className="form-wrap">
      <h3>Professional Details</h3>

      {/* Radio Selection */}
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
      </div>

      {/* Fresher Form */}
      {localData.jobType === "fresher" && (
        <div className="form-grid">
          <div className="field">
            <label>Resume (PDF)*</label>
            <input
              type="file"
              accept=".pdf"
              name="resume"
              onChange={(e) => handleChange({ target: { name: 'resume', value: e.target.files[0] } })}
            />
            {errors.resume && <small className="err">{errors.resume}</small>}
          </div>

          <div className="field full">
            <label>Skills *</label>
            <input name="skills" value={localData.skills} onChange={handleChange} />
            {errors.skills && <small className="err">{errors.skills}</small>}
          </div>

          <div className="field full">
            <label>Projects *</label>
            <textarea name="projects" value={localData.projects} onChange={handleChange} />
          </div>

          <div className="field full">
            <label>LinkedIn Profile *</label>
            <input name="linkedin" value={localData.linkedin} onChange={handleChange} />
          </div>

          <div className="field full">
            <label>Certifications</label>
            <input name="certifications" value={localData.certifications} onChange={handleChange} />
          </div>

          <div className="field full">
            <label>Achievements</label>
            <input name="achievements" value={localData.achievements} onChange={handleChange} />
          </div>
        </div>
      )}

      {/* Experience Form */}
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
                </div>

                <div className="field">
                  <label>Company Location</label>
                  <input
                    name="companyLocation"
                    value={exp.companyLocation}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>

                <div className="field">
                  <label>Job Title *</label>
                  <input
                    name="jobTitle"
                    value={exp.jobTitle}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>

                <div className="field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>

                <div className="field">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>

                <div className="field">
                  <label>Duration</label>
                  <input
  name="duration"
  value={exp.duration}
  readOnly
  placeholder="Auto-calculated from dates"
/>

                </div>

                <div className="field full">
                  <label>Roles & Responsibilities</label>
                  <textarea
                    name="roles"
                    value={exp.roles}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>

                <div className="field full">
                  <label>Projects</label>
                  <textarea
                    name="projects"
                    value={exp.projects}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>

                <div className="field">
                  <label>Skills *</label>
                  <input
                    name="skills"
                    value={exp.skills}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>

                <div className="field">
                  <label>Salary</label>
                  <input
                    name="salary"
                    value={exp.salary}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>
              </div>

              {/* Remove Button */}
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

          {/* Add More Button */}
          <div className="add-exp-btn-wrap">
            <button type="button" className="btn add" onClick={addExperience}>
             Add More Experience
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="form-actions">
        <button className="btn secondary" onClick={() => setActive('education')}>Back</button>
        <button className="btn primary_app" onClick={next}>Next: Review & Submit</button>
      </div>
    </div>
  );
};

export default ProfessionalDetails;
