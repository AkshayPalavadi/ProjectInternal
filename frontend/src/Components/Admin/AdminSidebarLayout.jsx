import React, { useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";
import defaultAvatar from "../../assets/logo.jpg";

function AdminSidebarLayout() {
  const [showMenu, setShowMenu] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("Admin Name");
  const [userPhoto, setUserPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    // { name: "Home", path: "/admin/home"},
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Employees", path: "/admin/employees" },
    { name: "Careers", path: "/admin/careers" },
    { name: "Projects", path: "/admin/projects" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Leaves & Attendance", path: "/admin/leavesAdmin" }
  ];

  // ---------- PHOTO ----------
  const handlePhotoClick = () => setShowMenu(!showMenu);
  const handleAddPhoto = () => {
    fileInputRef.current.click();
    setShowMenu(false);
  };
  const handleRemovePhoto = () => {
    setUserPhoto(null);
    setShowMenu(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUserPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ---------- NAME ----------
  const handleEditName = () => {
    setEditingName(true);
    setTempName(tempName);
  };
  const handleSaveName = () => {
    setTempName(tempName);
    setEditingName(false);
  };
  const handleCancelEdit = () => {
    setEditingName(false);
  };

const handleLogout = () => {
  // 🔹 Mark as logged out
  localStorage.setItem("hasLoggedOut", "true");

  // 🔹 Clear login-related data
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("employeeEmail");
  localStorage.removeItem("employeeName");
  localStorage.removeItem("employeeRole");
  localStorage.removeItem("employeeId");

  // (Optional) If you want to also forget the remembered user, uncomment:
  // localStorage.removeItem("rememberedUser");

  // 🔹 Redirect to login
  navigate("/login", { replace: true });

  // 🔹 Force a reload so App re-renders in logged-out state
  window.location.reload();
};


  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="profile-section">
          <div className="photo-name-container">
            <div className="photo-wrapper" onClick={handlePhotoClick}>
              <img src={userPhoto || defaultAvatar} alt="Profile" />
              {showMenu && (
                <div className="photo-menu">
                  <button onClick={handleAddPhoto}>Add Photo</button>
                  {userPhoto && <button onClick={handleRemovePhoto}>Remove Photo</button>}
                </div>
              )}
            </div>

            <div className="username-section">
              {editingName ? (
                <div className="edit-name-box">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                  />
                  <div className="name-buttons">
                    <button onClick={handleSaveName}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="name-display">
                  <p>{tempName}</p>
                  <button className="edit-name-btn" onClick={handleEditName}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Menu Links */}
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminSidebarLayout;
