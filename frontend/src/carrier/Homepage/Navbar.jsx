import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import Logo from "../assets/dhatvi.jpg";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ scrollToAbout, scrollToJobs, scrollToSubscribe }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Check login status on load
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("userEmail");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setUserEmail(email || "");
    }
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/carrier/login"); // ✅ redirect to carrier login
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={Logo} alt="DhaTvi Logo" className="logo-img" />
        <div className="logo-text">
          <span className="dhativi-text">DhaTvi</span>
          <div className="green-line"></div>
          <span className="business-text">BUSINESS SOLUTIONS PVT. LTD</span>
        </div>
      </div>

      <ul className="nav-links">
        {/* ✅ All carrier links must start with /carrier */}
        <li>
          <Link to="/carrier/jobs">Careers</Link>
        </li>
        <li onClick={scrollToAbout}>What we do</li>
        <li onClick={scrollToSubscribe}>Join Talent Network</li>

        <li ref={dropdownRef}>
          {!isLoggedIn ? (
            // 🔹 Show Login button when not logged in
            <button
              className="login-btn-nav"
              onClick={() => navigate("/carrier/login")}
            >
              Login →
            </button>
          ) : (
            // 🔹 Show Profile dropdown when logged in
            <div
              className="profile-dropdown"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="profile-name">👤 Profile</span>
              {dropdownOpen && (
                <div className="dropdown-menu-job">
                  <p onClick={() => navigate("/carrier/appliedjoblist")}>
                    Applied Jobs
                  </p>
                  <p onClick={() => navigate("/carrier/savedjoblist")}>
                    Saved Jobs
                  </p>
                  <hr />
                  <p onClick={handleLogout} className="logout">
                    Logout
                  </p>
                </div>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
