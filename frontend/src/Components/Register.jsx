import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";
import logo from "../assets/logo.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Employee");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Validation function
  const validate = (name, value) => {
    let message = "";

    switch (name) {
      case "email":
        if (
          !/^[a-zA-Z0-9._%+-]+@(dhatvibs\.com)$/.test(
            value
          )
        ) {
          message =
            "Please enter a valid email address";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  // ✅ Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach((key) => validate(key, formData[key]));
    const hasErrors = Object.values(errors).some((msg) => msg);
    if (hasErrors) {
      alert("Please fix the highlighted errors before submitting.");
      return;
    }

    try {
      const payload = {
        role: role,
        fullName: formData.fullname,
        email: formData.email,
      };

      const response = await fetch("https://internal-website-rho.vercel.app/api/employees/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("📦 API Response:", result);

      if (response.ok) {
        alert("Registration successful!");
        navigate("/employees");
      } else {
        alert(`Server Error: ${result.msg || "Unable to register user."}`);
      }
    } catch (error) {
      console.error("🚨 API error:", error);
      alert("Server not reachable. Please try again later.");
    }
  };

  return (
    <div className="registerpage-emp-register-container">
      <div className="registerpage-emp-register-form">
        <div className="registerpage-header">
          <div className="registerpage-back-button">
            <button onClick={() => navigate("/admin/employees")} >
              ←
            </button>
          </div>
          <h2>Register</h2>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">

          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
            {/* <option value="HR">HR</option>
            <option value="Manager">Manager</option> */}
          </select>

          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Id"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="registerpage-emp-error">{errors.email}</p>}
          <button className="registerpage-submit-reg" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
