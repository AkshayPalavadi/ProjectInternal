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

  // ✅ List of users
  const users = [
    { id: 1, role: "admin", email: "admin@dhatvibs.com", password: "password123" },
    { id: 2, role: "employee", email: "akshay@dhatvibs.com", password: "password123" },
    { id: 3, role: "employee", email: "sathvika@dhatvibs.com", password: "password123" },
    { id: 4, role: "employee", email: "sravani@dhatvibs.com", password: "password123" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.endsWith("@dhatvibs.com")) {
      setError("Only @dhatvibs.com email addresses are allowed.");
      return;
    }

    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
      setIsLoggedIn(true);
      setUserRole(role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);
      if (role === "employee") localStorage.setItem("employeeId", user.id); // store employee id
      localStorage.setItem("employeeEmail", user.email);
      localStorage.setItem("empployeeRole", user.role);

      // Navigate
      navigate(role === "admin" ? "/admin" : "/employee/home");
      return;
    }

    setError("Invalid email, password, or role selection");
  };

  return (
    <div className="login-main-container">
      <div className="header">
        <img src={logo} alt="logo" />
        <div className="title">
          <h1>DhaTvi Business Solutions Pvt.LTD</h1>
          <p style={{paddingTop:"15px"}}><i>Driving Technology Delivering Trust</i></p>
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
