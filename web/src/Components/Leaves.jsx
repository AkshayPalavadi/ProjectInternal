import { useState, useEffect } from "react";
import "./Leaves.css";
import History from "./History.jsx";

export default function Leaves() {
  const [activeTab, setActiveTab] = useState("form");

  // Form states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [daysApplied, setDaysApplied] = useState(0);
  const [leaveType, setLeaveType] = useState("none");
  const [customTypes, setCustomTypes] = useState([]);
  const [reason, setReason] = useState("");
  const [compoffDates, setCompoffDates] = useState([]);
  const [file, setFile] = useState(null);

  // Status + requests
  const [status, setStatus] = useState("draft");
  const [granted, setGranted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Popups + errors
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [showGrantedPopup, setShowGrantedPopup] = useState(false);
  const [errors, setErrors] = useState([]);

  const today = new Date().toLocaleDateString("en-CA");

  // Leave balances
  const [leaveBalances, setLeaveBalances] = useState({
    casual: 5,
    sick: 3,
    earned: 2,
    optional: 2,
  });

  // Calculate days excluding Sundays
  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      if (end >= start) {
        let count = 0;
        let current = new Date(start);
        while (current <= end) {
          if (current.getDay() !== 0) count++;
          current.setDate(current.getDate() + 1);
        }
        setDaysApplied(count);
      } else {
        setDaysApplied(0);
      }
    }
  }, [fromDate, toDate]);

  // Auto-switch/add LOP when balance insufficient
  useEffect(() => {
    if (daysApplied > 0) {
      if (
        leaveType !== "none" &&
        leaveType !== "custom" &&
        leaveType !== "lop"
      ) {
        if (leaveType in leaveBalances && leaveBalances[leaveType] < daysApplied) {
          setLeaveType("lop");
        }
      }

      if (leaveType === "custom" && customTypes.length > 0) {
        const totalAvailable = customTypes.reduce((sum, type) => {
          if (type in leaveBalances) return sum + leaveBalances[type];
          return sum;
        }, 0);

        if (totalAvailable < daysApplied) {
          if (!customTypes.includes("lop")) {
            setCustomTypes((prev) => [...prev, "lop"]);
          }
        } else if (totalAvailable >= daysApplied && customTypes.includes("lop")) {
          setCustomTypes((prev) => prev.filter((c) => c !== "lop"));
        }
      }
    }
  }, [daysApplied, leaveType, customTypes, leaveBalances]);

  // Update last request
  const updateLastRequestStatus = (newStatus) => {
    setRequests((prev) =>
      prev.map((req, idx) =>
        idx === prev.length - 1 ? { ...req, status: newStatus } : req
      )
    );
  };

  // Generate valid comp-off Sundays
  const getValidCompoffDates = () => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = todayDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let dates = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isoDate = date.toLocaleDateString("en-CA");
      if (date < todayDate && date.getDay() === 0) dates.push(isoDate);
    }
    return dates;
  };
  const validCompoffDates = getValidCompoffDates();

  // Handlers
  const handleCompoffCheckbox = (e) => {
    const value = e.target.value;
    if (e.target.checked) setCompoffDates([...compoffDates, value]);
    else setCompoffDates(compoffDates.filter((d) => d !== value));
  };

  const handleCustomCheckbox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      const totalAvailable = customTypes.reduce(
        (sum, type) => sum + (leaveBalances[type] || 0),
        0
      );
      if (totalAvailable >= daysApplied) return;
      setCustomTypes([...customTypes, value]);
    } else {
      setCustomTypes(customTypes.filter((c) => c !== value));
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(uploadedFile.type)) {
        setErrors(["Only PDF, Word, and Image files are allowed."]);
        setFile(null);
        return;
      }
      if (uploadedFile.size > 2 * 1024 * 1024) {
        setErrors([`File size must not exceed 2MB. Your file is ${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB.`]);
        setFile(null);
        return;
      }
      setFile(uploadedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = [];

    if (leaveType === "none") validationErrors.push("Please select a leave type.");
    if (leaveType === "custom" && customTypes.length === 0)
      validationErrors.push("Select at least one custom leave type.");
    if (!reason.trim()) validationErrors.push("Reason is required.");
    if (leaveType === "compoff" && compoffDates.length === 0)
      validationErrors.push("Please select at least one Compoff day.");
    if (daysApplied > 2 && !file)
      validationErrors.push("File upload is mandatory for this leave.");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setSubmitted(true);
    setStatus("sent");

    const newRequest = {
      fromDate,
      toDate,
      daysApplied,
      leaveType,
      customTypes,
      reason,
      file: file || null,
      status: "Sent",
    };

    setRequests((prev) => [...prev, newRequest]);
    setCurrentIndex(requests.length);

    // Reset form fields
    setFromDate("");
    setToDate("");
    setDaysApplied(0);
    setLeaveType("none");
    setCustomTypes([]);
    setReason("");
    setCompoffDates([]);
    setFile(null);

    setShowSubmitPopup(true);
  };

  const handleManagerApproval = () => {
    if (status === "sent") {
      setStatus("manager");
      updateLastRequestStatus("Manager Approved");

      setStatus("hr");
      updateLastRequestStatus("HR Approved");
      handleGrant();
    }
  };

  const handleGrant = () => {
    setStatus("granted");
    setGranted(true);
    updateLastRequestStatus("Granted");

    if (requests[currentIndex]) {
      const req = requests[currentIndex];
      const days = req.daysApplied;

      if (req.leaveType === "custom") {
        let remaining = days;
        const newBalances = { ...leaveBalances };

        for (const type of req.customTypes) {
          if (type !== "lop" && type in newBalances && remaining > 0) {
            const deduction = Math.min(newBalances[type], remaining);
            newBalances[type] -= deduction;
            remaining -= deduction;
          }
        }
        setLeaveBalances(newBalances);
      } else if (req.leaveType in leaveBalances && req.leaveType !== "lop") {
        setLeaveBalances((prev) => ({
          ...prev,
          [req.leaveType]: Math.max(0, prev[req.leaveType] - days),
        }));
      }
    }

    setShowSubmitPopup(false);
    setShowGrantedPopup(true);
  };

  const leaveOptions = [
    { id: "casual", label: "Casual" },
    { id: "sick", label: "Sick" },
    { id: "earned", label: "Earned" },
    { id: "optional", label: "Optional (Female only)" },
    { id: "lop", label: "Loss of Pay" },
    { id: "compoff", label: "Compoff" },
  ];

  const handleDeleteRequest = (index) => {
    setRequests((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="leaves-page">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "form" ? "tab active" : "tab"}
          onClick={() => setActiveTab("form")}
        >
          Leave Form
        </button>
        <button
          className={activeTab === "requests" ? "tab active" : "tab"}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>
      </div>

      {/* Form tab */}
      {activeTab === "form" ? (
        <div className="form-box">
          <h2>Employee Leave</h2>

          {errors.length > 0 && (
            <div className="error-box">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><strong>From Date</strong></label>
              <input type="date" value={fromDate} min={today} onChange={e => setFromDate(e.target.value)} required />
            </div>

            <div className="form-group">
              <label><strong>To Date</strong></label>
              <input type="date" value={toDate} min={fromDate} onChange={e => setToDate(e.target.value)} required />
            </div>

            <p>Total Days Applied: <span className="green-text">{daysApplied}</span></p>

            <div className="leave-breakdown-box">
              <ul>
                <li>Casual Leaves Left: {leaveBalances.casual}/5</li>
                <li>Sick Leaves Left: {leaveBalances.sick}/3</li>
                <li>Earned Leaves Left: {leaveBalances.earned}/2</li>
                <li>Optional Leaves Left: {leaveBalances.optional}/2</li>
              </ul>
            </div>

            <div className="form-group">
              <label><strong>Leave Type</strong></label>
              <select value={leaveType} onChange={e => setLeaveType(e.target.value)} required>
                <option value="none">-- Select Type --</option>
                {leaveOptions.map(opt => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={
                      opt.id !== "custom" &&
                      opt.id !== "lop" &&
                      leaveBalances[opt.id] < daysApplied
                    }
                  >
                    {opt.label}
                    {/* {opt.id in leaveBalances
                      ? ` (${leaveBalances[opt.id]} left)`
                      : ""} */}
                  </option>
                ))}
                <option value="custom">Custom (Select Multiple)</option>
              </select>
            </div>

            {leaveType === "custom" && (
              <div className="form-group">
                <label><strong>Select Multiple Leave Types</strong></label>
                <div className="checkbox-group">
                  {leaveOptions.map(opt => (
                    <label key={opt.id}>
                      <input
                        type="checkbox"
                        value={opt.id}
                        checked={customTypes.includes(opt.id)}
                        onChange={handleCustomCheckbox}
                        disabled={
                          opt.id !== "lop" &&
                          !customTypes.includes(opt.id) &&
                          customTypes.reduce((sum, type) => sum + (leaveBalances[type] || 0), 0) >= daysApplied
                        }
                      />
                      {opt.label}
                      {opt.id in leaveBalances
                        ? ` (${leaveBalances[opt.id]} left)`
                        : ""}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {leaveType === "compoff" && (
              <div className="form-group">
                <label><strong>Select Worked Days (Sundays)</strong></label>
                {validCompoffDates.length > 0 ? (
                  validCompoffDates.map(date => (
                    <label key={date}>
                      <input type="checkbox" value={date} checked={compoffDates.includes(date)} onChange={handleCompoffCheckbox} />
                      {new Date(date).toDateString()}
                    </label>
                  ))
                ) : <p>No available Sundays this month.</p>}
              </div>
            )}

            <div className="form-group">
              <label><strong>Reason</strong></label>
              <input type="text" placeholder="Reason for leave" value={reason} onChange={e => setReason(e.target.value)} required />
            </div>

            <div className="form-group">
              <label><strong>Upload Document</strong></label>
              <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} required={daysApplied > 2} />
            </div>

            <button type="submit" className="submit-btn">Submit</button>
          </form>

          {submitted && status === "sent" && (
            <button
              onClick={handleManagerApproval}
              className="submit-btn"
              style={{ marginTop: "12px", background: "green" }}
            >
              Manager Approve
            </button>
          )}

          {submitted && (
            <>
              <div className="status-bar-bottom">
                {["sent", "manager", "hr", "granted"].map((step, idx) => (
                  <div
                    key={idx}
                    className={`status-step ${
                      ["sent", "manager", "hr", "granted"].indexOf(step) <=
                      ["sent", "manager", "hr", "granted"].indexOf(status)
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="circle">{status === step ? "⏱" : ""}</div>
                    <p>
                      {step === "sent"
                        ? "Sent"
                        : step === "manager"
                        ? "Manager"
                        : step === "hr"
                        ? "HR"
                        : "Granted"}
                    </p>
                  </div>
                ))}
              </div>

              <p className={`approved-btn ${granted ? "granted" : ""}`}>
                {granted ? "Leave Granted ✅" : "Leave Pending ⏳"}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="requests-box">
          <h2>My Leave Requests</h2>
          {requests.length === 0 ? (
            <p>No leave requests submitted yet.</p>
          ) : (
            <History requests={requests} onDelete={handleDeleteRequest} />
          )}
        </div>
      )}

      {showSubmitPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>✅ Leave Submitted!</h3>
            <p>Your leave request has been submitted successfully.</p>
            <button onClick={() => setShowSubmitPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {showGrantedPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>🎉 Leave Granted!</h3>
            <p>Your leave has been approved.</p>
            <button onClick={() => setShowGrantedPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
