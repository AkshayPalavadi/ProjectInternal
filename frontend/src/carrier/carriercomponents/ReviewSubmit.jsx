import React, { useState } from 'react';
import { validateAll } from './validation';

const ReviewSubmit = ({ personal, education, professional, setErrors, onBack, onSuccess }) => {
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitErrors, setSubmitErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    setSubmitAttempted(true);

    const errs = validateAll(personal, education, professional);
    setErrors(errs);
    setSubmitErrors(errs);

    if (Object.keys(errs).length === 0) {
      setShowPopup(true);
      onSuccess();
    } else {
      const el = document.querySelector('.content-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderField = (label, value) => (
    <tr>
      <td className="review-label">{label}</td>
      <td className="review-value">
        {value !== '' && value !== null && value !== undefined
          ? value
          : <span className="muted">Not provided</span>}
      </td>
    </tr>
  );

  return (
    <div className="form-wrap">
      <h3>Review & Submit</h3>
      <div className="review-card">

        {/* ---------- PERSONAL DETAILS ---------- */}
        <h4>Personal Details</h4>
        <table className="review-table">
          <tbody>
            {renderField('First Name', personal.firstName)}
            {renderField('Middle Name', personal.middleName)}
            {renderField('Last Name', personal.lastName)}
            {renderField('Email', personal.email)}
            {renderField('Phone', personal.phone)}
            {renderField('Alternative Phone', personal.alternativePhone)}
            {renderField('Gender', personal.gender)}
            {renderField('Blood Group', personal.bloodGroup)}
            {renderField('Current Address', personal.currentAddress)}
            {renderField('Permanent Address', personal.permanentAddress)}
            {renderField('Same as Permanent', personal.sameAddress ? 'Yes' : 'No')}
            {renderField('Landmark', personal.landmark)}
            {renderField('Pincode', personal.pincode)}
            {renderField('Village', personal.village)}
            {renderField('State', personal.state)}
            {renderField('Photo', personal.photo ? personal.photo.name : 'No file uploaded')}
          </tbody>
        </table>

        {/* ---------- EDUCATION DETAILS ---------- */}
        <h4>Education Details</h4>

        {education.educations.map((edu, index) => (
          <div key={index}>
            <h5>{edu.higherEducation || `Education ${index + 1}`}</h5>

            <table className="review-table">
              <tbody>
                {renderField('Higher Education', edu.higherEducation)}
                {renderField('Level', edu.educationLevel)}
                {renderField('Education Type', edu.educationType)}
                {renderField('School Name', edu.schoolName)}
                {renderField('College Name', edu.collegeName)}
                {renderField('Board', edu.board)}
                {renderField('Year of Passing', edu.yearOfPassing)}
                {renderField('Percentage', edu.percentage)}
              </tbody>
            </table>
          </div>
        ))}

        {/* ---------- PROFESSIONAL DETAILS ---------- */}
        <h4>Professional Details</h4>
        <table className="review-table">
          <tbody>
            {renderField('Job Type', professional.jobType)}
            {renderField('Heard From', professional.heardFrom)}
          </tbody>
        </table>

        {professional.heardFrom === "employee" && (
          <table className="review-table">
            <tbody>
              {renderField("Employee Name", professional.employeeName)}
              {renderField("Employee Email", professional.employeeEmail)}
            </tbody>
          </table>
        )}

        {professional.jobType === 'fresher' && (
          <table className="review-table">
            <tbody>
              {renderField('Resume', professional.resume?.name)}
              {renderField('Skills', professional.skills?.join(", "))}
              {renderField('Projects', professional.projects)}
              {renderField('LinkedIn', professional.linkedin)}
              {renderField('Certifications', professional.certifications?.join(", "))}
              {renderField('Achievements', professional.achievements)}
            </tbody>
          </table>
        )}

        {professional.jobType === 'experience' && (
          <>
            {professional.experiences.length > 0 ? (
              professional.experiences.map((exp, index) => (
                <div key={index} className="review-subcard">
                  <h5>Experience {index + 1}</h5>
                  <table className="review-table">
                    <tbody>
                      {renderField('Company Name', exp.companyName)}
                      {renderField('Location', exp.companyLocation)}
                      {renderField('Job Title', exp.jobTitle)}
                      {renderField('Start Date', exp.startDate)}
                      {renderField('End Date', exp.endDate)}
                      {renderField('Duration', exp.duration)}
                      {renderField('Roles', exp.roles)}
                      {renderField('Projects', exp.projects)}
                      {renderField('Skills', exp.skills)}
                      {renderField('Salary', exp.salary)}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div className="muted">No work experience added.</div>
            )}
          </>
        )}

      </div>

      {submitAttempted && Object.keys(submitErrors).length > 0 && (
        <div className="submit-err">
          Please fill the required fields highlighted above.
          Missing: {Object.keys(submitErrors).join(', ')}
        </div>
      )}

      <div className="form-actions">
        <button className="btn secondary" onClick={onBack}>Back</button>
        <button className="btn primary_app" onClick={handleSubmit}>Submit Application</button>
      </div>

      {/* ---------- SUCCESS POPUP ---------- */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>🎉 Application Submitted Successfully!</h3>
            <p>Your details have been recorded.</p>
            <div className="popup-actions">
              <button className="btn primary_app" onClick={() => setShowPopup(false)}>OK</button>
              <button
                className="btn secondary"
                onClick={() => window.location.href = '/'}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewSubmit;
