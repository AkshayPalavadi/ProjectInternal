import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import logo from "../assets/logo.jpg";

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const defaultUsers = [
    { id: 1, role: "admin", name: "admin", email: "admin@dhatvibs.com", password: "password123", designation: "Admin", experience: "5 years" },
    { id: 2, role: "employee", name: "Akshay", email: "akshay@dhatvibs.com", password: "password123", designation: "Frontend", experience: "3 years", department: "Development", project: "Website" },
    { id: 3, role: "employee", name: "Sathvika", email: "sathvika@dhatvibs.com", password: "password123", designation: "UI/UX", experience: "3 years", department: "Design", project: "Native" },
    { id: 4, role: "employee", name: "Sravani", email: "sravani@dhatvibs.com", password: "password123", designation: "Backend", experience: "2 years", department: "Backend", project: "Web" },
  ];

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    if (!storedUsers) {
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }

    const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
    if (rememberedUser) {
      setEmail(rememberedUser.email);
      setPassword(rememberedUser.password);
      setRememberMe(true);
    }

    const hasLoggedOut = localStorage.getItem("hasLoggedOut") === "true";
    if (rememberedUser && !hasLoggedOut) {
      const users = JSON.parse(localStorage.getItem("users")) || defaultUsers;
      const remembered = users.find(
        (u) => u.email === rememberedUser.email && u.password === rememberedUser.password
      );
      if (remembered) {
        setIsLoggedIn(true);
        setUserRole(remembered.role);
        navigate(remembered.role === "admin" ? "/admin" : "/employee/home");
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.endsWith("@dhatvibs.com")) {
      setError("Only @dhatvibs.com email addresses are allowed.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || defaultUsers;
    const user = users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (user) {
      localStorage.removeItem("hasLoggedOut");

      setIsLoggedIn(true);
      setUserRole(role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);
      localStorage.setItem("employeeEmail", user.email);
      localStorage.setItem("employeeName", user.name);
      localStorage.setItem("employeeRole", user.role);
      localStorage.setItem("employeeId", user.id);

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem("rememberedUser");
      }

      navigate(role === "admin" ? "/admin" : "/employee/home");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    setError("Invalid email, password, or role selection");
  };

  return (
    <div className="login-main-container">
      <div className="headerlogin">
        <img src={logo} alt="logo" />
        <div className="title">
          <h1>DhaTvi Business Solutions Pvt. Ltd.</h1>
          <p style={{ paddingTop: "15px" }}>
            <i>Driving Technology Delivering Trust</i>
          </p>
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
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>

          <div className="reset-password-link">
            <Link to="/reset-password">Reset Password?</Link>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>

          {/* ✅ Register Section */}
          <p className="register-link-text">
            Don’t have an account?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
