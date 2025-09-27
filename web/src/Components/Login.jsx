import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Login.css';
import logo from '../assets/logo.jpg';

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // default
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminEmail = "admin@dhatvibs.com";
    const employeeEmail = "employee@dhatvibs.com";
    const correctPassword = "password123";

    if (!email.endsWith("@dhatvibs.com")) {
      setError("Only @dhatvibs.com email addresses are allowed.");
      return;
    }

    if (role === "admin" && email === adminEmail && password === correctPassword) {
  setIsLoggedIn(true);
  setUserRole("admin");
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", "admin");
  navigate("/admin");
  return;
}

if (role === "employee" && email === employeeEmail && password === correctPassword) {
  setIsLoggedIn(true);
  setUserRole("employee");
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", "employee");
  navigate("/employee/home"); 
  return;
}


    setError("Invalid email, password, or role selection");
  };

  return (
    <div className="login-main-container">
      <div className="header">
        <img src={logo} alt="logo" />
        <div className="h">
          <h1>DhaTvi Business Solutions Pvt.LTD</h1>
          <p><i>Driving Technology Delivering Trust</i></p>
        </div>
      </div>
      <hr />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="heading">Login</h1>

          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <label>Email Id :</label>
          <input
            type="email"
            placeholder="Mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password :</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
