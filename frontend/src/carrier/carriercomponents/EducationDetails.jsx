import React, { useState } from "react";
import { simpleValidateEducation } from "./validation";

const blankEdu = {
  higherEducation: "",
  educationLevel: "",
  educationType: "",
  schoolName: "",
  collegeName: "",
  department:"",
  specilization:"",
  board: "",
  yearOfPassing: "",
  percentage: "",
};

const EducationDetails = ({ data, setData, setActive, errors, setErrors }) => {
  const [educations, setEducations] = useState(data.educations || [blankEdu]);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 1960; y <= currentYear + 1; y++) years.push(y);

  const educationLevels = [
    "SSC",
    "Intermediate or Diploma",
    "Under Graduation",
    "Post Graduation",
  ];

  const educationTypes = ["PartTime", "FullTime"];
  const boards = ["SSC", "CBSE"];

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...educations];
    updated[index][name] = value;

    if (name === "educationLevel") {
      updated[index].schoolName = "";
      updated[index].collegeName = "";
    }

    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[`${name}_${index}`];
      return newErr;
    });

    setEducations(updated);
  };

  const handleNumericDecimal = (index, e) => {
    let { value } = e.target;

    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts[1];

    // allow only 2 decimals
    if (parts[1] && parts[1].length > 2) return;

    const num = Number(value);

    // block > 100
    if (!isNaN(num) && num > 100) return;

    const updated = [...educations];
    updated[index].percentage = value;

    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[`percentage_${index}`];
      return newErr;
    });

    setEducations(updated);
  };

  const addMore = () => {
    setEducations((prev) => [
      ...prev,
      {
        higherEducation: "",
        educationLevel: "",
        educationType: "",
        schoolName: "",
        collegeName: "",
        board: "",
        yearOfPassing: "",
        percentage: "",
      },
    ]);
  };

  const removeEdu = (index) => {
    const updated = educations.filter((_, i) => i !== index);
    setEducations(updated.length ? updated : [{ ...blankEdu }]);
  };

const next = () => {
  const errs = simpleValidateEducation(educations);

  setErrors(errs || {});

  // Stop if there are validation errors
  if (Object.keys(errs).length > 0) return;

  // Save valid education data
  setData((prev) => ({ ...prev, educations }));

  // Move to Professional
  setActive("professional");
};


  return (
    <div className="form-wrap">
      <h3>Education Details</h3>

      {educations.map((edu, index) => (
        <div key={index} className="form-grid grouped-box">

          <div className="field">
            <label>Is this your Higher Education? *</label>
            <select
              name="higherEducation"
              value={edu.higherEducation}
              onChange={(e) => handleChange(index, e)}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors[`higherEducation_${index}`] && (
              <small className="err">{errors[`higherEducation_${index}`]}</small>
            )}
          </div>

          <div className="field">
            <label>Educational Level *</label>
            <select
              name="educationLevel"
              value={edu.educationLevel}
              onChange={(e) => handleChange(index, e)}
            >
              <option value="">Select</option>
              {educationLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            {errors[`educationLevel_${index}`] && (
              <small className="err">{errors[`educationLevel_${index}`]}</small>
            )}
          </div>

          <div className="field">
            <label>Education Type *</label>
            <select
              name="educationType"
              value={edu.educationType}
              onChange={(e) => handleChange(index, e)}
            >
              <option value="">Select</option>
              {educationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors[`educationType_${index}`] && (
              <small className="err">{errors[`educationType_${index}`]}</small>
            )}
          </div>

          {edu.educationLevel === "SSC" && (
            <>
              <div className="field full">
                <label>School Name *</label>
                <input
                  name="schoolName"
                  value={edu.schoolName}
                  onChange={(e) => handleChange(index, e)}
                />
                {errors[`schoolName_${index}`] && (
                  <small className="err">{errors[`schoolName_${index}`]}</small>
                )}
              </div>

              <div className="field">
                <label>Board of Education *</label>
                <select
                  name="board"
                  value={edu.board}
                  onChange={(e) => handleChange(index, e)}
                >
                  <option value="">Select</option>
                  {boards.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors[`board_${index}`] && (
                  <small className="err">{errors[`board_${index}`]}</small>
                )}
              </div>
            </>
          )}

          {edu.educationLevel && edu.educationLevel !== "SSC" && (
            <div>
            <div className="field">
              <label>College Name *</label>
              <input
                name="collegeName"
                value={edu.collegeName}
                onChange={(e) => handleChange(index, e)}
              />
              {errors[`collegeName_${index}`] && (
                <small className="err">{errors[`collegeName_${index}`]}</small>
              )}
            </div>
            <div className="field">
              <label>department</label>
              <input
                name="department"
                value={edu.department}
                onChange={(e) => handleChange(index, e)}
              />
              
            </div>
            <div className="field">
              <label>Specilization</label>
              <input
                name="specilization"
                value={edu.specilization}
                onChange={(e) => handleChange(index, e)}
              />
              
            </div>
            </div>
             
            
            
          )}

          <div className="field">
            <label>Year of Passing *</label>
            <select
              name="yearOfPassing"
              value={edu.yearOfPassing}
              onChange={(e) => handleChange(index, e)}
            >
              <option value="">Select</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            {errors[`yearOfPassing_${index}`] && (
              <small className="err">{errors[`yearOfPassing_${index}`]}</small>
            )}
          </div>

          <div className="field">
            <label>Percentage / CGPA *</label>
            <input
              name="percentage"
              value={edu.percentage}
              onChange={(e) => handleNumericDecimal(index, e)}
            />
            {errors[`percentage_${index}`] && (
              <small className="err">{errors[`percentage_${index}`]}</small>
            )}
          </div>

          {edu.higherEducation === "No" && (
            <div className="field full row-between">
              <button className="btn secondary" onClick={() => removeEdu(index)}>
                Remove
              </button>

              {index === educations.length - 1 && (
                <button className="btn primary_app" onClick={addMore}>
                  + Add More
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="form-actions">
        <button className="btn secondary" onClick={() => setActive("personal")}>
          Back
        </button>
        <button className="btn primary_app" onClick={next}>
          Next: Professional
        </button>
      </div>
    </div>
  );
};

export default EducationDetails;
