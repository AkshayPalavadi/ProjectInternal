import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";
import logo from "../assets/logo.jpg";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    email: "",
    countryCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation function
  const validate = (name, value) => {
    let message = "";

    switch (name) {
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@dhatvibs\.com$/.test(value)) {
          message = "Please enter a valid Gmail address";
        }
        break;

      case "phone":
        if (!/^\d{10}$/.test(value)) {
          message = "Phone number must be 10 digits";
        }
        break;

      case "password":
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/.test(value)
        ) {
          message =
            "Password must include 1 uppercase, 1 lowercase, 1 number, and 1 special character (min 12 chars)";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          message = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Run full validation before submit
    Object.keys(formData).forEach((key) => validate(key, formData[key]));
    const hasErrors = Object.values(errors).some((msg) => msg);
    if (hasErrors) {
      alert("Please fix the highlighted errors before submitting.");
      return;
    }

    // Save user data to localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = {
      id: Date.now(),
      role: "employee",
      name: `${formData.firstname} ${formData.lastname}`,
      email: formData.email,
      password: formData.password,
      designation: "New Joiner",
      experience: "0 years",
      department: "",
      project: "",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Redirecting to Login...");
    navigate("/login");
  };

  return (
    <div className="emp-register-container">
      <div className="emp-register-left">
        <img src={logo} alt="DhaTvi Logo" className="emp-logo" />
        <h1>
          Welcome to <span className="emp-highlight">DhaTvi</span>
        </h1>
        <p className="emp-content">
          Build your professional journey with us! Create your account to get
          started.
        </p>
      </div>

      <div className="emp-register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Hidden dummy fields to block browser autofill */}
          <input type="text" name="fakeuser" style={{ display: "none" }} autoComplete="off" />
          <input type="password" name="fakepass" style={{ display: "none" }} autoComplete="new-password" />

          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <p>Date of Birth:</p>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            autoComplete="off"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Id"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.email && <p className="emp-error">{errors.email}</p>}

          <div className="emp-phone-group">
            <select
              className="emp-countrycode"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            >
              <option value="+91">+91 (IN)</option>
              <option value="+1">+1 (US)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (AU)</option>
              <option value="+81">+81 (JP)</option>
            </select>

            <input
              className="emp-phonenumber"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          {errors.phone && <p className="emp-error">{errors.phone}</p>}

          <div className="emp-password-group">
            <input
              className="emp-password-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <span
              className="emp-eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="emp-error">{errors.password}</p>}

          <div className="emp-password-group">
            <input
              className="emp-password-input"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <span
              className="emp-eye-icon"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="emp-error">{errors.confirmPassword}</p>
          )}

          <button className="submit-reg" type="submit">
            Submit
          </button>
        </form>

        <p className="emp-login-text">
          Already have an account?{" "}
          <span
            className="emp-login-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
