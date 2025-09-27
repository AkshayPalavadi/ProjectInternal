// Home.jsx
import { useState } from "react";
import bottomImage from "../assets/logo.jpg"; 
import logo from "../assets/logo.jpg"; // add your logo file in assets
import "./Home.css";

export default function Home() {
  const scrollText = "Dhatvi Business Solutions Pvt.Ltd. ";
  const italicText = "Driving Technology, Delivering Trust";

  return (
    <div className="home-container">
      <div className="scrolling-text">
        <div className="scrolling-content">
          <span>
            <img src={logo} alt="Logo" className="scroll-logo" />
            {scrollText}
            <i>{italicText}</i>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>
            <img src={logo} alt="Logo" className="scroll-logo" />
            {scrollText}
            <i>{italicText}</i>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
       <div className="bottom-image">
        <img src={bottomImage} alt="Bottom" />
      </div>
    </div>
  );
}