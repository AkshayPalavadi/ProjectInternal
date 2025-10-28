import React, { useState, useEffect } from 'react';
import { simpleValidateProfessional } from './validation';

const ProfessionalDetails = ({ data, setData, setActive,nextStep,prevStep, errors, setErrors }) => {
  const [localData, setLocalData] = useState({
    employeeId: data.employeeId || '',
    dateOfJoining: data.dateOfJoining || '',
    role: data.role || '',
    department: data.department || '',
    salary: data.salary || '',
    hasExperience: data.hasExperience || false,
    experiences: data.experiences || [],
  });

  const departments = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Marketing',
    'Operations',
    'Sales',
    'IT Support',
    'Administration',
  ];

  useEffect(() => {
    if (localData.hasExperience && localData.experiences.length === 0) {
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
            relivingLetter: null,
            salarySlips: null,
            hrName: "",
            hrEmail: "",
            hrPhone: "",
            managerName: "",
            managerEmail: "",
            managerPhone: "",
          },
        ],
      }));
    }
  }, [localData.hasExperience]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    setLocalData((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value, type, files } = e.target;
    const val = type === 'file' ? files[0] : value;

    const newExperiences = [...localData.experiences];
    newExperiences[index][name] = val;

    // Auto-calculate duration
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
    setErrors((prev) => ({ ...prev, [name]: '' }));
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
          relievingLetter: null,
          salarySlips: null,
          hrName: "",
          hrEmail: "",
          hrPhone: "",
          managerName: "",
          managerEmail: "",
          managerPhone: "",
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
      console.log("Validation errors:", errs);

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setData(localData);
      nextStep();
    }
  };
const prev=()=>prevStep();

  return (
    <div className="form-wrap">
      <h3>Professional Details</h3>

      {/* Base Employee Info */}
      <div className="form-grid">
        <div className="field">
          <label>Employee ID <span className="required-star">*</span></label>
          <input name="employeeId" value={localData.employeeId} onChange={handleChange} />
          {errors.employeeId && <small className="err">{errors.employeeId}</small>}
        </div>

        <div className="field">
          <label>Date of Joining <span className="required-star">*</span></label>
          <input type="date" name="dateOfJoining" value={localData.dateOfJoining} onChange={handleChange} />
          {errors.dateOfJoining && <small className="err">{errors.dateOfJoining}</small>}
        </div>

        <div className="field">
          <label>Role <span className="required-star">*</span></label>
          <input name="role" value={localData.role} onChange={handleChange} />
          {errors.role && <small className="err">{errors.role}</small>}
        </div>

        <div className="field">
          <label>Department <span className="required-star">*</span></label>
          <select name="department" value={localData.department} onChange={handleChange}>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && <small className="err">{errors.department}</small>}
        </div>

        <div className="field">
          <label>Salary <span className="required-star">*</span></label>
          <input name="salary" value={localData.salary} onChange={handleChange} />
          {errors.salary && <small className="err">{errors.salary}</small>}
        </div>
      </div>

      {/* Checkbox for Experience */}
      <div className="field checkbox-field">
        <label>
          <input
            type="checkbox"
            name="hasExperience"
            checked={localData.hasExperience}
            onChange={handleChange}
          />
          &nbsp; Work Experience?
        </label>
      </div>

      {/* Experience Details Section */}
      {localData.hasExperience && (
        <div>
          {localData.experiences.map((exp, index) => (
            <div key={index} className="experience-block">
              <h4>Experience {index + 1}</h4>
              <div className="form-grid">
                <div className="field">
                  <label>Company Name *</label>
                  <input name="companyName" value={exp.companyName} onChange={(e) => handleExperienceChange(index, e)} />
  {errors[`companyName_${index}`] && <small className="err">{errors[`companyName_${index}`]}</small>}

                </div>


                <div className="field">
                  <label>Company Location *</label>
                  <input name="companyLocation" value={exp.companyLocation} onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`companyLocation_${index}`] && <small className="err">{errors[`companyLocation_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Job Title *</label>
                  <input name="jobTitle" value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`jobTitle_${index}`] && <small className="err">{errors[`jobTitle_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Start Date *</label>
                  <input type="date" name="startDate" value={exp.startDate} onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`startDate_${index}`] && <small className="err">{errors[`startDate_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>End Date *</label>
                  <input type="date" name="endDate" value={exp.endDate} onChange={(e) => handleExperienceChange(index, e)} />
      {errors[`endDate_${index}`] && <small className="err">{errors[`endDate_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Duration</label>
                  <input name="duration" value={exp.duration} readOnly placeholder="Auto-calculated" />
                </div>

                <div className="field full">
                  <label>Roles & Responsibilities *</label>
                  <textarea name="roles" value={exp.roles} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`roles_${index}`] && <small className="err">{errors[`roles_${index}`]}</small>}

                </div>

                <div className="field full">
                  <label>Projects *</label>
                  <textarea name="projects" value={exp.projects} onChange={(e) => handleExperienceChange(index, e)} />
          {errors[`projects_${index}`] && <small className="err">{errors[`projects_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Skills *</label>
                  <input name="skills" value={exp.skills} onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`skills_${index}`] && <small className="err">{errors[`skills_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Salary *</label>
                  <input name="salary" value={exp.salary} onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`salary_${index}`] && <small className="err">{errors[`salary_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Reliving Letter (PDF) *</label>
                  <input type="file" accept=".pdf" name="relivingLetter" onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`relivingLetter_${index}`] && <small className="err">{errors[`relivingLetter_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Salary Slips (PDF) *</label>
                  <input type="file" accept=".pdf" name="salarySlips" onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`salarySlips_${index}`] && <small className="err">{errors[`salarySlips_${index}`]}</small>}


                </div>

                <div className="field">
                  <label>HR Name *</label>
                  <input name="hrName" value={exp.hrName} onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`hrName_${index}`] && <small className="err">{errors[`hrName_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>HR Email *</label>
                  <input name="hrEmail" value={exp.hrEmail} onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`hrEmail_${index}`] && <small className="err">{errors[`hrEmail_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>HR Phone *</label>
                  <input name="hrPhone" value={exp.hrPhone} onChange={(e) => handleExperienceChange(index, e)} />
                    {errors[`hrPhone_${index}`] && <small className="err">{errors[`hrPhone_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Manager Name *</label>
                  <input name="managerName" value={exp.managerName} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`managerName_${index}`] && <small className="err">{errors[`managerName_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Manager Email *</label>
                  <input name="managerEmail" value={exp.managerEmail} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`managerEmail_${index}`] && <small className="err">{errors[`managerEmail_${index}`]}</small>}

                </div>

                <div className="field">
                  <label>Manager Phone *</label>
                  <input name="managerPhone" value={exp.managerPhone} onChange={(e) => handleExperienceChange(index, e)} />
                          {errors[`managerPhone_${index}`] && <small className="err">{errors[`managerPhone_${index}`]}</small>}

                </div>
              </div>

              {localData.experiences.length > 1 && (
                <button type="button" className="btn remove" onClick={() => removeExperience(index)}>
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

      {/* Navigation */}
      <div className="form-actions">
        <button className="btn secondary" onClick={prev}>Back</button>
        <button className="btn primary" onClick={next}>Next: Review & Submit</button>
      </div>
    </div>
  );
};

export default ProfessionalDetails;
