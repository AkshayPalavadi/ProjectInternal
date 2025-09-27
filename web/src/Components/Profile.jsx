import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const handlePrint = (e) => {
    e.preventDefault();
    window.print();
  };

  return (
    <div className="container">
      <h1>Employee Details Form</h1>

      <form className="form">
        {/* Personal Information */}
        <h2>Personal Information</h2>
        <div className="row">
          <label>
            First Name:
            <input
              type="text"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Middle Name:
            <input
              type="text"
              placeholder="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>

        <label>
          Personal Email:
          <input type="email" placeholder="Personal Email" required />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            pattern="[0-9]{10}"
            inputMode="numeric"
            maxLength="10"
            placeholder="Phone Number"
            required
            title="Enter exactly 10 digits"
          />
        </label>
        <label>
            Blood Group: <input type="text" placeholder="Blood Group" required/>
        </label>
        <label>
          Address:
          <input type="text" placeholder="Address" />
        </label>

        <div className="row">
          <div className="input-group">
            <label>
              Aadhar Number:
              <input
                type="tel"
                pattern="[0-9]{12}"
                inputMode="numeric"
                maxLength="12"
                placeholder="Aadhar Number"
                required
                title="Enter exactly 12 digits"
              />
            </label>
          </div>
          <div className="input-group">
            <label>Upload Aadhar:</label>
            <input type="file" />
          </div>
        </div>

        <div className="row">
          <div className="input-group">
            <label>
              PAN Number:
              <input
                type="text"
                pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                placeholder="PAN Number"
                required
              />
            </label>
          </div>
          <div className="input-group">
            <label>Upload PAN:</label>
            <input type="file" />
          </div>
        </div>

        <label>
          Passport Photo:
          <input type="file" />
          <small>Photo cannot be updated from here</small>
        </label>

        {/* Education */}
        <h2>Education</h2>
        {["10th", "12th", "Degree/B.Tech"].map((level) => (
          <div key={level}>
            <p>{level}</p>
            <div className="row">
              <label>
                Year of Passing:
                <input type="text" placeholder="Year of Passing" />
              </label>
              <label>
                CGPA / Marks:
                <input type="text" placeholder="CGPA / Marks" />
              </label>
              <label>
                Upload Certificate:
                <input type="file" />
              </label>
            </div>
          </div>
        ))}

        {/* Professional Information */}
        <h2>Professional Information</h2>
        <label>
          Full Name:
          <input type="text" placeholder="Full Name" required />
        </label>
        <label>
          Official Email:
          <input
            type="email"
            placeholder="official@dhatvibs.com"
            required
            pattern="^[a-zA-Z0-9._%+-]+@dhatvibs\.com$"
            title="Email must be in the format official@dhatvibs.com"
          />
        </label>
        <label>Date of Joining: <input type="date" required /></label>
        <label>Upload Offer Letter: <input type="file" required /></label>
        <label>Role: <input type="text" placeholder="Role" /></label>
        <label>Department: <input type="text" placeholder="Department" /></label>
        <label>Employee ID: <input type="text" placeholder="Employee ID" required /></label>
        <label>Phone Number: <input type="tel" pattern="[0-9]{10}" inputMode="numeric" maxLength="10"
            placeholder="Phone Number"
            required
            title="Enter exactly 10 digits"
          />
        </label>

        <div className="button-row">
          <button type="submit">Submit</button>
          <button type="button" onClick={handlePrint}>
            Print
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
