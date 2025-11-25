// ---------- BASIC HELPERS ----------
const isEmpty = (v) => !v || String(v).trim() === '';

const isValidName = (s) => /^[A-Za-z\s]+$/.test(s?.trim());
const isEmail = (s) =>
  /^[\w.%+-]+@(gmail|yahoo|outlook)\.com$/i.test(s?.trim());

const isValidPhone = (s) => /^[0-9]{10}$/.test(s?.trim());

const isValidAddress = (s) => typeof s === "string" && s.trim().length >= 3;

const isValidYear = (y) => /^[0-9]{4}$/.test(String(y));

const isValidCGPA = (c) => /^([0-9](\.\d{1,2})?|10(\.0{1,2})?)$/.test(String(c));

// -----------------------------------------------------
//                PERSONAL VALIDATION
// -----------------------------------------------------
export const simpleValidatePersonal = (data) => {
  const errs = {};

  // First Name
  if (isEmpty(data.firstName)) {
    errs.firstName = "First name is required";
  } else if (!isValidName(data.firstName)) {
    errs.firstName = "First name must contain only letters";
  }

  // Last Name
  if (isEmpty(data.lastName)) {
    errs.lastName = "Last name is required";
  } else if (!isValidName(data.lastName)) {
    errs.lastName = "Last name must contain only letters";
  }

  // Email
  if (isEmpty(data.email)) {
    errs.email = "Email is required";
  } else if (!isEmail(data.email)) {
    errs.email = "Email must be a valid @gmail/@yahoo/@outlook address";
  }

  // Phone
  if (isEmpty(data.phone)) {
    errs.phone = "Phone number is required";
  } else if (!isValidPhone(data.phone)) {
    errs.phone = "Phone number must be exactly 10 digits";
  }

  // Gender
  if (isEmpty(data.gender)) errs.gender = "Gender is required";

  // Current Address
  if (!isValidAddress(data.currentAddress))
    errs.currentAddress = "Current address is required";

  // Permanent Address
  if (!isValidAddress(data.permanentAddress))
    errs.permanentAddress = "Permanent address is required";

  // Pincode
  if (!/^[0-9]{6}$/.test(data.pincode))
    errs.pincode = "Pincode must be a 6-digit number";

  // Landmark
  if (!isValidAddress(data.landmark)) errs.landmark = "Landmark is required";

  // State
  if (!isValidName(data.state)) errs.state = "State must contain only letters";

  // Photo
  if (!data.photo) {
    errs.photo = "Please upload a photo";
  } else if (!data.photo.type?.startsWith("image/")) {
    errs.photo = "Uploaded file must be an image";
  }

  return errs;
};


