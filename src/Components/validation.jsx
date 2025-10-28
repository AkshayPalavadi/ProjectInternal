const countryPhoneRules = [
  { code: "+91", name: "India", length: 10 },
  { code: "+1", name: "USA/Canada", length: 10 },
  { code: "+44", name: "UK", length: 10 },
  { code: "+61", name: "Australia", length: 9 },
  { code: "+81", name: "Japan", length: 10 },
  { code: "+49", name: "Germany", length: 11 },
  { code: "+971", name: "UAE", length: 9 },
  { code: "+33", name: "France", length: 9 },
];
export const isValidCGPA = (cgpa) => {
  if (!cgpa) return false;
  if (!/^\d+(\.\d{1,2})?$/.test(cgpa)) return false;
  const val = parseFloat(cgpa);
  return val >= 0 && val <= 10;
};




// ✅ Updated validation function
export const isValidPhone = (countryCode, phone) => {
  if (!phone) return false;
  const rule = countryPhoneRules.find((c) => c.code === countryCode);

  // Allow only digits
  if (!/^\d+$/.test(phone)) return false;

  // Validate based on country-specific length
  if (rule) {
    return phone.length === rule.length;
  }

  // Default fallback (if country not in list)
  return phone.length >= 7 && phone.length <= 15;
};

// Email validation
export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export const isValidOfficeEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@dhatvibs\.com$/i.test(email);
};




// Aadhar validation (12 digits)
export const isValidAadhar = (aadhar) => {
  if (!aadhar) return false;
  return /^\d{12}$/.test(aadhar);
};

// PAN validation (ABCDE1234F)
export const isValidPan = (pan) => {
  if (!pan) return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(pan);
};

// Year validation (between 1950 and current year)
export const isValidYear = (year) => {
  if (!year) return false;
  if (!/^\d{4}$/.test(year)) return false;
  const y = Number(year);
  const current = new Date().getFullYear();
  return y >= 1950 && y <= current;
};

// File validation (type + size)
export const validateFile = (file, allowedMimeTypes = [], maxMB = 2) => {
  if (!file) return "File is required"
  if (file.size > maxMB * 1024 * 1024) {
    return `File size should be <= ${maxMB} MB`;
  }

  return null; // valid
};

// ----------------- Step Validation -----------------

