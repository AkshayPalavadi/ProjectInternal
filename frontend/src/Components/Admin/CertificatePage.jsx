import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./CertificatePage.css";
import logo from "../../assets/logo.jpg";

const CertificatePage = () => {
  const location = useLocation();
  const data = location.state;
  const certificateRef = useRef();

  if (!data) {
    return (
      <div className="certificate-container">
        <div className="certificate-box fade-in">
          <h2>No Certificate Data Found</h2>
          <p>Please go back and select an employee certificate.</p>
        </div>
      </div>
    );
  }

  const { employeeName, courseName, completedDate } = data;

  // ✅ Perfect PDF Export (no cutoff)
const downloadPDF = async () => {
  const element = certificateRef.current;

  // Wait for the DOM and images to load
  await new Promise((resolve) => setTimeout(resolve, 500));

  // ✅ Use html2canvas in standard mode (most stable)
  const canvas = await html2canvas(element, {
    scale: 3, // high DPI
    useCORS: true,
    allowTaint: true,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.documentElement.offsetWidth,
    backgroundColor: "#ffffff", // force white background
  });

  // ✅ Create a full white background to prevent transparent render
  const fixedCanvas = document.createElement("canvas");
  fixedCanvas.width = canvas.width;
  fixedCanvas.height = canvas.height;
  const ctx = fixedCanvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, fixedCanvas.width, fixedCanvas.height);
  ctx.drawImage(canvas, 0, 0);

  // ✅ Convert to high-quality JPEG
  const imgData = fixedCanvas.toDataURL("image/jpeg", 1.0);

  // ✅ Create landscape PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a3",
    compress: false,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Maintain proportions
  const imgWidth = pdfWidth - 40; // small side margin
  const imgHeight = (fixedCanvas.height * imgWidth) / fixedCanvas.width;

  let positionY = (pdfHeight - imgHeight) / 2;
  if (positionY < 0) positionY = 10;

  pdf.addImage(imgData, "JPEG", 20, positionY, imgWidth, imgHeight);

  pdf.save(`${employeeName}_Certificate.pdf`);
};

  return (
    <div className="certificate-container">
      <div className="certificate-box fade-in" ref={certificateRef}>
        {/* ✅ Watermark */}
        <div className="certificate-watermark">
          <img src={logo} alt="Watermark" />
        </div>

        {/* ✅ Logo at Top */}
        <div className="certificate-logo">
          <img src={logo} alt="Dhativi Logo" />
        </div>

        <h1 className="certificate-title">CERTIFICATE OF ACHIEVEMENT</h1>
        <p className="certificate-subtitle">
          This certificate is proudly presented to
        </p>

        <h2 className="certificate-name slide-up">{employeeName}</h2>

        <p className="certificate-desc">
          We certify that <strong>{employeeName}</strong> has successfully
          completed the course <strong>{courseName}</strong> on{" "}
          <strong>{completedDate}</strong>. <br />
          The candidate has achieved <strong>Senior Level</strong> with{" "}
          <strong>Advanced</strong> proficiency and has{" "}
          <strong>15 years of experience</strong>.
        </p>

        {/* ✅ Signature + Stamp */}
        <div className="signature-section">
          <div className="signature-block fade-in-delay">
            <p className="signature-label">Vijay</p>
            <p className="signature-role">Training Manager</p>
          </div>

          <div className="stamp-block fade-in-delay-2">
            <img src={logo} alt="Company Stamp" className="stamp-img" />
          </div>
        </div>

        <p className="certificate-footer">
          <em>By the Training & Development Team</em>
        </p>
      </div>

      {/* ✅ Download Button */}
      <div className="download-btn-container">
        <button className="download-btn" onClick={downloadPDF}>
          ⬇️ Download Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificatePage;
