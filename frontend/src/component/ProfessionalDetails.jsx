import React, { useState } from "react";
import { simpleValidateProfessional } from "./validation";

const ProfessionalDetails = ({ data, setData, nextStep, prevStep }) => {
  const [localErrors, setLocalErrors] = useState({});

  const departments = [
    "Engineering",
    "Human Resources",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
    "IT Support",
    "Administration",
  ];

  // =========================
  // 🔹 Basic field change
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val =
      type === "checkbox"
        ? checked
        : type === "file"
        ? files[0]
        : value;

    let updated = { ...data, [name]: val };

    if (name === "hasExperience") {
      if (val) {
        if (updated.experiences.length === 0) {
          updated.experiences = [
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
          ];
        }
      } else {
        updated.experiences = [];
      }
    }

    setData(updated);
    setLocalErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // =========================
  // 🔹 Experience change
  // =========================
  const handleExperienceChange = (index, e) => {
    const { name, value, type, files } = e.target;
    const val = type === "file" ? files[0] : value;

    const newExperiences = [...data.experiences];
    newExperiences[index][name] = val;

    // Auto Duration Calculation
    const start = new Date(newExperiences[index].startDate);
    const end = new Date(newExperiences[index].endDate);

    if (!isNaN(start) && !isNaN(end) && end > start) {
      const y = end.getFullYear() - start.getFullYear();
      const m = end.getMonth() - start.getMonth();

      let years = y;
      let months = m;

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

    setData((prev) => ({ ...prev, experiences: newExperiences }));

    setLocalErrors((prev) => ({
      ...prev,
      [`${name}_${index}`]: "",
    }));
  };

  // =========================
  // 🔹 Add / Remove experience
  // =========================
  const emptyExperience = {
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
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, emptyExperience],
    }));
  };

  const removeExperience = (index) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // =========================
  // 🔹 Next Button
  // =========================
  const next = () => {
    const errs = simpleValidateProfessional(data);
    setLocalErrors({ ...errs });
    if (Object.keys(errs).length === 0) nextStep();
  };

  const prev = () => prevStep();

  // =========================
  // 🔹 UI
  // =========================
  return (
    <div className="form-wrap">


      <div className="form-grid">
        <div className="field">
          <label>
            Employee ID <span className="required-star">*</span>
          </label>
          <input
            name="employeeId"
            value={data.employeeId}
            onChange={handleChange}
          />
          {localErrors.employeeId && (
            <small className="err">{localErrors.employeeId}</small>
          )}
        </div>

        <div className="field">
          <label>
            Date of Joining <span className="required-star">*</span>
          </label>
          <input
            type="date"
            name="dateOfJoining"
            value={data.dateOfJoining}
            onChange={handleChange}
          />
          {localErrors.dateOfJoining && (
            <small className="err">{localErrors.dateOfJoining}</small>
          )}
        </div>

        <div className="field">
          <label>
            Role <span className="required-star">*</span>
          </label>
          <input name="role" value={data.role} onChange={handleChange} />
          {localErrors.role && (
            <small className="err">{localErrors.role}</small>
          )}
        </div>

        <div className="field">
          <label>
            Department <span className="required-star">*</span>
          </label>
          <select
            name="department"
            value={data.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {localErrors.department && (
            <small className="err">{localErrors.department}</small>
          )}
        </div>
      </div>

      <div className="field checkbox-field">
        <label style={{ marginTop: "10px" }}>
          <input
            type="checkbox"
            name="hasExperience"
            checked={data.hasExperience}
            onChange={handleChange}
          />
          &nbsp; Experienced?
        </label>
      </div>

      {data.hasExperience &&
        data.experiences.map((exp, index) => (
          <div key={index} className="experience-block">
            {index === 0 ? (
              <h4>Current Company Experience</h4>
            ) : (
              <h4>Previous Company Experience {index}</h4>
            )}

            <div className="form-grid">
              {[
                ["companyName", "Company Name"],
                ["companyLocation", "Company Location"],
                ["jobTitle", "Job Title"],
                ["startDate", "Start Date", "date"],
                ["endDate", "End Date", "date"],

                // 🔹 Added readonly Duration field
                [
                  "duration",
                  "Duration",
                  "text",
                  true, // readonly flag
                ],

                ["roles", "Roles & Responsibilities", "textarea"],
                ["projects", "Projects", "textarea"],
                ["skills", "Skills"],
                ["salary", "Salary"],
                ["hrName", "HR Name"],
                ["hrEmail", "HR Email"],
                ["hrPhone", "HR Phone"],
                ["managerName", "Manager Name"],
                ["managerEmail", "Manager Email"],
                ["managerPhone", "Manager Phone"],
              ].map(([field, label, type = "text", readonly = false]) => (
                <div key={field} className="field">
                  <label>
                    {label} <span className="required-star">*</span>
                  </label>

                  {type === "textarea" ? (
                    <textarea
                      name={field}
                      value={exp[field]}
                      onChange={(e) => handleExperienceChange(index, e)}
                    />
                  ) : readonly ? (
                    <input
                      type="text"
                      name={field}
                      value={exp[field]}
                      readOnly
                      style={{
                        background: "#f3f3f3",
                        cursor: "not-allowed",
                      }}
                    />
                  ) : (
                    <input
                      type={type}
                      name={field}
                      value={exp[field]}
                      onChange={(e) => handleExperienceChange(index, e)}
                    />
                  )}

                  {localErrors[`${field}_${index}`] && (
                    <small className="err">
                      {localErrors[`${field}_${index}`]}
                    </small>
                  )}
                </div>
              ))}

              {index === 0 ? (
                <div className="field">
                  <label>
                    OfferLetter (PDF) <span className="required-star">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    name="offerLetter"
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {localErrors[`offerLetter_${index}`] && (
                    <small className="err">
                      {localErrors[`offerLetter_${index}`]}
                    </small>
                  )}
                </div>
              ) : (
                <div className="field">
                  <label>
                    Reliving Letter (PDF){" "}
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    name="relivingLetter"
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {localErrors[`relivingLetter_${index}`] && (
                    <small className="err">
                      {localErrors[`relivingLetter_${index}`]}
                    </small>
                  )}
                </div>
              )}

              <div className="field">
                <label>
                  Salary Slips (PDF) <span className="required-star">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  name="salarySlips"
                  onChange={(e) => handleExperienceChange(index, e)}
                />
                {localErrors[`salarySlips_${index}`] && (
                  <small className="err">
                    {localErrors[`salarySlips_${index}`]}
                  </small>
                )}
              </div>
            </div>

            {data.experiences.length > 1 && (
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

      {data.hasExperience && (
        <div className="add-exp-btn-wrap">
          <button type="button" className="btn add" onClick={addExperience}>
            Add More Experience
          </button>
        </div>
      )}

      <div className="form-actions">
        <button className="btn secondary" onClick={prev}>
          Back
        </button>
        <button className="btn primary" onClick={next}>
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
};

export default ProfessionalDetails;
