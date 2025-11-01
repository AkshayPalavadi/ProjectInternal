import React, { useState,useEffect } from 'react';
import Sidebar from './Sidebar';
import PersonalDetails from './PersonalDetails';
import EducationDetails from './EducationDetails';
import ProfessionalDetails from './ProfessionalDetails';
import ReviewSubmit from './ReviewSubmit';
import './PersonApp.css';

function PersonApp() {
  const [active, setActive] = useState('personal'); // 'personal' | 'education' | 'professional' | 'review'
  const [formData, setFormData] = useState({
  jobType: "fresher",
  experiences: [],
});

  
  const  [personal, setPersonal] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    alternativePhone: '',
    currentAddress: "",
  permanentAddress: "",
  sameAddress: false,
  photo: null,
  bloodGroup: "",
  gender: "",
  landmark: "",
  pincode: "",
  village: "",
  state: "",
  });
  const [education, setEducation] = useState({
    schoolName10: '',
  year10: '',
  cgpa10: '',
  interOrDiploma: '',
  collegeName12: '',
  year12: '',
  cgpa12: '',
  collegeNameUG: '',
  yearUG: '',
  cgpaUG: '',
  gapReason12:'',

  gapReasonUG: '',
});

  const [professional, setProfessional] = useState({
    // ---------- Professional Details ----------
    jobType: '',
  resume: null,
  skills: '',
  projects: '',
  linkedin: '',
  certifications: '',
  achievements: '',
  experiences: [],
  
  });

  // errors state keeps track of missing fields during final validation
  const [errors, setErrors] = useState({});

  const goTo = (step) => {
    setActive(step);
  };
   useEffect(() => {
  const savedData = localStorage.getItem("quickDetailsData");
  if (savedData) {
    const data = JSON.parse(savedData);

    // ✅ Autofill Personal Details
    setPersonal((prev) => ({
      ...prev,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      alternativePhone: data.alternatePhone || "",
      currentAddress: "",
      permanentAddress: "",
    }));

    // ✅ Autofill Education Details
    setEducation((prev) => ({
      ...prev,
      collegeNameUG: data.college || "",
      yearUG: data.yearOfPassing || "",
      cgpaUG: data.cgpa || "",
      gapReasonUG: "",
      interOrDiploma: data.course || "",
    }));

    // ✅ Autofill Professional Details
    setProfessional((prev) => ({
      ...prev,
      jobType: data.employeeType || "",
      skills: data.skills || "",
      resume: data.resume || null,
      companyName: data.companyName || "",
      experienceYears: data.experienceYears || "",
    }));
  }
}, []);

  return (
    <div className="dashboard">
      <aside className="sidebar-wrap">
        <div className="brand">
          <div> <img className="brand-circle" src="logo.jpg" alt="Company Logo" /></div>
          <div>
            <div className="brand-title">DhaTvi Business</div>
            <div className="brand-sub">Driving Technology</div>
          </div>
        </div>

        <Sidebar active={active} onNavigate={goTo} />

      </aside>

      <main className="main-content">
        <header>
          <h2 className="topbar">Job Application Form</h2>
        </header>

        <section className="content-card">
          {active === 'personal' && (
            <PersonalDetails
              data={personal}
              setData={setPersonal}
              setActive={setActive}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {active === 'education' && (
            <EducationDetails
              data={education}
              setData={setEducation}
              setActive={setActive}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {active === 'professional' && (
            <ProfessionalDetails
              data={professional}
              setData={setProfessional}
              setActive={setActive}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {active === 'review' && (
            <ReviewSubmit
              personal={personal}
              education={education}
              professional={professional}
              setErrors={setErrors}
              onBack={() => setActive('personal')}
              onSuccess={() => {
                // simple success behavior for demo:
                alert('Application submitted successfully!');
                // optionally reset
                setPersonal({ firstName:'', middleName:'', lastName:'', email:'', phone:'', address:'' });
                setEducation({ highestDegree:'', institution:'', yearOfPassing:'', additionalInfo:'' });
                setProfessional({ company:'', title:'', experienceYears:'', skills:'' });
                setErrors({});
                setActive('personal');
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default PersonApp;
