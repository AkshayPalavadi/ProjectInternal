import React, { useState, useEffect } from "react";
import { FaUser, FaClock, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
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

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 1; i >= currentYear - 3; i--) {
    years.push(`FY-${String(i).slice(-2)}`);
  }

  const [selectedYear, setSelectedYear] = useState(`FY-${String(currentYear).slice(-2)}`);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showReviewBox, setShowReviewBox] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [openTaskReview, setOpenTaskReview] = useState(null);

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    setTasks(allTasks[selectedYear] || []);
  }, [selectedYear]);

  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    allTasks[selectedYear] = updatedTasks;
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  };

  // Final reviews per FY
  const finalReviews = {
    "FY-25": { rating: 4.5, comments: "Consider participating in public speaking opportunities." },
    "FY-24": { rating: 4.2, comments: "Good progress shown in UI optimization tasks." },
    "FY-23": { rating: 3.9, comments: "Steady improvement, focus on timelines." },
  };
  const reviewData = finalReviews[selectedYear];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0 = Jan
  const currentYearShort = String(currentDate.getFullYear()).slice(-2);
  const currentFY = `FY-${currentYearShort}`;

  const isFinalizeEnabled = selectedYear === currentFY && currentMonth === 2;

  // Calculate overall rating and score
  const totalScore = tasks.reduce((sum, t) => sum + (t.score || 0), 0);
  const totalRating = tasks.reduce((sum, t) => sum + (t.rating || 0), 0);
  const avgRating = tasks.length ? (totalRating / tasks.length).toFixed(2) : 0;

  return (
    <div className="perf-container">
      <h2 className="page-title">Performance Management</h2>

      {/* Employee Details */}
      <div className="employee-card">
        <h3>Employee Details</h3>
        <div className="emp-info">
          <div><strong>Employee Name:</strong> {user.name}</div>
          <div><strong>Employee ID:</strong> {user.id}</div>
          <div><strong>Designation:</strong> {user.designation}</div>
          <div><strong>Experience:</strong> {user.experience}</div>
        </div>
      </div>

      {/* Role Section */}
      <div className="role-section">
        <div className="role-card-clock">
          <FaClock className="role-icon-clock" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="fy-dropdown"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <p>April - March</p>
        </div>
        <div className="role-card">
          <FaUser className="role-icon-manager" />
          <p>Vijay<br /><span>[Manager]</span></p>
        </div>
        <div className="role-card">
          <FaUser className="role-icon-hr" />
          <p>Priya<br /><span>[HR]</span></p>
        </div>
      </div>

      {/* Goals/Tasks */}
      <div className="goals-section">
        <div className="goals-header">
          <h3>Goals/Tasks</h3>
        </div>

        {tasks.length === 0 ? (
          <p className="no-goals">No tasks assigned for {selectedYear}</p>
        ) : (
          <table className="goals-table fade-in">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned</th>
                <th>Assigned Date</th>
                <th>Due Date</th>
                <th>Rating</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const today = new Date();
                const assignedDate = new Date(task.assignedDate);
                const dueDate = task.dueDate ? new Date(task.dueDate) : today;
                const totalDuration = Math.max(dueDate - assignedDate, 1);
                const elapsed = Math.min(Math.max(today - assignedDate, 0), totalDuration);
                const progress = Math.round((elapsed / totalDuration) * 100);

                return (
                  <React.Fragment key={task.id}>
                    <tr
                      className="task-row"
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpenTaskReview(task.id === openTaskReview ? null : task.id)}
                    >
                      <td>{task.text}</td>
                      <td>{task.assigned}</td>
                      <td>{task.assignedDate}</td>
                      <td>{task.dueDate}</td>
                      <td>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            style={{
                              color: i < (task.rating || 0) ? "#ffb400" : "#ccc",
                              marginRight: 2,
                            }}
                          />
                        ))}
                      </td>
                      <td>{task.score || 0} / 5</td>
                      <td>
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${
                              progress >= 100
                                ? "green"
                                : progress >= 75
                                ? "yellow"
                                : progress >= 40
                                ? "orange"
                                : "red"
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="status-text">
                          {progress >= 100 ? "Completed" : `${progress}%`}
                        </span>
                      </td>
                    </tr>

                    {/* Reviews Chat per Task */}
                    {openTaskReview === task.id && (
                      <tr>
                        <td colSpan="7" className="task-review-section">
                          <Reviews task={task} tasks={tasks} setTasks={setTasks} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Overall summary */}
              {tasks.length > 0 && (
                <tr className="overall-row">
                  <td colSpan={4} style={{ textAlign: "right", fontWeight: "600" }}>Overall:</td>
                  <td>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        style={{
                          color: i < Math.round(avgRating) ? "#ffb400" : "#ccc",
                          marginRight: 2,
                        }}
                      />
                    ))}
                    {/* <span style={{ marginLeft: 5 }}>{avgRating}</span> */}
                  </td>
                  <td>{totalScore} / {tasks.length * 5}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="add-task-wrapper">
          <button
            className="add-task-btn"
            onClick={() => setShowTaskModal(true)}
            disabled={selectedYear !== `FY-${String(currentYear).slice(-2)}`}
          >
            Add Task
          </button>
        </div>

        {showTaskModal && (
          <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <Task selectedFY={selectedYear} onUpdate={updateTasks} />
              <button className="close-btn" onClick={() => setShowTaskModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Final Review Section */}
      <div className="final-review-container">
        <div
          className="final-review-toggle"
          onClick={() => setShowReviewBox(!showReviewBox)}
        >
          <h3>Final Review ({selectedYear})</h3>
          {showReviewBox ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {showReviewBox && reviewData && (
          <div className="final-review fade-in">
            <div className="final-left">
              <p className="emp-name">{user.name}</p>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(reviewData.rating) ? "star" : "half-star"}
                  />
                ))}
                <span>{reviewData.rating}</span>
              </div>
              <label className="agree-label">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />{" "}
                I Agree with the Review
              </label>
            </div>

            <div className="final-right">
              <h4>Manager Comments</h4>
              <textarea value={reviewData.comments} readOnly />
              <div className="btn-box">
                <button className="finalize-btn" disabled={!isFinalizeEnabled}>Finalize Review</button>
              </div>
              {!isFinalizeEnabled && (
                <small style={{ color: "#888", paddingTop: "10px" }}>
                  Finalization is only allowed in the last month of the current FY.
                </small>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceManagement;
