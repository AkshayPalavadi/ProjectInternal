import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "./OfferLetterPage.css";

const OfferLetterPage = () => {
  const { employeeName } = useParams();
  const navigate = useNavigate();

  // 👉 Generate PDF
  const handleDownload = () => {
    const doc = new jsPDF();

    const content = `
      Offer Letter

      Candidate: ${employeeName}

      Dear ${employeeName}


      We are pleased to offer you a position at Your Company.
      This letter confirms your selection and outlines the basic details
      regarding your role, joining date, compensation, and expectations.

      Please review the offer details carefully. If you have any questions,
      feel free to reach out to our HR team.

      Welcome aboard!
    `;

    doc.text(content, 10, 10);
    doc.save(`${name}_Offer_Letter.pdf`);
  };

  return (
    <div className="offerletter-container">
      <div className="offerletter-card">
        <h2>Offer Letter</h2>
        <p className="candidate-name">
          Candidate: <b>{name}</b>
        </p>

        <div className="offerletter-content">
          <p>Dear  <b>{employeeName}</b>,</p>
          <p>
            We are pleased to offer you a position at <b>Your Company</b>.
            This letter confirms your selection and outlines the basic details
            regarding your role, joining date, compensation, and expectations.
          </p>

          <p>
            Please review the offer details carefully. If you have any
            questions, feel free to reach out to our HR team.
          </p>

          <p>Welcome aboard!</p>
        </div>

        <div className="btn-area">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back to List
          </button>

          {/* 👉 DOWNLOAD BUTTON */}
          <button className="download-btn" onClick={handleDownload}>
            ⬇ Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterPage;
