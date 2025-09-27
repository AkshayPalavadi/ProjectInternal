import { useState, useEffect } from "react";
import "./Leaves.css";
import logo from "../assets/logo.jpg";

export default function Leaves({
  totalLeaves,
  leavesUsed,
  setLeavesUsed,
  absentDays,
  setAbsentDays,
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [daysApplied, setDaysApplied] = useState(0);
  const [status, setStatus] = useState("sent"); // sent → manager → hr → granted
  const [granted, setGranted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [submitted, setSubmitted] = useState(false); // NEW

  const today = new Date().toISOString().split("T")[0];
  // Calculate total days applied
  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      if (end >= start) {
        const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
        setDaysApplied(diff);
      } else {
        setDaysApplied(0);
      }
    }
  }, [fromDate, toDate]);

  // Show popup when leave is granted
  useEffect(() => {
    if (granted) setShowPopup(true);
  }, [granted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // mark that user clicked submit
    setStatus("sent");

    // Simulate approvals
    setTimeout(() => setStatus("manager"), 2000);
    setTimeout(() => setStatus("hr"), 4000);
    setTimeout(() => {
      setGranted(true);
      setLeavesUsed((prev) => prev + daysApplied); // Update App.jsx state
      setStatus("granted");
    }, 6000);
  };

  return (
    <div className="leaves-page" style={{ backgroundImage: `url(${logo})` }}>
      <div className="form-box">
        <h2>Employee Leave</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><strong>From Date</strong></label>
            <input
              type="date"
              value={fromDate}
              min={today}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><strong>To Date</strong></label>
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>

          <p>
            Total Days Applied: {daysApplied}
          </p>
          <p className="leaves-count">
            Leaves Left: {totalLeaves - leavesUsed}/{totalLeaves}
          </p>

          <div className="form-group">
            <label><strong>Reason</strong></label>
            <input type="text" placeholder="Reason for leave" />
          </div>

          <div className="form-group">
            <p>Note: If number of days exceeds 3, must upload the proof.</p>
          </div>

          <div className="form-group">
            <label><strong>Upload Document</strong></label>
            <input type="file" />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>

        {/* Status Bar */}
        <div className="status-bar">
          {["sent", "manager", "hr", "granted"].map((step, idx) => (
            <div
              key={idx}
              className={`status-step ${
                ["sent", "manager", "hr", "granted"].includes(status) &&
                ["sent", "manager", "hr", "granted"].indexOf(step) <=
                  ["sent", "manager", "hr", "granted"].indexOf(status)
                  ? "active"
                  : ""
              }`}
            >
              <div className="circle">
                {status === step
                  ? "⏱"
                  : ["manager", "hr", "granted"].includes(step) &&
                    ["manager", "hr", "granted"].indexOf(step) <=
                      ["sent", "manager", "hr", "granted"].indexOf(status)
                  ? ""
                  : ""}
              </div>
              <p>
                {step === "sent"
                  ? "Sent"
                  : step === "manager"
                  ? "Manager Approval"
                  : step === "hr"
                  ? "HR Approval"
                  : "Granted"}
              </p>
            </div>
          ))}
        </div>

        {/* Leave Granted Indicator (only after submit) */}
        {submitted && (
          <p
            className="approved-btn"
            style={{ background: granted ? "green" : "gray" }}
          >
            {granted ? "Leave Granted ✅" : "Leave Not Granted ❌"}
          </p>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>🎉 Congrats!</h3>
            <p>Your leave has been granted.</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
