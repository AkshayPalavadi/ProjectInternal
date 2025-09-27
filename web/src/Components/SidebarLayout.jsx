import React, { useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import defaultAvatar from "../assets/logo.jpg";

function SidebarLayout({ userName, setUserName, userPhoto, setUserPhoto }) {
  const [showMenu, setShowMenu] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
    setTempName(userName);
  };
  const handleSaveName = () => {
    setUserName(tempName);
    setEditingName(false);
  };
  const handleCancelEdit = () => {
    setEditingName(false);
    setTempName(userName);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
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
                  <p>{userName}</p>
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

        {/* Sidebar Links */}
        <ul className="sidebar-links">
          <li>
            <Link to="home" className={pathname === "/employee/home" ? "homeActive" : "homeInactive"}>
              Home
            </Link>
          </li>
          <li>
            <Link to="dashboard" className={pathname === "/employee/dashboard" ? "dashboardActive" : "dashboardInactive"}>
              My Dashboard
            </Link>
          </li>
          <li>
            <Link to="profile" className={pathname === "/employee/profile" ? "profileActive" : "profileInactive"}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="leaves" className={pathname === "/employee/leaves" ? "leaveActive" : "leaveInactive"}>
              Leaves
            </Link>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="logout-button">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
