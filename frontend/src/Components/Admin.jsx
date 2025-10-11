import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function Admin() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here you can manage employees, leaves, and reports.</p>
      {/* Add any admin-specific components */}


      {/* Logout Button */}
        <div className="logout-button">
          <button onClick={handleLogout}>Logout</button>
        </div>
    </div>
  );
}

export default Admin;
