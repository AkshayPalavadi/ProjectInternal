import React, { useState, useEffect } from "react";
import { FaUser, FaClock, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Reviews from "./Reviews.jsx";
import Task from "./Task.jsx";
import "./PerformanceManagement.css";

const PerformanceManagement = () => {
  const [user] = useState({
    name: localStorage.getItem("userName") || "",
    id: localStorage.getItem("empId") || "",
    designation: localStorage.getItem("employeeDesignation") || "",
    experience: localStorage.getItem("employeeExperience") || "",
  });

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 1; i >= currentYear - 3; i--) {
    years.push(`FY${String(i).slice(-2)}`);
  }

  const [selectedYear, setSelectedYear] = useState(`FY${String(currentYear).slice(-2)}`);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [openTaskReview, setOpenTaskReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentFY = `FY${String(currentYear).slice(-2)}`;
  const isFinalizeEnabled = selectedYear === currentFY && new Date().getMonth() === 2;

// Inside useEffect or fetchTasks function
const fetchTasks = async () => {
  setLoading(true);
  try {
    const res = await fetch("https://internal-website-rho.vercel.app/api/tasks");
    const data = await res.json();
    // Filter tasks assigned BY logged-in user
    const assignedByMe = data.filter(
      (t) => t.fy === selectedYear && t.assigned === user.name
    );
    setTasks(assignedByMe);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch tasks");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTasks();
  }, [selectedYear]);

  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  const finalReviews = {
    "FY25": { rating: 4.5, comments: "Consider participating in public speaking opportunities." },
    "FY24": { rating: 4.2, comments: "Good progress shown in UI optimization tasks." },
    "FY23": { rating: 3.9, comments: "Steady improvement, focus on timelines." },
  };
  const reviewData = finalReviews[selectedYear];

  const totalScore = tasks.reduce((sum, t) => sum + (t.score || 0), 0);
  const totalRating = tasks.reduce((sum, t) => sum + (t.rating || 0), 0);
  const avgRating = tasks.length ? (totalRating / tasks.length).toFixed(2) : 0;

  return (
    <div className="performance-management-perf-container">
      <h2 className="performance-management-page-title">Performance Management</h2>

      {/* Employee Details */}
      <div className="performance-management-employee-card">
        <h3>Employee Details</h3>
        <div className="performance-management-emp-info">
          <div><strong>Employee Name:</strong> {user.name}</div>
          <div><strong>Employee ID:</strong> {user.id}</div>
          <div><strong>Designation:</strong> {user.designation}</div>
          <div><strong>Experience:</strong> {user.experience}</div>
        </div>
      </div>

      {/* Role Section */}
      <div className="performance-management-role-section">
        <div className="performance-management-role-card-clock">
          <FaClock className="performance-management-role-icon" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="performance-management-fy-dropdown"
          >
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
          <p>April - March</p>
        </div>
        <div className="performance-management-role-card">
          <FaUser className="performance-management-role-icon" />
          <p>Vijay<br /><span>[Manager]</span></p>
        </div>
        <div className="performance-management-role-card">
          <FaUser className="performance-management-role-icon" />
          <p>Priya<br /><span>[HR]</span></p>
        </div>
      </div>

      {/* Goals/Tasks */}
      <div className="performance-management-goals-section">
        <div className="performance-management-goals-header">
          <h3>Goals/Tasks (Assigned by Me)</h3>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : tasks.length === 0 ? (
          <p className="performance-management-no-goals">No tasks assigned by you for {selectedYear}</p>
        ) : (
          <table className="performance-management-goals-table fade-in">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned To</th>
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
                const assignedDate = task.assignedDate ? new Date(task.assignedDate) : today;
                const dueDate = task.dueDate ? new Date(task.dueDate) : today;
                const totalDuration = Math.max(dueDate - assignedDate, 1);
                const elapsed = Math.min(Math.max(today - assignedDate, 0), totalDuration);
                const progress = Math.round((elapsed / totalDuration) * 100);

                return (
                  <React.Fragment key={task._id || task.id}>
                    <tr
                      className="performance-management-task-row"
                      onClick={() => setOpenTaskReview(task._id === openTaskReview ? null : task._id)}
                    >
                      <td>{task.text}</td>
                      <td>{task.assigned}</td>
                      <td>{assignedDate.toLocaleDateString()}</td>
                      <td>{dueDate.toLocaleDateString()}</td>
                      <td>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            style={{ color: i < (task.rating || 0) ? "#ffb400" : "#ccc", marginRight: 2 }}
                          />
                        ))}
                      </td>
                      <td>{task.score || 0} / 5</td>
                      <td>
                        <div className="performance-management-progress-bar">
                          <div
                            className={`progress-fill ${
                              progress >= 100 ? "green" : progress >= 75 ? "yellow" : progress >= 40 ? "orange" : "red"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="performance-management-status-text">{progress >= 100 ? "Completed" : `${progress}%`}</span>
                      </td>
                    </tr>

                    {openTaskReview === task._id && (
                      <tr>
                        <td colSpan="7" className="performance-management-task-review-section">
                          <Reviews task={task} tasks={tasks} setTasks={setTasks} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Overall summary */}
              <tr className="performance-management-overall-row">
                <td colSpan={4} style={{ textAlign: "right", fontWeight: "600" }}>Overall:</td>
                <td>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      style={{ color: i < Math.round(avgRating) ? "#ffb400" : "#ccc", marginRight: 2 }}
                    />
                  ))}
                </td>
                <td>{totalScore} / {tasks.length * 5}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}

        <div className="performance-management-add-task-wrapper">
          <button
            className="performance-management-add-task-btn"
            onClick={() => setShowTaskModal(true)}
            disabled={selectedYear !== currentFY}
          >
            Add Task
          </button>
        </div>

        {showTaskModal && (
          <div className="performance-management-modal-overlay" onClick={() => setShowTaskModal(false)}>
            <div className="performance-management-modal-content" onClick={(e) => e.stopPropagation()}>
              <Task selectedFY={selectedYear} onUpdate={updateTasks} />
              <button className="performance-management-close-btn" onClick={() => setShowTaskModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Final Review Section */}
      {reviewData && (
        <div className="performance-management-final-review-container">
          <div
            className="performance-management-final-review-toggle"
            onClick={() => setShowReviewBox(!showReviewBox)}
          >
            <h3>Final Review ({selectedYear})</h3>
            {showReviewBox ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {showReviewBox && (
            <div className="performance-management-final-review fade-in">
              <div className="performance-management-final-left">
                <p className="performance-management-emp-name">{user.name}</p>
                <div className="performance-management-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(reviewData.rating) ? "star" : "half-star"}
                    />
                  ))}
                  <span>{reviewData.rating}</span>
                </div>
                <label className="performance-management-agree-label">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />{" "}
                  I Agree with the Review
                </label>
              </div>

              <div className="performance-management-final-right">
                <h4>Manager Comments</h4>
                <textarea value={reviewData.comments} readOnly />
                <div className="performance-management-btn-box">
                  <button className="performance-management-finalize-btn" disabled={!isFinalizeEnabled}>Finalize Review</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceManagement;
