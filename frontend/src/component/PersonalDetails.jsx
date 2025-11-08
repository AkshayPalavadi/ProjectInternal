import React, { useState } from "react";
import { simpleValidatePersonal } from "./validation";
import "./indexApp.css";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other",
];

const PersonalDetails = ({
  data,
  setData,
  setActive,
  errors,
  nextStep,
  setErrors,
}) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const isPhone = (s) => /^[6-9]\d{9}$/.test(String(s).trim());
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
  if (name === "alternativePhone") {
    // Only update if valid number or empty (so user can delete)
    if (value === "" || /^[6-9]\d{0,9}$/.test(value)) {
      setData({ ...data, [name]: value });
    }
  } else {
    setData({ ...data, [name]: value });}
  

    // Fields that should only accept letters and spaces
    const nameFields1 = [
      "firstName",
      "lastName",
      "fatherName",
      "motherName",
      "nominee1",
      "nominee2",
      "middleName",
      "village",
    ];

    if (nameFields1.includes(name)) {
      // Allow only letters and spaces — filter out numbers and symbols
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
      setData((prev) => ({ ...prev, [name]: lettersOnly }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear errors for name fields
    if (nameFields1.includes(name)) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // Checkbox for same address
    if (type === "checkbox" && name === "sameAddress") {
      setData((prev) => ({
        ...prev,
        sameAddress: checked,
        permanentAddress: checked ? prev.currentAddress : "",
      }));
      setErrors((prev) => ({ ...prev, permanentAddress: "" }));
      return;
    }

    // Checkbox for marriage
    if (type === "checkbox" && name === "isMarried") {
      setData((prev) => ({
        ...prev,
        isMarried: checked,
        marriageCertificate: checked ? prev.marriageCertificate : null,
      }));
      return;
    }

    // File uploads
    if (type === "file") {
      const file = files[0];
      setData((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: "" }));

      if (name === "photo") setPhotoPreview(URL.createObjectURL(file));

      return;
    }

    // Regular text/select input
    setData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "currentAddress" && prev.sameAddress
        ? { permanentAddress: value }
        : {}),
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const next = () => {
    const errs = simpleValidatePersonal(data);

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="form-wrap">
      <h3>Personal Details</h3>

      <div className="form-grid">
        {/* Existing fields */}
        {/* ---- Basic Info ---- */}
        <div className="field">
          <label>
            First Name <span className="required-star">*</span>
          </label>
          <input
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <small className="err">{errors.firstName}</small>
          )}
        </div>

        <div className="field">
          <label>Middle Name</label>
          <input
            name="middleName"
            value={data.middleName}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>
            Last Name <span className="required-star">*</span>
          </label>
          <input
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <small className="err">{errors.lastName}</small>}
        </div>

        {/* ---- New Fields ---- */}
        <div className="field">
          <label>
            Father’s Name <span className="required-star">*</span>
          </label>
          <input
            name="fatherName"
            value={data.fatherName || ""}
            onChange={handleChange}
          />
          {errors.fatherName && (
            <small className="err">{errors.fatherName}</small>
          )}
        </div>

        <div className="field">
          <label>
            Mother’s Name <span className="required-star">*</span>
          </label>
          <input
            name="motherName"
            value={data.motherName || ""}
            onChange={handleChange}
          />
          {errors.motherName && (
            <small className="err">{errors.motherName}</small>
          )}
        </div>
        <div className="field">
          <label>
            Email <span className="required-star">*</span>
          </label>
          <input name="email" value={data.email} onChange={handleChange} />
          {errors.email && <small className="err">{errors.email}</small>}
        </div>

        <div className="field">
          <label>
            Phone <span className="required-star">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 10
              if (/^\d{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, phone: value }));
                setErrors((prev) => ({ ...prev, phone: "" }));
              }
            }}
            placeholder="Enter 10-digit number"
          />
          {errors.phone && <small className="err">{errors.phone}</small>}
        </div>

        <div className="field">
          <label>Alternative Phone</label>
          <input
            type="tel"
            name="alternativePhone"
            value={data.alternativePhone}
onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 10
              if (/^\d{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, alternativePhone: value }));
                setErrors((prev) => ({ ...prev, alternativePhone: "" }));
              }
            }}            placeholder="Enter alternate number"
          />
        </div>

        {/* ---- Gender and Blood Group ---- */}
        <div className="field">
          <label>
            Gender <span className="required-star">*</span>
          </label>
          <select
            name="gender"
            value={data.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <small className="err">{errors.gender}</small>}
        </div>

        <div className="field">
          <label>
            Blood Group <span className="required-star">*</span>
          </label>
          <select
            name="bloodGroup"
            value={data.bloodGroup || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          {errors.bloodGroup && (
            <small className="err">{errors.bloodGroup}</small>
          )}
        </div>

        {/* ---- Photo Upload ---- */}
        <div className="field full">
          <label>
            Upload Photo <span className="required-star">*</span>
          </label>
          <input
            type="file"
            name="photo"
            accept="image/jpeg, image/png"
            alt="Image"
            onChange={handleChange}
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              style={{
                marginTop: "8px",
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}
          {errors.photo && <small className="err">{errors.photo}</small>}
        </div>

        {/* ---- Address Fields ---- */}
        <div className="field full">
          <label>
            Current Address <span className="required-star">*</span>
          </label>
          <textarea
            name="currentAddress"
            value={data.currentAddress || ""}
            onChange={handleChange}
          />
          {errors.currentAddress && (
            <small className="err">{errors.currentAddress}</small>
          )}
        </div>

        <div className="field full checkbox-field">
          <label>
            <input
              type="checkbox"
              name="sameAddress"
              checked={data.sameAddress || false}
              onChange={handleChange}
            />{" "}
            Same as Current Address
          </label>
        </div>

        <div className="field full">
          <label>
            Permanent Address <span className="required-star">*</span>
          </label>
          <textarea
            name="permanentAddress"
            value={data.permanentAddress || ""}
            onChange={handleChange}
            disabled={data.sameAddress}
          />
          {errors.permanentAddress && (
            <small className="err">{errors.permanentAddress}</small>
          )}
        </div>

        {/* ---- Additional Address Info ---- */}
        <div className="field">
          <label>
            Landmark <span className="required-star">*</span>
          </label>
          <input
            name="landmark"
            value={data.landmark || ""}
            onChange={handleChange}
          />
          <small className="err">{errors.landmark}</small>
        </div>

        <div className="field">
          <label>
            Pincode <span className="required-star">*</span>
          </label>
          <input
            type="text"
            name="pincode"
            value={data.pincode}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 6
              if (/^\d{0,6}$/.test(value)) {
                setData((prev) => ({ ...prev, pincode: value }));
                setErrors((prev) => ({ ...prev, pincode: "" }));
              }
            }}
            placeholder="Enter 6-digit pincode"
          />

          {errors.pincode && <small className="err">{errors.pincode}</small>}
        </div>

        <div className="field">
          <label>Village</label>
          <input
            name="village"
            value={data.village || ""}
            onChange={handleChange}
          />
                    {errors.village && <small className="err">{errors.village}</small>}

        </div>

        <div className="field">
          <label>
            State <span className="required-star">*</span>
          </label>
          <select name="state" value={data.state || ""} onChange={handleChange}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && <small className="err">{errors.state}</small>}
        </div>

        <div className="field">
          <label>
            Emergency Contact Number <span className="required-star">*</span>
          </label>
          <input
            type="tel"
            name="emergencyNumber"
            value={data.emergencyNumber || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, emergencyNumber: value }));
                setErrors((prev) => ({ ...prev, emergencyNumber: "" }));
              }
            }}
            placeholder="Enter 10-digit number"
          />
          {errors.emergencyNumber && (
            <small className="err">{errors.emergencyNumber}</small>
          )}
        </div>

        <div className="field">
          <label>
            Nominee 1 <span className="required-star">*</span>
          </label>
          <input
            name="nominee1"
            value={data.nominee1 || ""}
            onChange={handleChange}
          />
          {errors.nominee1 && <small className="err">{errors.nominee1}</small>}
        </div>

        <div className="field">
          <label>
            Nominee 2 <span className="required-star">*</span>
          </label>
          <input
            name="nominee2"
            value={data.nominee2 || ""}
            onChange={handleChange}
          />
          {errors.nominee2 && <small className="err">{errors.nominee2}</small>}
        </div>

        <div className="field">
          <label>
            Aadhar Number <span className="required-star">*</span>
          </label>
          <input
            name="aadharNumber"
            value={data.aadharNumber || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,12}$/.test(value)) {
                setData((prev) => ({ ...prev, aadharNumber: value }));
                setErrors((prev) => ({ ...prev, aadharNumber: "" }));
              }
            }}
            placeholder="12-digit Aadhar number"
          />
          {errors.aadharNumber && (
            <small className="err">{errors.aadharNumber}</small>
          )}
        </div>

        <div className="field">
          <label>
            Upload Aadhar Card <span className="required-star">*</span>
          </label>
          <input
            type="file"
            name="aadharUpload"
            accept="image/*,.pdf"
            onChange={handleChange}
          />
          {errors.aadharUpload && (
            <small className="err">{errors.aadharUpload}</small>
          )}
        </div>

        <div className="field">
          <label>
            PAN Number <span className="required-star">*</span>
          </label>
          <input
            name="panNumber"
            value={data.panNumber || ""}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (/^[A-Z0-9]{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, panNumber: value }));
                setErrors((prev) => ({ ...prev, panNumber: "" }));
              }
            }}
            placeholder="ABCDE1234F"
          />
          {errors.panNumber && (
            <small className="err">{errors.panNumber}</small>
          )}
        </div>

        <div className="field">
          <label>
            Upload PAN Card <span className="required-star">*</span>
          </label>
          <input
            type="file"
            name="panUpload"
            accept="image/*,.pdf"
            onChange={handleChange}
          />
          {errors.panUpload && (
            <small className="err">{errors.panUpload}</small>
          )}
        </div>

        <div className="field full checkbox-field">
          <label>
            <input
              type="checkbox"
              name="isMarried"
              checked={data.isMarried || false}
              onChange={handleChange}
            />{" "}
            Married?
          </label>
        </div>

        {data.isMarried && (
          <div className="field full">
            <label>Marriage Certificate (optional)</label>
            <input
              type="file"
              name="marriageCertificate"
              accept="image/*,.pdf"
              onChange={handleChange}
            />
            {errors.marriageCertificate && (
              <small className="err">{errors.marriageCertificate}</small>
            )}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn primary" onClick={next}>
          Next: Education
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
