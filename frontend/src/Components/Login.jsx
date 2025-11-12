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
  const checkIfUserExists = async (email) => {
  try {
    const res = await fetch(`https://internal-website-rho.vercel.app/api/auth/email/${email}`);
    const data = await res.json();
    console.log("✅ Check user API:", data);

<<<<<<< HEAD
    const exists = !!data.employee;

    // Preserve local truth of applicationSubmitted if we already have it
    const localSubmitted = localStorage.getItem("applicationSubmitted") === "true";
    const applicationSubmitted = data.employee?.applicationSubmitted || localSubmitted;

    return { exists, applicationSubmitted };
  } catch (err) {
    console.error("Error checking user existence:", err);
    return { exists: false, applicationSubmitted: false };
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

=======
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

>>>>>>> 953f64225d4d3d8cee7d4d45d9d12ff74bd34772
  if (!email.endsWith("@dhatvibs.com")) {
    setError("Only @dhatvibs.com email addresses are allowed.");
    return;
  }
<<<<<<< HEAD

  // ✅ Step 1: Check user existence
  const { exists, applicationSubmitted } = await checkIfUserExists(email);

  if (!exists) {
    alert("New user detected! Please fill out your profile form.");
    localStorage.setItem("applicationSubmitted", "false");
    navigate("/employee/profile");
    return;
  }

  // ✅ Step 2: Store application status for existing user
  localStorage.setItem("applicationSubmitted", applicationSubmitted ? "true" : "false");

  // ✅ Step 3: Proceed with login
  try {
    const response = await fetch("https://internal-website-rho.vercel.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    console.log("📦 API Login Response:", result);

    if (response.ok) {
      setIsLoggedIn(true);
      setUserRole(role);
      if (result.token) localStorage.setItem("token", result.token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("loginEmail", email);

      navigate(role === "admin" ? "/admin" : "/employee/home");
    } else {
      setError(result.msg || "Invalid email or password");
    }
  } catch (err) {
    console.error("🚨 API Error:", err);
    setError("Server not reachable. Please try again later.");
  }
};

=======

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
>>>>>>> 953f64225d4d3d8cee7d4d45d9d12ff74bd34772

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
