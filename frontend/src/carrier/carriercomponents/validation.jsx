const isEmpty = (v) => !v || String(v).trim() === '';
const isEmail = (s) => /^[\w.%+-]+@(gmail|yahoo|outlook)\.com$/i.test(s.trim());
const isPhone = (s) => /^[0-9\-\+\s]{7,15}$/.test(s);

export const simpleValidatePersonal = (data) => {
  const errs = {};

  if (!data.firstName) errs.firstName = 'First name is required';
  if (!data.lastName) errs.lastName = 'Last name is required';

  if (isEmpty(data.email)) {
    errs.email = "Email is required";
  } else if (!isEmail(data.email)) {
    errs.email = "Email must be a valid @gmail/@yahoo/@outlook address";
  }

  

  if (!data.phone) errs.phone = 'Phone number is required';
  if (!data.gender) errs.gender = 'Gender is required';
  if (!data.bloodGroup) errs.bloodGroup = 'Blood group is required';
  if (!data.currentAddress) errs.currentAddress = 'Current address is required';
  if (!data.permanentAddress) errs.permanentAddress = 'Permanent address is required';
  if (!data.pincode) errs.pincode = 'Pincode is required';
  if(!data.landmark) errs.landmark='Landmark is required';
  if (!data.state) errs.state = 'State is required';
  if (!data.photo) errs.photo = 'Please upload a photo';
  return errs;
};

export const simpleValidateEducation = (data) => {
  const errs = {};

  // --- 10th ---
  if (!data.schoolName10) errs.schoolName10 = 'School name required';
  // Convert year strings to numbers for validation consistency
  const year10 = Number(data.year10);
  if (!year10) errs.year10 = '10th passing year required';
  if (!data.cgpa10) errs.cgpa10 = '10th CGPA required';

  // --- Inter/Diploma ---
  if (!data.interOrDiploma) errs.interOrDiploma = 'Select Intermediate or Diploma';
  if (!data.collegeName12) errs.collegeName12 = 'College name required';
  const year12 = Number(data.year12);
  if (!year12) errs.year12 = 'Year of passing required';
  if (!data.cgpa12) errs.cgpa12 = 'CGPA required';

  // --- UG (B.Tech/Degree) ---
  if (!data.collegeNameUG) errs.collegeNameUG = 'College name required';
  const yearUG = Number(data.yearUG);
  if (!yearUG) errs.yearUG = 'Year of passing required';
  if (!data.cgpaUG) errs.cgpaUG = 'CGPA required';

  // --- 10th to 12th/Diploma gap validation ---
  if (year10 && year12 && data.interOrDiploma) {
    const diff = year12 - year10;
    const expected = data.interOrDiploma === 'Intermediate' ? 2 : 3;

    if (diff !== expected) {
      errs.gapReason12 = `Expected ${expected} year gap between 10th and ${data.interOrDiploma}. Please specify reason.`;
    }
  }

  // --- 12th/Diploma to UG gap validation ---
  if (year12 && data.interOrDiploma && yearUG) {
    const diff = yearUG - year12;
    let expectedUGGap;

    if (data.interOrDiploma === 'Intermediate') {
      expectedUGGap = 4;
    } else if (data.interOrDiploma === 'Diploma') {
      expectedUGGap = 3;
    }

    if (expectedUGGap && diff !== expectedUGGap) {
      errs.gapReasonUG = `Expected ${expectedUGGap} year gap between ${data.interOrDiploma} and Degree. Please specify reason.`;
    }
  }

  // --- Enforce Gap Reason Input ---
  // If a gap error exists, the user MUST provide a reason.
  if (errs.gapReason12 && isEmpty(data.gapReason12)) {
    errs.gapReason12 = 'Reason for this gap is required.';
  }
  if (errs.gapReasonUG && isEmpty(data.gapReasonUG)) {
    errs.gapReasonUG = 'Reason for this gap is required.';
  }

  return errs;
};
export const simpleValidateProfessional = (data) => {
  const errs = {};

  if (!data.jobType) errs.jobType = "Please select Fresher or Experienced.";

  if (data.jobType === "fresher") {
    if (!data.skills) errs.skills = "Skills are required.";
    if (data.resume && data.resume.type !== "application/pdf") {
      errs.resume = "Only PDF resumes are allowed.";
    }
  }

  if (data.jobType === "experienced") {
    if (!data.experiences || data.experiences.length === 0)
      errs.experiences = "Please add at least one experience.";
    else {
      data.experiences.forEach((exp, i) => {
        if (!exp.companyName)
          errs[`exp_${i}_companyName`] = "Company name required.";
      });
    }
  }

  return errs;
};



export function validateAll(personal, education, professional) {
  return {
    ...simpleValidatePersonal(personal),
    ...simpleValidateEducation(education),
    ...simpleValidateProfessional(professional)
  };
}
