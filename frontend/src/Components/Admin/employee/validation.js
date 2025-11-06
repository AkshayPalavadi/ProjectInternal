// --- Utility functions ---
const isEmpty = (v) => !v || String(v).trim() === "";

// Email: accept gmail/yahoo/outlook only
const isEmail = (s) => /^[\w.%+-]+@(gmail|yahoo|outlook)\.com$/i.test(s.trim());
const isPhone = (s) => /^[0-9]{10}$/.test(String(s).trim());
const isPincode = (s) => /^[1-9][0-9]{5}$/.test(String(s).trim());

export const simpleValidatePersonal = (data) => {
  const errs = {};

  if (isEmpty(data.firstName)) errs.firstName = "First name is required";
  if (isEmpty(data.lastName)) errs.lastName = "Last name is required";

  if (isEmpty(data.email)) {
    errs.email = "Email is required";
  } else if (!isEmail(data.email)) {
    errs.email = "Email must be a valid @gmail/@yahoo/@outlook address";
  }

  // --- Phone number ---
  if (isEmpty(data.phone)) {
    errs.phone = "Phone number is required";
  } else if (!isPhone(data.phone)) {
    errs.phone = "Enter valid 10-digit number";
  }

  if (isEmpty(data.gender)) errs.gender = "Gender is required";
  if (isEmpty(data.bloodGroup)) errs.bloodGroup = "Blood group is required";

  // --- Address ---
  if (isEmpty(data.currentAddress))
    errs.currentAddress = "Current address is required";
  if (isEmpty(data.permanentAddress))
    errs.permanentAddress = "Permanent address is required";
  if (isEmpty(data.landmark)) errs.landmark = "Landmark is required";
  if (isEmpty(data.state)) errs.state = "State is required";

  // --- Pincode ---
  if (isEmpty(data.pincode)) {
    errs.pincode = "Pincode is required";
  } else if (!isPincode(data.pincode)) {
    errs.pincode = "Enter valid 6-digit pincode";
  }

  // --- Photo ---
  // if (isEmpty(data.photo)) {
  //   errs.photo = 'Please upload a photo';
  // } else if (!(data.photo instanceof File)) {
  //   errs.photo = 'Invalid file upload';
  // }

  return errs;
};

export const simpleValidateEducation = (data) => {
  const errs = {};

  // --- 10th ---
  if (!data.schoolName10) errs.schoolName10 = "School name required";
  // Convert year strings to numbers for validation consistency
  const year10 = Number(data.year10);
  if (!year10) errs.year10 = "10th passing year required";
  if (!data.cgpa10 || data.cgpa10.trim() === "") errs.cgpa10 = "CGPA required";

  // --- Inter/Diploma ---
  if (!data.interOrDiploma)
    errs.interOrDiploma = "Select Intermediate or Diploma";
  if (!data.collegeName12) errs.collegeName12 = "College name required";
  const year12 = Number(data.year12);
  if (!year12) errs.year12 = "Year of passing required";
  if (!data.cgpa12 || data.cgpa12.trim() == "") errs.cgpa12 = "CGPA required";

  // --- UG (B.Tech/Degree) ---
  if (!data.collegeNameUG) errs.collegeNameUG = "College name required";
  const yearUG = Number(data.yearUG);
  if (!yearUG) errs.yearUG = "Year of passing required";
  if (!data.cgpaUG || data.cgpaUG.trim() === "") errs.cgpaUG = "CGPA required";

  // --- 10th to 12th/Diploma gap validation ---
  // 10th → 12th/Diploma
  // 10th → 12th/Diploma
  if (year10 && year12 && data.interOrDiploma) {
    const diff = year12 - year10;
    const expected = data.interOrDiploma === "Intermediate" ? 2 : 3;

    // Only error if gap is wrong AND reason is empty
    if (
      diff !== expected &&
      (!data.gapReason12 || data.gapReason12.trim() === "")
    ) {
      errs.gapReason12 = `Expected ${expected} year gap between 10th and ${data.interOrDiploma}. Please specify reason.`;
    }
  }

  // 12th/Diploma → UG
  if (year12 && data.interOrDiploma && yearUG) {
    const diff = yearUG - year12;
    const expectedUGGap = data.interOrDiploma === "Intermediate" ? 4 : 3;

    if (
      diff !== expectedUGGap &&
      (!data.gapReasonUG || data.gapReasonUG.trim() === "")
    ) {
      errs.gapReasonUG = `Expected ${expectedUGGap} year gap between ${data.interOrDiploma} and Degree. Please specify reason.`;
    }
  }

  return errs;
};
export const simpleValidateProfessional = (data) => {
  const errs = {};

  // --- Job type validation ---
  if (!data.jobType) {
    errs.jobType = "Please select Fresher or Experience.";
    return errs; // stop early; rest depends on jobType
  }

  // --- Fresher validation ---
  if (data.jobType === "fresher") {
    // if (!data.resume) {
    //   errs.resume = "Resume is required.";
    // } else if (data.resume.type !== "application/pdf") {
    //   errs.resume = "Only PDF resumes are allowed.";
    // }

    if (!data.skills || data.skills.trim() === "") {
      errs.skills = "Skills are required.";
    }
    // if (!data.certificate) {
    //   errs.certificate = "certificate is required.";
    // } else if (data.certificate.type !== "application/pdf") {
    //   errs.certificate = "Only PDF resumes are allowed.";
    // }

    // Certifications & achievements are optional — no error
  }

  // --- Experience validation ---
  if (data.jobType === "experience") {
    // Must have at least one experience block
    if (!data.experiences || data.experiences.length === 0) {
      errs.experiences = "Please add at least one experience.";
      return errs;
    }

    // Validate resume
    if (!data.resume) {
      errs.resume = "Resume is required.";
    } else if (data.resume.type !== "application/pdf") {
      errs.resume = "Only PDF resumes are allowed.";
    }

    // Loop through all experiences
    data.experiences.forEach((exp, i) => {
      const prefix = `Experience ${i + 1}:`;

      if (!exp.companyName || exp.companyName.trim() === "")
        errs.companyName = "Company name is required.";
      if (!exp.companyLocation || exp.companyLocation.trim() === "")
        errs.companyLocation = "Company Location is required.";

      if (!exp.jobTitle || exp.jobTitle.trim() === "")
        errs.jobTitle = "JobTitle is required.";

      if (!exp.startDate) errs.startDate = "StartDate is required.";

      if (!exp.endDate) errs.endDate = "EndDate is required.";

      // Check start < end
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        if (end <= start)
          errs.dateOrder = " End date must be after start date.";
      }
      if (!exp.roles || exp.roles.trim() === "")
        errs.roles = "roles and responsibilites are required.";
      if (!exp.projects || exp.projects.trim() === "")
        errs.projects = "projects are required.";

      if (!exp.salary || exp.salary.trim() === "")
        errs.salary = "salary is required.";

      if (!exp.skills || exp.skills.trim() === "")
        errs.skills = "skills are required.";
    });
  }

  return errs;
};

export function validateAll(personal, education, professional) {
  return {
    ...simpleValidatePersonal(personal),
    ...simpleValidateEducation(education),
    ...simpleValidateProfessional(professional),
  };
}
