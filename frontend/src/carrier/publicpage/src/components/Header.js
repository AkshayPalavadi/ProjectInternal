import React from "react";
import Logo from "../assets/dhatvi.jpg";
import "./Header.css";

const Header = () => {
  return (
    <nav className="navbar">
        <div className="logo">
            <img src={Logo} alt="Logo" className="logo" />
            <div className="logo-text">
                <span className="dhatvi-text">Dhatvi</span>
                <div className="green-line-job"></div>
                <span className="business-text">BUSINESS SOLUTIONS PVT.LTD</span>
            </div>
        </div>
    </nav>
  );
};

export default Header;
