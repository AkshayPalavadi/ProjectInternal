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

const handleSubmit = async (e) => {
  e.preventDefault();

  // Run full validation before submit
  Object.keys(formData).forEach((key) => validate(key, formData[key]));
  const hasErrors = Object.values(errors).some((msg) => msg);
  if (hasErrors) {
    alert("Please fix the highlighted errors before submitting.");
    return;
  }

  // ✅ Send data to backend API
try {
const payload = {
  firstName: formData.firstname,
  lastName: formData.lastname,
  dateOfBirth: formData.dob,
  email: formData.email,
  phoneNumber: formData.phone,
  password: formData.password,
  confirmPassword: formData.confirmPassword,
};
console.log("📤 Sending payload:", payload);

  const response = await fetch("https://internal-website-rho.vercel.app/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log("📦 API Response:", result);

  if (response.ok) {
    // alert("Registration successful! Redirecting to Login...");
    navigate("/login");
  } else {
    alert(`Server Error: ${result.msg || "Unable to register user."}`);
  }
} catch (error) {
  console.error("🚨 API error:", error);
  alert("Server not reachable. Data saved locally.");
}

};


  return (
    <div className="registerpage-emp-register-container">
      <div className="registerpage-emp-register-left">
        <img src={logo} alt="DhaTvi Logo" className="registerpage-emp-logo" />
        <h1>
          Welcome to <span className="registerpage-emp-highlight">DhaTvi</span>
        </h1>
        <p className="registerpage-emp-content">
          Build your professional journey with us! Create your account to get
          started.
        </p>
      </div>

      <div className="registerpage-emp-register-form">
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
          {errors.email && <p className="registerpage-emp-error">{errors.email}</p>}

          <div className="registerpage-emp-phone-group">
            <select
              className="registerpage-emp-countrycode"
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
              className="registerpage-emp-phonenumber"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          {errors.phone && <p className="registerpage-emp-error">{errors.phone}</p>}

          <div className="registerpage-emp-password-group">
            <input
              className="registerpage-emp-password-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <span
              className="registerpage-emp-eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="registerpage-emp-error">{errors.password}</p>}

          <div className="registerpage-emp-password-group">
            <input
              className="registerpage-emp-password-input"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <span
              className="registerpage-emp-eye-icon"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="registerpage-emp-error">{errors.confirmPassword}</p>
          )}

          <button className="registerpage-submit-reg" type="submit">
            Submit
          </button>
        </form>

        <p className="registerpage-emp-login-text">
          Already have an account?{" "}
          <span
            className="registerpage-emp-login-link"
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