export const validateStep = (step, formData) => {
  const errors = {};
  // Graduation



  // Step 1: Personal Details
  if (step === 1) {

    
    const resumeErr = validateFile(formData.resume, ["application/pdf"], 5);
    if (resumeErr) errors.resume = resumeErr;

    if (!formData.firstName || !formData.firstName.trim())
      errors.firstName = "First name is required";

    if (!formData.lastName || !formData.lastName.trim())
      errors.lastName = "Last name is required";

    if (!formData.personalEmail || !isValidEmail(formData.personalEmail))
      errors.personalEmail = "Enter a valid personal email";

    if (!isValidPhone(formData.countryCode, formData.phoneNumber)) {
  errors.phoneNumber = `Invalid phone number for selected country.`;
}
 


    if (!formData.permanentAddress || !formData.permanentAddress.trim())
      errors.address = "Address is required";
    if (!formData.currentAddress || !formData.currentAddress.trim())
      errors.address = "Address is required";

    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
  errors.pincode = "Enter a valid 6-digit pincode";
}

    

    const passportErr = validateFile(
      formData.passportPhoto,
      ["image/jpeg", "image/jpg", "image/png"],
      3
    );
    if (passportErr) errors.passportPhoto = passportErr;
    if (!formData.gender || formData.gender.trim() === "")
  errors.gender = "Please select gender";

  }

  // Step 2: Education
  if (step === 2) {
    // 10th
    if (!formData.education?.tenth?.schoolName?.trim())
      errors["education.tenth.schoolName"] = "School name is required";
    if (!isValidYear(formData.education?.tenth?.yearOfPassing))
      errors["education.tenth.yearOfPassing"] = "Enter a valid passing year";
    if (!isValidCGPA(formData.education?.tenth?.cgpa))
  errors["education.tenth.cgpa"] = "Enter a valid CGPA (0–10)";

    

    // 12th / diploma
    if (!formData.education?.intermediate?.collegeName?.trim())
      errors["education.intermediate.collegeName"] = "College name is required";
    if (!isValidYear(formData.education?.intermediate?.yearOfPassing))
      errors["education.intermediate.yearOfPassing"] = "Enter a valid passing year";
    if (!isValidCGPA(formData.education?.intermediate?.cgpa))
  errors["education.intermediate.cgpa"] = "Enter a valid CGPA (0–10)";

    

    // Graduation
    if (!formData.education?.degree?.collegeName?.trim())
      errors["education.degree.collegeName"] = "College name is required";
    if (!isValidYear(formData.education?.degree?.yearOfPassing))
      errors["education.degree.yearOfPassing"] = "Enter a valid passing year";
    if (!isValidCGPA(formData.education?.degree?.cgpa))
  errors["education.degree.cgpa"] = "Enter a valid CGPA (0–10)";

    


    // Post Graduation (optional)
    if (formData.education?.postGraduation) {
      if (!formData.education.postGraduation.collegeName?.trim())
        errors["education.postGraduation.collegeName"] =
          "College name is required";
      if (!isValidYear(formData.education.postGraduation.year))
        errors["education.postGraduation.year"] = "Enter a valid passing year";
      
    }
  }

  // Step 3: Employment

  if (step === 3) {
  // --- Basic professional details ---
  

  // --- Experienced case ---
  if (formData.isExperienced && formData.experiences?.length > 0) {
    formData.experiences.forEach((exp, index) => {
      if (!exp.companyName?.trim())
        errors[`experiences.${index}.companyName`] = "Company name is required";
      if(!exp.companyLocation?.trim())
        errors[`experiences.${index}.companyLocation`]="Company Location is required";
      if(!exp.jobTitle?.trim())
        errors[`experiences.${index}.jobTitle`]="JobTitle is required";

      if (!exp.startDate)
        errors[`experiences.${index}.startDate`] = "Start date is required";

      if (!exp.endDate)
        errors[`experiences.${index}.endDate`] = "End date is required";

      if (!exp.duration)
        errors[`experiences.${index}.duration`] = "Duration is required";

      if (!exp.roles?.trim())
  errors[`experiences.${index}.roles`] = "Roles & responsibilities are required";


      if (!exp.projects?.trim())
        errors[`experiences.${index}.projects`] = "Projects details are required";

      if (!exp.skills?.trim())
        errors[`experiences.${index}.skills`] = "Skills & technologies are required";

      if (!exp.salary?.trim())
        errors[`experiences.${index}.salary`] = "Salary details are required";

      if (!exp.relievingLetter)
        errors[`experiences.${index}.relievingLetter`] = "Relieving letter is required";
      if(index!==0){
             if (!exp.experienceLetter)
        errors[`experiences.${index}.experienceLetter`] = "experience letter is required";

      }
      

      if (!exp.salarySlips)
        errors[`experiences.${index}.salarySlips`] = "Salary slips are required";

      // HR Details
      if (!exp.hrName?.trim())
        errors[`experiences.${index}.hrName`] = "HR name is required";

      if (!exp.hrEmail?.trim())
        errors[`experiences.${index}.hrEmail`] = "HR email is required";

      if (!exp.hrPhone?.trim())
        errors[`experiences.${index}.hrPhone`] = "HR phone number is required";

      // Manager Details
      if (!exp.managerName?.trim())
        errors[`experiences.${index}.managerName`] = "Manager name is required";

      if (!exp.managerEmail?.trim())
        errors[`experiences.${index}.managerEmail`] = "Manager email is required";

      if (!exp.managerPhone?.trim())
        errors[`experiences.${index}.managerPhone`] = "Manager phone number is required";
    });
  }
}




  return errors;
};
