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
<<<<<<< HEAD
  // ✅ Keep user logged in if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    // const storedRole = localStorage.getItem("userRole");
    const storedRole = "admin";
    if (token && storedRole) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
      navigate(storedRole === "admin" ? "/admin" : "/employee", { replace: true });
    }
  }, [navigate, setIsLoggedIn, setUserRole]);
=======
>>>>>>> eabd1ae4a6214fef38d2ac5fd97357959bfdcba9

  // ✅ List of users
  const users = [
    { id: 1, role: "admin", name: "admin", email: "admin@dhatvibs.com", password: "password123", designation: "Admin", experience: "5 years" },
    { id: 2, role: "employee", name: "Akshay", email: "akshay@dhatvibs.com", password: "password123", designation: "Frontend", experience: "3 years" },
    { id: 3, role: "employee", name: "Sathvika", email: "sathvika@dhatvibs.com", password: "password123", designation: "UI/UX", experience: "3 years" },
    { id: 4, role: "employee", name: "Sravani", email: "sravani@dhatvibs.com", password: "password123", designation: "Backend", experience: "2 years" },
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
      localStorage.setItem("employeeName", user.name);
      localStorage.setItem("employeeDesignation", user.designation);
      localStorage.setItem("employeeExperience", user.experience);

      // Navigate
      navigate(role === "admin" ? "/admin" : "/employee/home");
      return;
    }

    setError("Invalid email, password, or role selection");
  };

  return (
    <div className="login-main-container">
      <div className="headerlogin">
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