// -----------------------------------------------------
//                EDUCATION VALIDATION
// -----------------------------------------------------
// -----------------------------------------------------
//                EDUCATION VALIDATION
// -----------------------------------------------------
export const simpleValidateEducation = (educations) => {
  const errs = {};
  let isValid = true;

  educations.forEach((edu, idx) => {
    
    // 1. Higher Education
    if (!edu.higherEducation) {
      errs[`higherEducation_${idx}`] = "This is Required Field";
      isValid = false;
    }

    // 2. Education Level
    if (!edu.educationLevel) {
      errs[`educationLevel_${idx}`] = "This is Required Field";
      isValid = false;
    }

    // 3. Education Type
    if (!edu.educationType) {
      errs[`educationType_${idx}`] = "This is Required Field";
      isValid = false;
    }

    // ----------- 4A. SSC Validation -------------
    if (edu.educationLevel === "SSC") {

      // School Name → must be letters only
      if (!edu.schoolName) {
        errs[`schoolName_${idx}`] = "School Name is Required";
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(edu.schoolName.trim())) {
        errs[`schoolName_${idx}`] = "School Name must contain only letters";
        isValid = false;
      }

      if (!edu.board) {
        errs[`board_${idx}`] = "Board Type is Required";
        isValid = false;
      }
    }

    // ----------- 4B. Other levels: College Name -------------
    if (edu.educationLevel && edu.educationLevel !== "SSC") {
      if (!edu.collegeName) {
        errs[`collegeName_${idx}`] = "College Name is Required";
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(edu.collegeName.trim())) {
        errs[`collegeName_${idx}`] = "College Name must contain only letters";
        isValid = false;
      }
    }

    // ----------- 5. Year of Passing -------------
    if (!edu.yearOfPassing) {
      errs[`yearOfPassing_${idx}`] = "Year Of Passing Required";
      isValid = false;
    } else if (!/^[0-9]{4}$/.test(edu.yearOfPassing)) {
      errs[`yearOfPassing_${idx}`] = "Invalid Year";
      isValid = false;
    }

    // ----------- 6. Percentage / CGPA Validation -------------
    const num = Number(edu.percentage);

    if (!edu.percentage) {
      errs[`percentage_${idx}`] = "Percentage or CGPA is required";
      isValid = false;
    } 
    else if (isNaN(num)) {
      errs[`percentage_${idx}`] = "Only numbers or decimals allowed";
      isValid = false;
    } 
    else {
      // CGPA (5.5 - 9.8) → if less than 10 & has decimal
      if (num < 10) {
        if (num < 5.5 || num > 9.8) {
          errs[`percentage_${idx}`] = "CGPA must be between 5.5 and 9.8";
          isValid = false;
        }
      }
      // Percentage (35-99)
      else {
        if (num < 35 || num > 99) {
          errs[`percentage_${idx}`] = "Percentage must be between 35 and 99";
          isValid = false;
        }
      }
    }

  });

  return errs ;
};




// -----------------------------------------------------
//             PROFESSIONAL VALIDATION
// -----------------------------------------------------
export const simpleValidateProfessional = (data) => {
  const errs = {};
  
  if (!data.heardFrom) {
    errs.heardFrom = "This field is required";
  }
  // If social media selected
if (localData.heardFrom === "socialMedia") {
  if (!localData.platformName?.trim()) {
    errs.platformName = "Please mention the social media platform";
  }
}

// If "other" selected
if (localData.heardFrom === "other") {
  if (!localData.specifyOther?.trim()) {
    errs.specifyOther = "Please specify the source";
  }
}


  if (data.heardFrom === "employee") {
    if (!data.employeeName?.trim()) {
      errs.employeeName = "Employee name is required";
    }
    if (!data.employeeEmail?.trim()) {
      errs.employeeEmail = "Employee email is required";
    }
  }

  if (!data.jobType) {
    errs.jobType = "Please select Fresher or Experienced.";
    return errs;
  }

  // -------- FRESHER --------
  if (data.jobType === "fresher") {
    if (isEmpty(data.skills)) errs.skills = "Skills are required.";

    if (data.resume && data.resume.type !== "application/pdf") {
      errs.resume = "Only PDF resumes are allowed.";
    }
  }

  // -------- EXPERIENCED --------
  if (data.jobType === "experienced") {
    if (!data.experiences || data.experiences.length === 0) {
      errs.experiences = "Please add at least one experience.";
    } else {
      data.experiences.forEach((exp, i) => {
        if (isEmpty(exp.companyName))
          errs[`exp_${i}_companyName`] = "Company name required";
        else if (!isValidName(exp.companyName))
          errs[`exp_${i}_companyName`] =
            "Company name must contain only letters";

        if (isEmpty(exp.role))
          errs[`exp_${i}_role`] = "Role is required";

        if (isEmpty(exp.years))
          errs[`exp_${i}_years`] = "Experience years required";
        else if (!/^[0-9]{1,2}$/.test(exp.years))
          errs[`exp_${i}_years`] = "Years must be a valid number";
      });
    }
  }

  return errs;
};


// -----------------------------------------------------
export function validateAll(personal, education, professional) {
  return {
    ...simpleValidatePersonal(personal),
    ...simpleValidateEducation(education.educations),
    ...simpleValidateProfessional(professional),
  };
}
