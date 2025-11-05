import React, { useState } from "react";
import PersonalDetails from "./PersonalDetails.jsx";
import EducationDetails from "./EducationaDetails.jsx";
import ProfessionalDetails from "./ProfessionalDetails.jsx";
import ReviewSubmit from "./ReviewSubmit.jsx";
import Stepper from "./Stepper.jsx";
import "./indexApp.css";
import { useNavigate } from "react-router-dom";

import {
  simpleValidatePersonal,
  simpleValidateEducation,
  simpleValidateProfessional,
} from "./validation.jsx";

function PersonApp() {
  const navigate = useNavigate();

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

  // -------------------- API HANDLERS --------------------
  const API_BASE = "https://internal-website-rho.vercel.app/api";

  const hasFile = (data) => {
    return Object.values(data).some((value) => value instanceof File);
  };

  const saveToDatabase = async (endpoint, data) => {
    try {
      let options = { method: "POST" };
      let bodyContent;

      if (hasFile(data)) {
        // If files are present, send multipart/form-data
        const formData = new FormData();
        for (const key in data) {
          if (Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key]));
          } else if (data[key] instanceof File) {
            formData.append(key, data[key]);
          } else {
            formData.append(key, data[key] ?? "");
          }
        }
        bodyContent = formData;
        options.body = bodyContent;
      } else {
        // Otherwise, send JSON
        options.headers = { "Content-Type": "application/json" };
        bodyContent = JSON.stringify(data);
        options.body = bodyContent;
      }

      console.log(`📤 Sending to ${endpoint}:`, data);

      const response = await fetch(`${API_BASE}/${endpoint}/save`, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Backend error: ${errorText}`);
        throw new Error(`Failed to save ${endpoint} details`);
      }

      const result = await response.json();
      console.log(`✅ ${endpoint} saved:`, result);
      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      alert(`Error saving ${endpoint} details. Please try again.`);
      return false;
    }
  };

  // -------------------- VALIDATION --------------------
  const validateAndSaveStep = async () => {
    let newErrors = {};
    let isValid = false;

    if (currentStep === 0) {
      newErrors = simpleValidatePersonal(personal);
      isValid = Object.keys(newErrors).length === 0;
      setErrors(newErrors);
      if (isValid) await saveToDatabase("personal", personal);
    } else if (currentStep === 1) {
      newErrors = simpleValidateEducation(education);
      isValid = Object.keys(newErrors).length === 0;
      setErrors(newErrors);
      if (isValid) await saveToDatabase("education", education);
    } else if (currentStep === 2) {
      newErrors = simpleValidateProfessional(professional);
      isValid = Object.keys(newErrors).length === 0;
      setErrors(newErrors);
      if (isValid) await saveToDatabase("professional", professional);
    }

    return isValid;
  };

  // -------------------- STEP CONTROLLERS --------------------
  const nextStep = async () => {
    const isValid = await validateAndSaveStep();
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSuccess = () => {
    localStorage.setItem("applicationSubmitted", "true");
    navigate("/employee/details");
  };

  // -------------------- RENDER --------------------
  return (
    <div className="dashboard-employee">
      <main className="main-content">
        <header className="topbar-employee">
          <h2>Employee Application Form</h2>
        </header>

        <section className="content-card">
          <Stepper steps={steps} currentStep={currentStep} />

          {active === "personal" && (
            <PersonalDetails
              data={personal}
              setData={setPersonal}
              errors={errors}
              setErrors={setErrors}
              nextStep={nextStep}
            />
          )}

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
