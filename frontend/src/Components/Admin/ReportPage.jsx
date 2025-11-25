import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportPage = () => {
  const { state } = useLocation();
  const employee = state?.employee;

  const reportRef = useRef();

  const downloadPDF = async () => {
    const input = reportRef.current;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${employee.employeeName}_TrainingReport.pdf`);
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* REPORT CARD */}
      <div
        ref={reportRef}
        style={{
          padding: "30px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
          width: "650px",
          margin: "0 auto",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            background: "#1e3a8a",
            padding: "18px",
            color: "white",
            borderRadius: "12px 12px 0 0",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", letterSpacing: "1px" }}>
            Employee Training Report
          </h2>
        </div>

        {/* DETAILS */}
        <div style={{ padding: "5px 20px" }}>
          <p style={{ marginBottom: "12px" }}>
            <b style={{ color: "#1e40af" }}>Name:</b> {employee.employeeName}
          </p>

          <p style={{ marginBottom: "12px" }}>
            <b style={{ color: "#1e40af" }}>Employee ID:</b> {employee.empId}
          </p>

          <p style={{ marginBottom: "12px" }}>
            <b style={{ color: "#1e40af" }}>Training Course:</b>{" "}
            {employee.courseName}
          </p>

          <p style={{ marginBottom: "12px" }}>
            <b style={{ color: "#1e40af" }}>Level:</b> {employee.level}
          </p>

          <p style={{ marginBottom: "12px" }}>
            <b style={{ color: "#1e40af" }}>Completed Date:</b>{" "}
            {employee.completedDate}
          </p>
        </div>

        <hr style={{ margin: "20px 0" }} />

      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        style={{
          background: "#1e40af",
          color: "white",
          border: "none",
          padding: "12px 22px",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "30px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "16px",
        }}
      >
        ⬇ Download Report
      </button>
    </div>
  );
};

export default ReportPage;
