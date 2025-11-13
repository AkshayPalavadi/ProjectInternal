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
  const navigate = useNavigate();

  // ✅ Keep user logged in if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    if (token && storedRole) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
      navigate(storedRole === "admin" ? "/admin" : "/employee", { replace: true });
    }
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.endsWith("@dhatvibs.com")) {
    setError("Only @dhatvibs.com email addresses are allowed.");
    return;
  }

  try {
    // Step 1: Login user
    const response = await fetch("https://internal-website-rho.vercel.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    console.log("📦 Login API Response:", result);

    if (response.ok && result.token) {
      // ✅ Save token
      localStorage.setItem("token", result.token);

      // Step 2: Fetch employee details
      const empResponse = await fetch("https://internal-website-rho.vercel.app/api/auth");
      const empResult = await empResponse.json();
      console.log("📦 Employees API Response:", empResult);

      const user = empResult.employees.find((emp) => emp.email === email);

      if (user) {
        // ✅ Store user details
        localStorage.setItem("employeeName", `${user.firstName} ${user.lastName}`);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("employeeId", user.employeeId);
        localStorage.setItem("userRole", user.role);
        
        setIsLoggedIn(true);
        setUserRole(user.role);

        // ✅ Navigate based on actual role
        navigate(user.role === "admin" ? "/admin" : "/employee");
      } else {
        setError("User data not found.");
      }
    } else {
      setError(result.msg || "Invalid email or password");
    }
  } catch (err) {
    console.error("🚨 Error:", err);
    setError("Server not reachable. Please try again later.");
  }
};

  return (
    <div className="loginpage-login-main-container">
      <div className="loginpage-headerlogin">
        <img src={logo} alt="logo" />
        <div className="loginpage-title">
          <h1>DhaTvi Business Solutions Pvt. Ltd.</h1>
          <p style={{ paddingTop: "15px" }}>
            <i>Driving Technology Delivering Trust</i>
          </p>
        </div>
      </div>
      <hr />
      <div className="login-container-employee">
        <form className="login-form-employee" onSubmit={handleSubmit}>
          <h1 className="heading-employee">Login</h1>

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
            autoComplete="off"
          />

          <label>Password :</label>
          <div className="loginpage-password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <span
              className="loginpage-eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="loginpage-reset-password-link">
            <Link to="/reset-password">Reset Password?</Link>
          </div>

          {error && <p className="loginpage-error">{error}</p>}

          <button type="submit">Login</button>

          <p className="loginpage-register-link-text">
            Don't have an account?{" "}
            <span
              className="loginpage-register-link"
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
