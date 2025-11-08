import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import LeavesEmp from "./LeavesEmp.jsx";
import AttendanceEmp from "./AttendanceEmp.jsx";
import "./LeavesAdmin.css";

export default function LeavesAdmin() {
  const [activeTab, setActiveTab] = useState("leaves");

  return (
    <div>
      <div className="leavesadmin-navigation-cards-row">
        <Link to="/admin/leaves" className="leavesadmin-nav-card">
          <h2>Leaves</h2>
          <p>Track employee Leaves</p>
        </Link>

        <Link to="/admin/attendance" className="leavesadmin-nav-card">
          <h2>Attendance</h2>
          <p>Track employee Attendance</p>
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
