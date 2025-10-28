// --- Utility functions ---
const isEmpty = (v) => !v || String(v).trim() === '';
const isEmail = (s) => /^[\w.%+-]+@(gmail|yahoo|outlook)\.com$/i.test(s.trim());
const isPhone = (s) => /^[6-9]\d{9}$/.test(String(s).trim());
const isPincode = (s) => /^[1-9][0-9]{5}$/.test(String(s).trim());
const isAadhar = (s) => /^[0-9]{12}$/.test(String(s).trim());
const isPAN = (s) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(s).trim());
const isValidEmail = (s) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());

// Helper: check file validity
const isValidPDF = (file) =>
  file instanceof File && file.type === 'application/pdf' && file.size <= 3 * 1024 * 1024;

// ==============================
// PERSONAL DETAILS VALIDATION
// ==============================
export const simpleValidatePersonal = (data) => {
  const errs = {};

  if (isEmpty(data.firstName)) errs.firstName = 'First name is required';
  if (isEmpty(data.lastName)) errs.lastName = 'Last name is required';
  if (isEmpty(data.fatherName)) errs.fatherName = 'Father name is required';
  if (isEmpty(data.motherName)) errs.motherName = 'Mother name is required';
  if (isEmpty(data.nominee1)) errs.nominee1 = 'Nominee 1 is required';
  if (isEmpty(data.nominee2)) errs.nominee2 = 'Nominee 2 is required';

  // Email
  if (isEmpty(data.email)) errs.email = 'Email is required';
  else if (!isEmail(data.email)) errs.email = 'Email must be valid (gmail/yahoo/outlook only)';

  // Phone
  if (isEmpty(data.phone)) errs.phone = 'Phone number is required';
  else if (!isPhone(data.phone)) errs.phone = 'Enter valid 10-digit number';

  if (isEmpty(data.emergencyNumber)) errs.emergencyNumber = 'Emergency contact number is required';
  else if (!isPhone(data.emergencyNumber)) errs.emergencyNumber = 'Enter valid 10-digit emergency number';

  // Gender, Address
  if (isEmpty(data.gender)) errs.gender = 'Gender is required';
  if (isEmpty(data.bloodGroup)) errs.bloodGroup = 'Blood group is required';
  if (isEmpty(data.currentAddress)) errs.currentAddress = 'Current address is required';
  if (isEmpty(data.permanentAddress)) errs.permanentAddress = 'Permanent address is required';
  if (isEmpty(data.landmark)) errs.landmark = 'Landmark is required';
  if (isEmpty(data.state)) errs.state = 'State is required';

  // Pincode
  if (isEmpty(data.pincode)) errs.pincode = 'Pincode is required';
  else if (!isPincode(data.pincode)) errs.pincode = 'Enter valid 6-digit pincode';

  // Photo
  if (!data.photo) errs.photo = 'Photo upload is required';
  else if (!(data.photo instanceof File)) errs.photo = 'Invalid photo upload';

  // Aadhar
  if (isEmpty(data.aadharNumber)) errs.aadharNumber = 'Aadhar number is required';
  else if (!isAadhar(data.aadharNumber)) errs.aadharNumber = 'Enter valid 12-digit Aadhar number';

  if (!data.aadharUpload) errs.aadharUpload = 'Aadhar upload is required';
  else if (!isValidPDF(data.aadharUpload)) errs.aadharUpload = 'Aadhar file must be PDF below 3 MB';

  // PAN
  if (isEmpty(data.panNumber)) errs.panNumber = 'PAN number is required';
  else if (!isPAN(data.panNumber)) errs.panNumber = 'Invalid PAN format (ABCDE1234F)';

  if (!data.panUpload) errs.panUpload = 'PAN upload is required';
  else if (!isValidPDF(data.panUpload)) errs.panUpload = 'PAN file must be PDF below 3 MB';

  if (data.isMarried && data.marriageCertificate && !(data.marriageCertificate instanceof File))
    errs.marriageCertificate = 'Invalid marriage certificate file';

  return errs;
};

// ==============================
// EDUCATION DETAILS VALIDATION
// ==============================
export const simpleValidateEducation = (data) => {
  const errs = {};

  // --- 10th ---
  if (!data.schoolName10) errs.schoolName10 = 'School name required';
  const year10 = Number(data.year10);
  if (!year10) errs.year10 = '10th passing year required';
  if (!data.cgpa10 || data.cgpa10.trim() === '') errs.cgpa10 = 'CGPA required';

  if (!data.certificate10) errs.certificate10 = '10th certificate is required';
  else if (!isValidPDF(data.certificate10))
    errs.certificate10 = '10th certificate must be PDF below 3 MB';

  // --- Inter/Diploma ---
  if (!data.interOrDiploma) errs.interOrDiploma = 'Select Intermediate or Diploma';
  if (!data.collegeName12) errs.collegeName12 = 'College name required';
  const year12 = Number(data.year12);
  if (!year12) errs.year12 = 'Year of passing required';
  if (!data.cgpa12 || data.cgpa12.trim() === '') errs.cgpa12 = 'CGPA required';

  if (!data.certificate12) errs.certificate12 = 'Intermediate/Diploma certificate required';
  else if (!isValidPDF(data.certificate12))
    errs.certificate12 = 'Intermediate/Diploma certificate must be PDF below 3 MB';

  // --- UG (Degree / B.Tech) ---
  if (!data.collegeNameUG) errs.collegeNameUG = 'College name required';
  const yearUG = Number(data.yearUG);
  if (!yearUG) errs.yearUG = 'Year of passing required';
  if (!data.cgpaUG || data.cgpaUG.trim() === '') errs.cgpaUG = 'CGPA required';

  if (!data.certificateUG) errs.certificateUG = 'Degree certificate is required';
  else if (!isValidPDF(data.certificateUG))
    errs.certificateUG = 'Degree certificate must be PDF below 3 MB';

  // --- ISM Tech (Optional but if selected, all required) ---
  // --- M.Tech / ISM Tech (checkbox-based) ---
if (data.hasMTech) {
  if (!data.collegeNameMTech) errs.collegeNameMTech = 'College name is required';
  if (!data.yearMTech) errs.yearMTech = 'Year of passing required';
  if (!data.cgpaMTech) errs.cgpaMTech = 'CGPA / Percentage is required';
  if (!data.certificateMTech) errs.certificateMTech = 'Certificate is required';
  else if (!(data.certificateMTech instanceof File)) errs.certificateMTech = 'Invalid certificate file';
}


  // --- Gap Validation ---
  if (year10 && year12 && data.interOrDiploma) {
    const diff = year12 - year10;
    const expected = data.interOrDiploma === 'Intermediate' ? 2 : 3;

    if (diff !== expected && (!data.gapReason12 || data.gapReason12.trim() === '')) {
      errs.gapReason12 = `Expected ${expected} year gap between 10th and ${data.interOrDiploma}. Please specify reason.`;
    }
  }

  if (year12 && data.interOrDiploma && yearUG) {
    const diff = yearUG - year12;
    const expectedUGGap = data.interOrDiploma === 'Intermediate' ? 4 : 3;

    if (diff !== expectedUGGap && (!data.gapReasonUG || data.gapReasonUG.trim() === '')) {
      errs.gapReasonUG = `Expected ${expectedUGGap} year gap between ${data.interOrDiploma} and Degree. Please specify reason.`;
    }
  }

  return errs;
};

