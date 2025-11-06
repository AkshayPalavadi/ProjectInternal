import React, { useState } from "react";
// import Sidebar from './component/Sidebar';
import PersonalDetails from "./component/PersonalDetails.jsx";
import EducationDetails from "./component/EducationaDetails.jsx";
import ProfessionalDetails from "./component/ProfessionalDetails.jsx";
import ReviewSubmit from "./component/ReviewSubmit.jsx";
import Stepper from "./component/Stepper.jsx";
import "./component/indexApp.css";
import SidebarLayout from "./Components/SidebarLayout.jsx";
import { useNavigate } from "react-router-dom";


// ✅ Import existing validation functions
import {
  simpleValidatePersonal,
  simpleValidateEducation,
  simpleValidateProfessional,
} from "./component/validation.jsx";

function PersonApp() {
  // -------------------- STEP MANAGEMENT --------------------
  const steps = [
    "Personal Details",
    "Education Details",
    "Professional Details",
    "Review & Submit",
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

  const getStepName = () => {
    switch (currentStep) {
      case 0:
        return "personal";
      case 1:
        return "education";
      case 2:
        return "professional";
      case 3:
        return "review";
      default:
        return "personal";
    }
  };

  const active = getStepName();
  const handleSuccess = () => {
    // ✅ mark that the form was submitted
    localStorage.setItem("applicationSubmitted", "true");

    // ✅ navigate to employee review/details page
    navigate("/employee/details");
  };

  // -------------------- FORM STATES --------------------
  const [personal, setPersonal] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    email: "",
    phone: "",
    alternativePhone: "",
    gender: "",
    bloodGroup: "",
    dob: "",
    maritalStatus: "",
    isMarried: false,
    emergencyNumber: "",
    nominee1: "",
    nominee2: "",
    currentAddress: "",
    permanentAddress: "",
    sameAddress: false,
    landmark: "",
    pincode: "",
    village: "",
    state: "",
    aadharNumber: "",
    panNumber: "",
    photo: null,
    aadharUpload: null,
    panUpload: null,
    marriageCertificate: null,
  });

  const [education, setEducation] = useState({
    schoolName10: "",
    year10: "",
    cgpa10: "",
    certificate10: null,
    interOrDiploma: "",
    collegeName12: "",
    year12: "",
    cgpa12: "",
    certificate12: null,
    gapReason12: "",
    collegeNameUG: "",
    yearUG: "",
    cgpaUG: "",
    certificateUG: null,
    gapReasonUG: "",
    hasMTech: false,
    collegeNameMTech: "",
    yearMTech: "",
    cgpaMTech: "",
    certificateMTech: null,
  });

  const [professional, setProfessional] = useState({
    employeeId: "",
    dateOfJoining: "",
    role: "",
    department: "",
    salary: "",
    hasExperience: false,
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
  });

  // -------------------- VALIDATION (from external file) --------------------
  const validateCurrentStep = () => {
    let newErrors = {};
    if (currentStep === 0) newErrors = simpleValidatePersonal(personal);
    else if (currentStep === 1) newErrors = simpleValidateEducation(education);
    else if (currentStep === 2)
      newErrors = simpleValidateProfessional(professional);
    console.log("Validation errors:", newErrors); // 👈 add this

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- STEP CONTROLLERS --------------------
const nextStep = () => {
  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
};


  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const resetForm = () => {
    setPersonal({
      firstName: "",
      middleName: "",
      lastName: "",
      fatherName: "",
      motherName: "",
      email: "",
      phone: "",
      alternativePhone: "",
      gender: "",
      bloodGroup: "",
      dob: "",
      maritalStatus: "",
      isMarried: false,
      nationality: "",
      emergencyNumber: "",
      nominee1: "",
      nominee2: "",
      currentAddress: "",
      permanentAddress: "",
      sameAddress: false,
      landmark: "",
      pincode: "",
      village: "",
      state: "",
      aadharNumber: "",
      panNumber: "",
      photo: null,
      aadharUpload: null,
      panUpload: null,
      marriageCertificate: null,
    });
    setEducation({
      schoolName10: "",
      year10: "",
      cgpa10: "",
      certificate10: null,
      interOrDiploma: "",
      collegeName12: "",
      year12: "",
      cgpa12: "",
      certificate12: null,
      gapReason12: "",
      collegeNameUG: "",
      yearUG: "",
      cgpaUG: "",
      certificateUG: null,
      gapReasonUG: "",
      hasMTech: false,
      collegeNameMTech: "",
      yearMTech: "",
      cgpaMTech: "",
      certificateMTech: null,
    });
    setProfessional({
      employeeId: "",
      dateOfJoining: "",
      role: "",
      department: "",
      salary: "",
      hasExperience: false,
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
    });
    setErrors({});
    setCurrentStep(0);
  };

  // -------------------- RENDER --------------------
  return (
    <div className="dashboard-employee">
      <main className="main-content">
        <header className="topbar-employee">
          <h2>Employee Application Form</h2>
        </header>

        <section className="content-card">
          {/* ✅ Stepper on top */}
          <Stepper steps={steps} currentStep={currentStep} />

          {/* ✅ Personal Details */}
          {active === "personal" && (
            <PersonalDetails
              data={personal}
              setData={setPersonal}
              errors={errors}
              setErrors={setErrors}
              nextStep={nextStep}
            />
          )}

          {/* ✅ Education Details */}
          {active === "education" && (
            <EducationDetails
              data={education}
              setData={setEducation}
              errors={errors}
              setErrors={setErrors}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {/* ✅ Professional Details */}
          {active === "professional" && (
            <ProfessionalDetails
              data={professional}
              setData={setProfessional}
              errors={errors}
              setErrors={setErrors}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {/* ✅ Review & Submit */}
          {active === "review" && (
            <ReviewSubmit
              personal={personal}
              education={education}
              professional={professional}
              setErrors={setErrors}
              prevStep={prevStep}
              onSuccess={handleSuccess}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default PersonApp;
