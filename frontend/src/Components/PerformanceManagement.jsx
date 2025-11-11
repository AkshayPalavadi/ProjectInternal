import React, { useState, useEffect } from "react";
import { FaUser, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Reviews from "./Reviews.jsx";
import Task from "./Task.jsx";
import "./PerformanceManagement.css";

const PerformanceManagement = () => {
  const [user] = useState({
    name: localStorage.getItem("employeeName") || "",
    id: localStorage.getItem("employeeId") || "",
    designation: localStorage.getItem("employeeDesignation") || "",
    experience: localStorage.getItem("employeeExperience") || "",
  });

  // --- Financial Year Logic ---
  const today = new Date();
  const month = today.getMonth(); // 0=Jan
  const year = today.getFullYear();
  const fyStart = month >= 3 ? year : year - 1;
  const fyEnd = fyStart + 1;
  const currentFYLabel = `FY (${String(fyStart).slice(-2)} - ${String(fyEnd).slice(-2)})`;

  // --- Generate FY options (last 4 FYs) ---
  const years = [];
  for (let i = fyStart; i >= fyStart - 3; i--) {
    years.push(`FY (${String(i).slice(-2)} - ${String(i + 1).slice(-2)})`);
  }

  const [selectedYear, setSelectedYear] = useState(currentFYLabel);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [openTaskReview, setOpenTaskReview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [manager, setManager] = useState({ name: "", id: "" });
  const [hr, setHr] = useState({ name: "", id: "" });

  // Load tasks per FY
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    const fyTasks = allTasks[selectedYear] || [];
    const filtered = fyTasks.filter((t) => t.assignedTo === user.id);
    setTasks(filtered);
  }, [selectedYear, user.id]);

  useEffect(() => {
    setManager({
      name: localStorage.getItem("managerName") || "",
      id: localStorage.getItem("managerId") || "",
    });
    setHr({
      name: localStorage.getItem("hrName") || "",
      id: localStorage.getItem("hrId") || "",
    });
  }, []);

  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    allTasks[selectedYear] = updatedTasks;
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  };

  // --- Final Reviews State ---
  // const [finalReviews, setFinalReviews] = useState({
  //   "FY (25 - 26)": {
  //     rating: 4.5,
  //     comments: "Consider participating in public speaking opportunities.",
  //     bandScore: "A1",
  //     agree: false,
  //     disagree: false,
  //     empComment: "",
  //   },
  //   "FY (24 - 25)": {
  //     rating: 4.2,
  //     comments: "Good progress shown in UI optimization tasks.",
  //     bandScore: "B2",
  //     agree: false,
  //     disagree: false,
  //     empComment: "",
  //   },
  //   "FY (23 - 24)": {
  //     rating: 3.9,
  //     comments: "Steady improvement, focus on timelines.",
  //     bandScore: "C1",
  //     agree: false,
  //     disagree: false,
  //     empComment: "",
  //   },
  // });

  const [finalReviews, setFinalReviews] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("finalReviews") || "{}");
    return stored;
  });

  const reviewData =
    finalReviews[selectedYear] || {
      rating: 0,
      comments: "",
      bandScore: "-",
      agree: false,
      disagree: false,
      empComment: "",
    };

  // --- Handlers ---
  const handleAgree = () => {
    setFinalReviews((prev) => ({
      ...prev,
      [selectedYear]: { ...prev[selectedYear], agree: true, disagree: false },
    }));
  };

  const handleDisagree = () => {
    setFinalReviews((prev) => ({
      ...prev,
      [selectedYear]: { ...prev[selectedYear], agree: false, disagree: true },
    }));
  };

  const handleEmpCommentChange = (e) => {
    setFinalReviews((prev) => ({
      ...prev,
      [selectedYear]: { ...prev[selectedYear], empComment: e.target.value },
    }));
  };

  const handleFinalize = () => {
    const finalizedOn = new Date().toISOString();

    const updatedReview = {
      fy: selectedYear,
      employeeId: user.id,
      avgRating,
      bandScore: reviewData.bandScore,
      managerComments: reviewData.comments,
      empComment: reviewData.empComment,
      agree: reviewData.agree,
      disagree: reviewData.disagree,
      finalizedOn,
    };

    // Store locally for now (later send to backend)
    setFinalReviews((prev) => ({
      ...prev,
      [selectedYear]: updatedReview,
    }));

    localStorage.setItem("finalReviews", JSON.stringify({
      ...finalReviews,
      [selectedYear]: updatedReview,
    }));

    console.log("✅ Final Review submitted:", updatedReview);
    alert("Final review submitted successfully!");
  };

  const handleReport = () => {
    console.log("⚠️ Report sent to TL:", {
      fy: selectedYear,
      bandScore: reviewData.bandScore,
      avgRating,
      agree: reviewData.agree,
      disagree: reviewData.disagree,
      empComment: reviewData.empComment,
      managerComments: reviewData.comments,
    });
    alert("Reported to TL successfully!");
  };

  // Calculate average rating
  const totalRating = tasks.reduce((sum, t) => sum + (t.rating || 0), 0);
  const avgRating = tasks.length
    ? (totalRating / tasks.length).toFixed(2)
    : 0;

  const canFinalize = reviewData.bandScore && reviewData.comments;

  return (
    <div className="performancemanagement-perf-container">
      <h2 className="performancemanagement-page-title">
        Performance Management
      </h2>

      {/* Employee Details */}
      <div className="performancemanagement-employee-card">
        <h3>Employee Details</h3>
        <div className="performancemanagement-emp-info">
          <div>
            <strong>Employee Name:</strong> {user.name}
          </div>
          <div>
            <strong>Employee ID:</strong> {user.id}
          </div>
          <div>
            <strong>Designation:</strong> {user.designation}
          </div>
          <div>
            <strong>Experience:</strong> {user.experience}
          </div>
        </div>
      </div>

      {/* FY & Manager/HR */}
      <div className="performancemanagement-role-section">
        <div className="performancemanagement-role-card-clock">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="performancemanagement-fy-dropdown"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <p>April - March</p>
        </div>
        <div className="performancemanagement-role-card">
          <FaUser className="performancemanagement-role-icon-manager" />
          <p>
            {manager.name || "Manager"}
            <br />
            <span>[Manager]</span>
          </p>
        </div>
        <div className="performancemanagement-role-card">
          <FaUser className="performancemanagement-role-icon-hr" />
          <p>
            {hr.name || "HR"}
            <br />
            <span>[HR]</span>
          </p>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="performancemanagement-goals-section">
        <div className="performancemanagement-goals-header">
          <h3>Goals/Tasks</h3>
        </div>

        {tasks.length === 0 ? (
          <p className="performancemanagement-no-goals">
            No tasks assigned for {selectedYear}
          </p>
        ) : (
          <table className="performancemanagement-goals-table fade-in">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assigned By</th>
                <th>Assigned Date</th>
                <th>Due Date</th>
                <th>Rating</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
{tasks.map((task) => {
  // --- progress based on dates ---
  const assigned = new Date(task.assignedDate);
  const due = new Date(task.dueDate);
  const now = new Date();

  const totalDuration = due - assigned;
  const elapsed = now - assigned;

  const progress =
    totalDuration > 0 ? Math.min((elapsed / totalDuration) * 100, 100) : 0;

  // --- color logic ---
  let progressColor = "#f44336"; // red
  if (progress >= 50 && progress < 85) progressColor = "#ffeb3b"; // yellow
  if (progress >= 85) progressColor = "#4caf50"; // green

  return (
    <React.Fragment key={task.id}>
      <tr
        className="performancemanagement-task-row"
        onClick={() =>
          setOpenTaskReview(task.id === openTaskReview ? null : task.id)
        }
      >
        <td>{task.text}</td>
        <td>{task.assignedBy}</td>
        <td>{task.assignedDate}</td>
        <td>{task.dueDate}</td>
        <td>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              style={{
                color: i < (task.rating || 0) ? "#ffb400" : "#ccc",
              }}
            />
          ))}
        </td>
        <td>
          <div className="performancemanagement-progress-wrapper">
            <div className="performancemanagement-progress-bar">
              <div
                className="performancemanagement-progress-fill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progressColor,
                }}
              ></div>
            </div>
            <span className="performancemanagement-progress-label">
              {Math.round(progress)}%
            </span>
          </div>
        </td>
      </tr>

      {openTaskReview === task.id && (
        <tr>
          <td colSpan="6" className="performancemanagement-task-review-section">
            <Reviews task={task} tasks={tasks} setTasks={updateTasks} />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
})}

              {/* ✅ Overall Rating Row */}
              {tasks.length > 0 && (
                <tr className="performancemanagement-overall-row">
                  <td colSpan="4">Overall Average Rating</td>
                  <td colSpan="2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        style={{
                          color: i < Math.round(avgRating) ? "#ffb400" : "#ccc",
                        }}
                      />
                    ))}
                    <span style={{ marginLeft: "6px" }}>{avgRating}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="performancemanagement-add-task-wrapper">
          <button
            className="performancemanagement-add-task-btn"
            onClick={() => setShowTaskModal(true)}
            disabled={selectedYear !== currentFYLabel}
          >
            Add Task
          </button>
        </div>

        {showTaskModal && (
          <div
            className="performancemanagement-modal-overlay"
            onClick={() => setShowTaskModal(false)}
          >
            <div
              className="performancemanagement-modal-content modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <Task selectedFY={selectedYear} onUpdate={updateTasks} />
            </div>
          </div>
        )}
      </div>

      {/* Final Review Section */}
      <div className="performancemanagement-final-review-container">
        <div
          className="performancemanagement-final-review-toggle"
          onClick={() => setShowReviewBox(!showReviewBox)}
        >
          <h3>Final Review ({selectedYear})</h3>
          {showReviewBox ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {showReviewBox && (
          <div className="performancemanagement-final-review fade-in">
            <div className="performancemanagement-final-left">
              <p className="performancemanagement-emp-name">{user.name}</p>

              <div className="performancemanagement-overall-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    style={{
                      color: i < Math.round(avgRating) ? "#ffb400" : "#ccc",
                    }}
                  />
                ))}
                <span style={{ marginLeft: 6 }}>{avgRating}</span>
              </div>

              <div className="performancemanagement-band-score">
                Band Score: {reviewData.bandScore || "-"}
              </div>

              <div className="performancemanagement-agree-disagree">
                <label>
                  <input
                    type="checkbox"
                    checked={reviewData.agree}
                    onChange={handleAgree}
                  />{" "}
                  Agree
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={reviewData.disagree}
                    onChange={handleDisagree}
                  />{" "}
                  Disagree
                </label>
              </div>

              <textarea
                className="performancemanagement-emp-comment"
                placeholder="Add your comments here..."
                value={reviewData.empComment}
                onChange={handleEmpCommentChange}
              />

              {reviewData.agree && (
                <button
                  className="performancemanagement-finalize-btn"
                  onClick={handleFinalize}
                  disabled={!canFinalize}
                  title={!canFinalize ? "Waiting for manager to assign band score & comments" : ""}
                >
                  Finalize Review
                </button>
              )}
              {reviewData.disagree && (
                <button
                  className="performancemanagement-report-btn"
                  onClick={handleReport}
                  disabled={!canFinalize}
                  title={!canFinalize ? "Waiting for manager to assign band score & comments" : ""}
                >
                  Report to TL
                </button>
              )}

              <button
  className="simulate-btn"
  style={{ marginTop: "10px", backgroundColor: "#6c63ff", color: "#fff" }}
  onClick={() => {
    const updated = {
      ...reviewData,
      bandScore: "A1",
      comments: "Excellent performance. Consistent delivery and leadership.",
    };
    setFinalReviews((prev) => ({ ...prev, [selectedYear]: updated }));
    localStorage.setItem("finalReviews", JSON.stringify({ ...finalReviews, [selectedYear]: updated }));
    alert("Simulated manager input added!");
  }}
>
  Simulate Manager Input
</button>

            </div>

            <div className="performancemanagement-final-right">
              <h4>Manager Comments</h4>
              <textarea value={reviewData.comments} readOnly />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceManagement;