// ==============================
// PROFESSIONAL DETAILS VALIDATION
// ==============================
export const simpleValidateProfessional = (data) => {
  const errs = {};

  // --- Basic employee details ---
  if (!data.employeeId || data.employeeId.trim() === '')
    errs.employeeId = 'Employee ID is required';
  if (!data.dateOfJoining)
    errs.dateOfJoining = 'Date of joining is required';
  if (!data.role || data.role.trim() === '')
    errs.role = 'Role is required';
  if (!data.department || data.department.trim() === '')
    errs.department = 'Department is required';
  if (!data.salary || data.salary.trim() === '')
    errs.salary = 'Salary is required';

  // ✅ Only validate experience if user marked "hasExperience"
  if (data.hasExperience) {
    if (!Array.isArray(data.experiences) || data.experiences.length === 0) {
      errs.experiences = 'Please add at least one experience entry';
    } else {
      data.experiences.forEach((exp, i) => {
        const idx = `_${i}`;

        if (!exp.companyName?.trim())
          errs[`companyName${idx}`] = 'Company name is required';
        if (!exp.companyLocation?.trim())
          errs[`companyLocation${idx}`] = 'Company location is required';
        if (!exp.jobTitle?.trim())
          errs[`jobTitle${idx}`] = 'Job title is required';
        if (!exp.startDate)
          errs[`startDate${idx}`] = 'Start date is required';
        if (!exp.endDate)
          errs[`endDate${idx}`] = 'End date is required';

        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate);
          const end = new Date(exp.endDate);
          if (isNaN(start) || isNaN(end) || end <= start) {
            errs[`dateOrder${idx}`] = 'End date must be after start date';
          }
        }

        if (!exp.roles?.trim())
          errs[`roles${idx}`] = 'Roles and responsibilities are required';
        if (!exp.projects?.trim())
          errs[`projects${idx}`] = 'Projects are required';
        if (!exp.skills?.trim())
          errs[`skills${idx}`] = 'Skills are required';
        if (!exp.salary?.trim())
          errs[`salary${idx}`] = 'Salary is required';

        if (!exp.relivingLetter)
          errs[`relivingLetter${idx}`] = 'Reliving letter is required';
        else if (!isValidPDF(exp.relivingLetter))
          errs[`relivingLetter${idx}`] = 'Reliving letter must be a PDF under 3 MB';

        if (!exp.salarySlips)
          errs[`salarySlips${idx}`] = 'Salary slips are required';
        else if (!isValidPDF(exp.salarySlips))
          errs[`salarySlips${idx}`] = 'Salary slips must be a PDF under 3 MB';

        if (!exp.hrName?.trim())
          errs[`hrName${idx}`] = 'HR name is required';
        if (!exp.hrEmail?.trim())
          errs[`hrEmail${idx}`] = 'HR email is required';
        else if (!isValidEmail(exp.hrEmail))
          errs[`hrEmail${idx}`] = 'Enter a valid HR email';

        if (!exp.hrPhone?.trim())
          errs[`hrPhone${idx}`] = 'HR phone is required';
        else if (!isPhone(exp.hrPhone))
          errs[`hrPhone${idx}`] = 'Enter valid 10-digit HR phone';

        if (!exp.managerName?.trim())
          errs[`managerName${idx}`] = 'Manager name is required';
        if (!exp.managerEmail?.trim())
          errs[`managerEmail${idx}`] = 'Manager email is required';
        else if (!isValidEmail(exp.managerEmail))
          errs[`managerEmail${idx}`] = 'Enter a valid manager email';

        if (!exp.managerPhone?.trim())
          errs[`managerPhone${idx}`] = 'Manager phone is required';
        else if (!isPhone(exp.managerPhone))
          errs[`managerPhone${idx}`] = 'Enter valid 10-digit manager phone';
      });
    }
  }

  return errs;
};



// ==============================
// COMBINED VALIDATION
// ==============================
export function validateAll(personal, education, professional) {
  return {
    ...simpleValidatePersonal(personal),
    ...simpleValidateEducation(education),
    ...simpleValidateProfessional(professional),
  };
}
