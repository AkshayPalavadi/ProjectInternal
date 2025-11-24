import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";
import logo from "../assets/dhatvi.jpg";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- VALIDATION ----------------
  const validate = (name, value) => {
    let message = "";

    switch (name) {
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
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
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&]).{8,}$/.test(value)
        ) {
          message =
            "Password must include uppercase, lowercase, number & special character";
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

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "firstname" || name === "lastname") && !/^[A-Za-z]*$/.test(value)) {
      return;
    }

    const formattedValue =
      name === "firstname" || name === "lastname"
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    validate(name, formattedValue);
  };

  // ---------------- API CALL ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check errors
    Object.keys(formData).forEach((key) => validate(key, formData[key]));
    const hasErrors = Object.values(errors).some((msg) => msg);
    if (hasErrors) {
      alert("Please fix the highlighted errors.");
      return;
    }

    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      dob: formData.dob,
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone}`,
      password: formData.password,
    };

    try {
      setLoading(true);

      const response = await fetch(
        "https://public-website-drab-ten.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registration Successful!");
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <img src={logo} alt="DhaTvi Logo" className="logo" />
        <h1>
          Welcome to <span className="highlight">DhaTvi</span>
        </h1>
        <p className="content">
          Build a strong professional network with a seamless experience.
        </p>
      </div>

      <div className="register-form">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email (Gmail only)"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <div className="phone-group">
            <select
              className="countrycode"
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
              className="phonenumber"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          {errors.phone && <p className="error">{errors.phone}</p>}

          <div className="password-group">
            <input
              className="password-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <div className="password-group">
            <input
              className="password-input"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <button className="submit-reg" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Submit"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
