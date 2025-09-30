import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    personalEmail: "",
    phoneNumber: "",
    bloodGroup: "",
    address: "",
    aadharNumber: "",
    panNumber: "",
    education: {
      "10th": { year: "", marks: "", certificate: null },
      "12th": { year: "", marks: "", certificate: null },
      "Degree/B.Tech": { year: "", marks: "", certificate: null },
    },
    fullName: "",
    officialEmail: "",
    doj: "",
    role: "",
    department: "",
    employeeId: "",
    officePhone: "",
    experiences: [],
    
  });

  const [passportPhoto, setPassportPhoto] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, type, level = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "passport") {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({ ...prev, passportPhoto: "Only JPG, JPEG, PNG allowed" }));
        return;
      } else setErrors((prev) => ({ ...prev, passportPhoto: null }));
      setPassportPhoto(file);
    } else if (type === "aadhar") {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, aadharFile: "Only PDF allowed" }));
        return;
      } else setErrors((prev) => ({ ...prev, aadharFile: null }));
      setAadharFile(file);
    } else if (type === "pan") {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, panFile: "Only PDF allowed" }));
        return;
      } else setErrors((prev) => ({ ...prev, panFile: null }));
      setPanFile(file);
    } else if (type === "certificate") {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, [`${level}-certificate`]: "Only PDF allowed" }));
        return;
      } else setErrors((prev) => ({ ...prev, [`${level}-certificate`]: null }));
      setFormData((prev) => ({
        ...prev,
        education: {
          ...prev.education,
          [level]: { ...prev.education[level], certificate: file },
        },
      }));
    }
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: "", role: "", startDate: "", endDate: "", days: 0, reason: "" },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index][field] = value;

    if (field === "startDate" || field === "endDate") {
      const start = new Date(newExperiences[index].startDate);
      const end = new Date(newExperiences[index].endDate);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        newExperiences[index].days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      } else {
        newExperiences[index].days = 0;
      }
    }

    setFormData((prev) => ({ ...prev, experiences: newExperiences }));
  };

  const handleEducationChange = (level, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: { ...prev.education[level], [field]: value },
      },
    }));
  };

  const loadFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  let newErrors = {};

  const phoneRegex = /^\d{10}$/;
  const aadharRegex = /^\d{12}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits";
  if (!aadharRegex.test(formData.aadharNumber)) newErrors.aadharNumber = "Aadhar number must be 12 digits";
  if (!panRegex.test(formData.panNumber)) newErrors.panNumber = "PAN must match Indian format";

  if (!passportPhoto) newErrors.passportPhoto = "Passport photo is required";
  if (!aadharFile) newErrors.aadharFile = "Aadhar PDF is required";
  if (!panFile) newErrors.panFile = "PAN PDF is required";

  Object.entries(formData.education).forEach(([level, edu]) => {
    if (!edu.year) newErrors[`${level}-year`] = `${level} Year is required`;
    if (!edu.marks) newErrors[`${level}-marks`] = `${level} Marks/CGPA is required`;
    if (!edu.certificate) newErrors[`${level}-certificate`] = `${level} certificate is required`;
  });

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  const doc = new jsPDF();

  // Title
  doc.setFontSize(24);
  doc.text("Employee Profile", 105, 15, { align: "center" });

  // Passport Photo
  if (passportPhoto) {
    const imgData = await loadFileAsDataURL(passportPhoto);
    if (imgData) {
      doc.addImage(imgData, "JPEG", 160, 20, 40, 40);
    }
  }

  // ✅ Personal Information Table
  autoTable(doc, {
    startY: 70,
    head: [["Personal Information", "Details"]],
    body: [
      ["First Name", formData.firstName],
      ["Middle Name", formData.middleName],
      ["Last Name", formData.lastName],
      ["Personal Email", formData.personalEmail],
      ["Phone Number", formData.phoneNumber],
      ["Blood Group", formData.bloodGroup],
      ["Address", formData.address],
      ["Aadhar Number", formData.aadharNumber],
      ["PAN Number", formData.panNumber],
    ],
    theme: "grid",
    headStyles: { fillColor: [39, 174, 96] },
  });

  // ✅ Professional Information Table
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Professional Information", "Details"]],
    body: [
      ["Full Name", formData.fullName],
      ["Official Email", formData.officialEmail],
      ["Date of Joining", formData.doj],
      ["Role", formData.role],
      ["Department", formData.department],
      ["Employee ID", formData.employeeId],
      ["Office Phone", formData.officePhone],
    ],
    theme: "grid",
    headStyles: { fillColor: [39, 174, 96] },
  });

  // ✅ Experiences Table
  if (formData.experiences.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Company", "Role", "Start Date", "End Date", "Days", "Reason"]],
      body: formData.experiences.map((exp) => [
        exp.company,
        exp.role,
        exp.startDate,
        exp.endDate,
        exp.days,
        exp.reason,
      ]),
      theme: "grid",
      headStyles: { fillColor: [39, 174, 96] },
    });
  }

  // ✅ Education Table
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Education Details", "Year", "Marks/CGPA"]],
    body: Object.entries(formData.education).map(([level, edu]) => [
      level,
      edu.year,
      edu.marks,
      // edu.certificate ? edu.certificate.name : "Not Uploaded",
    ]),
    theme: "grid",
    headStyles: { fillColor: [39, 174, 96] },
  });

  // ✅ Documents Table
  // autoTable(doc, {
  //   startY: doc.lastAutoTable.finalY + 10,
  //   head: [["Document", "File"]],
  //   body: [
  //     ["Aadhar", aadharFile?.name || "Not Uploaded"],
  //     ["PAN", panFile?.name || "Not Uploaded"],
  //   ],
  //   theme: "grid",
  //   headStyles: { fillColor: [39, 174, 96] },
  // });

  // ✅ Terms & Conditions
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Terms & Conditions"]],
    body: [
      [
        "By submitting this form, you confirm that all information provided is true and correct. Any false information may result in disciplinary action or termination."
      ],
      [
        "The company reserves the right to verify your documents and use the provided data strictly for official purposes only."
      ],
      [
        "Your personal data will be securely stored and not shared with third parties except when legally required."
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [127, 140, 141] },
  });

  doc.save(`${formData.firstName}_${formData.lastName}_Profile.pdf`);
};


  return (
    <div className="container">
      <h1>Employee Details Form</h1>
      <form className="form" onSubmit={handleSubmit}>

        {/* Personal Info */}
        <h2>Personal Information</h2>
        <div className="row">
          <label>First Name:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </label>
          <label>Middle Name:
            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
          </label>
          <label>Last Name:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </label>
        </div>

        <label>Personal Email:
          <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} required />
          {errors.personalEmail && <span className="error">{errors.personalEmail}</span>}
        </label>

        <label>Phone Number:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} pattern="[0-9]{10}" onChange={handleChange} required />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </label>

        <label>Blood Group:
          <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />
          {errors.bloodGroup && <span className="error">{errors.bloodGroup}</span>}
        </label>

        <label>Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </label>

        <div className="row">
          <label>Aadhar Number:
            <input type="text" name="aadharNumber" value={formData.aadharNumber} pattern="[0-9]{12}" onChange={handleChange} required />
            {errors.aadharNumber && <span className="error">{errors.aadharNumber}</span>}
          </label>
          <label>Upload Aadhar:
            <input type="file" onChange={(e) => handleFileChange(e, "aadhar")} required />
            {errors.aadharFile && <span className="error">{errors.aadharFile}</span>}
          </label>
        </div>

        <div className="row">
          <label>PAN Number:
            <input type="text" name="panNumber" value={formData.panNumber} pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" onChange={handleChange} required />
            {errors.panNumber && <span className="error">{errors.panNumber}</span>}
          </label>
          <label>Upload PAN:
            <input type="file" onChange={(e) => handleFileChange(e, "pan")} required />
            {errors.panFile && <span className="error">{errors.panFile}</span>}
          </label>
        </div>

        <label>Passport Photo:
          <input type="file" onChange={(e) => handleFileChange(e, "passport")} />
          {errors.passportPhoto && <span className="error">{errors.passportPhoto}</span>}
        </label>

        {/* Education Section */}
        <h2>Education</h2>
        {["10th", "12th", "Degree/B.Tech"].map((level) => (
          <div key={level} className="row">
            <label>{level} Year:
              <input type="text" value={formData.education[level].year} onChange={(e) => handleEducationChange(level, "year", e.target.value)} required />
              {errors[`${level}-year`] && <span className="error">{errors[`${level}-year`]}</span>}
            </label>
            <label>{level} Marks/CGPA:
              <input type="text" value={formData.education[level].marks} onChange={(e) => handleEducationChange(level, "marks", e.target.value)} required />
              {errors[`${level}-marks`] && <span className="error">{errors[`${level}-marks`]}</span>}
            </label>
            <label>Upload {level} Certificate:
              <input type="file" onChange={(e) => handleFileChange(e, "certificate", level)} required />
              {errors[`${level}-certificate`] && <span className="error">{errors[`${level}-certificate`]}</span>}
            </label>
          </div>
        ))}

        {/* Previous Experience */}
        <h2>Previous Experience</h2>
        {formData.experiences.map((exp, index) => (
          <div key={index} className="experience-block">
            <div className="row">
              <label>Company Name:
                <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(index, "company", e.target.value)} required />
              </label>
              <label>Role:
                <input type="text" value={exp.role} onChange={(e) => handleExperienceChange(index, "role", e.target.value)} required />
              </label>
              <label>Start Date:
                <input type="date" value={exp.startDate} onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)} required />
              </label>
              <label>End Date:
                <input type="date" value={exp.endDate} onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)} required />
              </label>
              <label>Days Worked:
                <input type="number" value={exp.days} readOnly />
              </label>
              <label>Reason for Leaving:
                <input type="text" value={exp.reason} onChange={(e) => handleExperienceChange(index, "reason", e.target.value)} required />
              </label>
              <button type="button" onClick={() => removeExperience(index)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addExperience} className="addexp-btn">+ Add Experience</button>

        {/* Professional Info */}
        <h2>Professional Information</h2>
        <label>Full Name:
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </label>
        <label>Official Email:
          <input type="email" name="officialEmail" value={formData.officialEmail} onChange={handleChange} required />
          {errors.officialEmail && <span className="error">{errors.officialEmail}</span>}
        </label>
        <label>Date of Joining:
          <input type="date" name="doj" value={formData.doj} onChange={handleChange} />
        </label>
        <label>Role:
          <input type="text" name="role" value={formData.role} onChange={handleChange} />
        </label>
        <label>Department:
          <input type="text" name="department" value={formData.department} onChange={handleChange} />
        </label>
        <label>Employee ID:
          <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
          {errors.employeeId && <span className="error">{errors.employeeId}</span>}
        </label>
        <label>Office Phone:
          <input type="text" name="officePhone" value={formData.officePhone} pattern="[0-9]{10}" onChange={handleChange} required maxLength={10} />
          {errors.officePhone && <span className="error">{errors.officePhone}</span>}
        </label>

        {/* Terms & Conditions */}
<div className="terms">
  <h3>Terms & Conditions</h3>
  <div className="terms-box">
    <p>By submitting this form, you confirm that all information provided is true and correct. Any false information may result in disciplinary action or termination.</p>
    <p>The company reserves the right to verify your documents and use the provided data strictly for official purposes only.</p>
    <p>Your personal data will be securely stored and not shared with third parties except when legally required.</p>
  </div>
</div>

<div className="terms-checkbox">
  <input type="checkbox" id="terms" name="terms" required />
  <label htmlFor="terms">I agree to the Terms & Conditions</label>
</div>


        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Profile;
