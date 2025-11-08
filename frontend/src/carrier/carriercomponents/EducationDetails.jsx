import React, { useState } from 'react';
import { simpleValidateEducation } from './validation';

const EducationDetails = ({ data, setData, setActive, errors, setErrors }) => {
  const years = Array.from({ length: 2025 - 1960 + 1 }, (_, i) => 2025 - i);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleGapReasonChange = (e) => {
    const { name, value } = e.target;
    // This ONLY updates the data state. 
    // It avoids clearing the error immediately, which fixes the typing bug.
    setData(prev => ({ ...prev, [name]: value }));
  };

  const next = () => {
    const errs = simpleValidateEducation(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setActive('professional');
    }
  };

  const prev = () => setActive('personal');

  return (
    <div className="form-wrap">
      <h3>Education Details</h3>

      <div className="form-grid">

        {/* ---------- 10th Class ---------- */}
        <div className="field full"><h4>10th Class</h4></div>

        <div className="field">
          <label>School Name <span className="required-star">*</span></label>
          <input
            name="schoolName10"
            value={data.schoolName10 || ''}
            onChange={handleChange}
          />
          {errors.schoolName10 && <small className="err">{errors.schoolName10}</small>}
        </div>

        <div className="field">
          <label>Year of Passing <span className="required-star">*</span></label>
          <select name="year10" value={data.year10 || ''} onChange={handleChange}>
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.year10 && <small className="err">{errors.year10}</small>}
        </div>

        <div className="field">
          <label>CGPA / Percentage <span className="required-star">*</span></label>
          <input
            type="number"
            step="0.01"
            name="cgpa10"
            value={data.cgpa10 || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData(prev => ({ ...prev, cgpa10: value }));
              }
            }}
            placeholder="Enter CGPA or %"
          />
          {errors.cgpa10 && <small className="err">{errors.cgpa10}</small>}
        </div>

        {/* ---------- Intermediate / Diploma ---------- */}
        <div className="field full"><h4>Intermediate / Diploma</h4></div>

        <div className="field">
          <label>Choose <span className="required-star">*</span></label>
          <select
            name="interOrDiploma"
            value={data.interOrDiploma || ''}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Diploma">Diploma</option>
          </select>
          {errors.interOrDiploma && <small className="err">{errors.interOrDiploma}</small>}
        </div>

        <div className="field">
          <label>College Name <span className="required-star">*</span></label>
          <input
            name="collegeName12"
            value={data.collegeName12 || ''}
            onChange={handleChange}
          />
          {errors.collegeName12 && <small className="err">{errors.collegeName12}</small>}
        </div>

        <div className="field">
          <label>Year of Passing <span className="required-star">*</span></label>
          <select name="year12" value={data.year12 || ''} onChange={handleChange}>
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.year12 && <small className="err">{errors.year12}</small>}
        </div>

        <div className="field">
          <label>CGPA / Percentage <span className="required-star">*</span></label>
          <input
            type="number"
            step="0.01"
            name="cgpa12"
            value={data.cgpa12 || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData(prev => ({ ...prev, cgpa12: value }));
              }
            }}
            placeholder="Enter CGPA or %"
          />
          {errors.cgpa12 && <small className="err">{errors.cgpa12}</small>}
        </div>

        {errors.gapReason12 && (
          <div className="field full">
            <label>Reason for Gap <span className="required-star">*</span></label>
            <input
  type='text'
  name="gapReason12"
  value={data.gapReason12 || ''}
  onChange={handleGapReasonChange} // ✅ FIX: Use the general handleChange function
  placeholder="Explain your gap after 10th"
/>
            <small className="err">{errors.gapReason12}</small>
          </div>
        )}

        {/* ---------- B.Tech / Degree ---------- */}
        <div className="field full"><h4>B.Tech / Degree</h4></div>

        <div className="field">
          <label>College Name <span className="required-star">*</span></label>
          <input
            name="collegeNameUG"
            value={data.collegeNameUG || ''}
            onChange={handleChange}
          />
          {errors.collegeNameUG && <small className="err">{errors.collegeNameUG}</small>}
        </div>

        <div className="field">
          <label>Year of Passing <span className="required-star">*</span></label>
          <select name="yearUG" value={data.yearUG || ''} onChange={handleChange}>
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.yearUG && <small className="err">{errors.yearUG}</small>}
        </div>

        <div className="field">
          <label>CGPA / Percentage <span className="required-star">*</span></label>
          <input
            type="number"
            step="0.01"
            name="cgpaUG"
            value={data.cgpaUG || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData(prev => ({ ...prev, cgpaUG: value }));
              }
            }}
            placeholder="Enter CGPA or %"
          />
          {errors.cgpaUG && <small className="err">{errors.cgpaUG}</small>}
        </div>

        {errors.gapReasonUG && (
          <div className="field full">
            <label>Reason for Gap <span className="required-star">*</span></label>
            <input
              name="gapReasonUG"
              value={data.gapReasonUG || ''}
              onChange={handleGapReasonChange}
              placeholder="Explain your gap before Degree"
            />
            <small className="err">{errors.gapReasonUG}</small>
          </div>
        )}
      </div>

      {/* ---------- Buttons ---------- */}
      <div className="form-actions">
        <button className="btn secondary" onClick={prev}>Back: Personal</button>
        <button className="btn primary_app" onClick={next}>Next: Professional</button>
      </div>
    </div>
  );
};

export default EducationDetails;
