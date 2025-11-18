import React, { useState, useEffect } from "react";
import { FaUser, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Reviews from "./Reviews.jsx";
import Task from "./Task.jsx";
import "./PerformanceManagement.css";

const PerformanceManagement = () => {
  const [user] = useState({
    name: localStorage.getItem("employeeName") || "",
    id: localStorage.getItem("employeeId") || "",
    department: localStorage.getItem("employeeDepartment") || "",
    experience: localStorage.getItem("employeeExperience") || "",
  });

  const BASE_URL = "https://internal-website-rho.vercel.app";

  // --- Financial Year Logic ---
  const today = new Date();
  const month = today.getMonth(); // 0=Jan
  const year = today.getFullYear();
  const fyStart = month >= 3 ? year : year - 1;
  const fyEnd = fyStart + 1;
  const currentFYLabel = `FY (${String(fyStart).slice(-2)} - ${String(fyEnd).slice(-2)})`;

  const years = [];
  for (let i = fyStart; i >= fyStart - 3; i--) {
    years.push(`FY (${String(i).slice(-2)} - ${String(i + 1).slice(-2)})`);
  }

  const [selectedYear, setSelectedYear] = useState(currentFYLabel);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [openTaskReview, setOpenTaskReview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [finalReviews, setFinalReviews] = useState({});
  const [manager, setManager] = useState({ name: "Manager Name", id: "MGR001" });
  const [hr, setHr] = useState({ name: "HR Name", id: "HR001" });
  const [loadingReview, setLoadingReview] = useState(false);

  // --- Fetch review data from API ---
  useEffect(() => {
    const fetchFinalReview = async () => {
      try {
        setLoadingReview(true);
        const res = await fetch(
          `${BASE_URL}/api/tasks/final-review?fy=${encodeURIComponent(selectedYear)}&employeeId=${encodeURIComponent(user.id)}`
        );

        const data = await res.json();

        if (!res.ok || !data?.review) {
          console.warn("⚠️ No review data found for", selectedYear);
          setFinalReviews((prev) => ({ ...prev, [selectedYear]: null }));
          return;
        }

        const r = data.review;

        // Extract latest manager update from history
        let latestManagerEntry = null;

        if (r.history && Array.isArray(r.history)) {
          const managerUpdates = r.history.filter((h) => h.by === "Manager");
          if (managerUpdates.length > 0) {
            latestManagerEntry = managerUpdates[managerUpdates.length - 1];
          }
        }

        const bandScore =
          latestManagerEntry?.payload?.bandScore || "-";

        const managerComments =
          latestManagerEntry?.payload?.managerComments || "";

        setFinalReviews((prev) => ({
          ...prev,
          [selectedYear]: {
            fy: r.fy || selectedYear,
            employeeId: r.employeeId,
            rating: r.avgRating || 0,
            bandScore,
            comments: managerComments, // <<< read-only manager comments
            empComment: r.empComment || "",
            agree: r.agree || false,
            disagree: r.disagree || false,
            managerFinalizedOn: r.managerFinalizedOn || "",
          },
        }));

      } catch (err) {
        console.error("❌ Error fetching final review:", err);
      } finally {
        setLoadingReview(false);
      }
    };

    if (user.id) fetchFinalReview();
  }, [selectedYear, user.id]);

  // --- Fetch employee tasks for selected FY ---
  useEffect(() => {
    const fetchEmployeeTasks = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/tasks?fy=${encodeURIComponent(selectedYear)}`
        );
        const data = await res.json();

        if (res.ok) {
          const employeeId = localStorage.getItem("employeeId");
          const filtered = (data.tasks || []).filter(
            (t) => String(t.assignedTo) === String(employeeId)
          );
          setTasks(filtered);
          console.log("✅ Loaded tasks for PerformanceManagement:", filtered);
        } else {
          console.error("Error fetching tasks:", data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch tasks:", err);
      }
    };

    if (user.id && selectedYear) {
      fetchEmployeeTasks();
    }
  }, [selectedYear, user.id]);

  const reviewData =
    finalReviews[selectedYear] || {
      fy: selectedYear,
      rating: 0,
      comments: "",
      bandScore: "-",
      agree: false,
      disagree: false,
      empComment: "",
    };

  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  // --- Handlers ---
  const defaultReviewState = {
    fy: selectedYear,
    rating: 0,
    comments: "",
    bandScore: "-",
    agree: false,
    disagree: false,
    empComment: "",
  };

  const handleAgree = () => {
    setFinalReviews((prev) => {
      const current = { ...defaultReviewState, ...(prev[selectedYear] || {}) };
      return {
        ...prev,
        [selectedYear]: {
          ...current,
          agree: !current.agree,
          disagree: false, // force the opposite off
        },
      };
    });
  };

  const handleDisagree = () => {
    setFinalReviews((prev) => {
      const current = { ...defaultReviewState, ...(prev[selectedYear] || {}) };
      return {
        ...prev,
        [selectedYear]: {
          ...current,
          disagree: !current.disagree,
          agree: false, // force the opposite off
        },
      };
    });
  };

  const handleEmpCommentChange = (e) => {
    const newComment = e.target.value;
    setFinalReviews((prev) => ({
      ...prev,
      [selectedYear]: { ...prev[selectedYear], empComment: newComment },
    }));
  };

    // --- Submit review to backend ---
const handleFinalize = async () => {
  const updatedReview = {
    empComment: reviewData.empComment,
    agree: true,
    disagree: false,
  };

  try {
    const res = await fetch(
      `${BASE_URL}/api/tasks/final-review?fy=${encodeURIComponent(selectedYear)}&employeeId=${encodeURIComponent(user.id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReview),
      }
    );

    if (res.ok) {
      alert("Final review submitted!");
    } else {
      alert("Failed to submit review");
    }
  } catch (err) {
    console.error(err);
  }
};

const handleReport = async () => {
  const updatedReview = {
    empComment: reviewData.empComment,
    agree: false,
    disagree: true,
  };

  try {
    const res = await fetch(
      `${BASE_URL}/api/tasks/final-review?fy=${encodeURIComponent(selectedYear)}&employeeId=${encodeURIComponent(user.id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReview),
      }
    );

    if (res.ok) {
      alert("Submitted successfully!");
    } else {
      alert("Failed to update review");
    }
  } catch (err) {
    console.error(err);
  }
};

  // --- Rating ---
  const totalRating = tasks.reduce((sum, t) => sum + (t.rating || 0), 0);
  const avgRating = tasks.length ? (totalRating / tasks.length).toFixed(2) : 0;

  const canFinalize = reviewData.bandScore && reviewData.comments;

  return (
    <div className="performancemanagement-perf-container">
      <h2 className="performancemanagement-page-title">Performance Management</h2>

      {/* Employee Info */}
      <div className="performancemanagement-employee-card">
        <h3>Employee Details</h3>
        <div className="performancemanagement-emp-info">
          <div><strong>Employee Name:</strong> {user.name}</div>
          <div><strong>Employee ID:</strong> {user.id}</div>
          <div><strong>Department:</strong> {user.department}</div>
          <div><strong>Experience:</strong> {user.experience} years</div>
        </div>
      </div>

      {/* FY and Roles */}
      <div className="performancemanagement-role-section">
        <div className="performancemanagement-role-card-clock">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="performancemanagement-fy-dropdown"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <p>April - March</p>
        </div>

        <div className="performancemanagement-role-card">
          <FaUser className="performancemanagement-role-icon-manager" />
          <p>{manager.name}<br /><span>[Manager]</span></p>
        </div>

        <div className="performancemanagement-role-card">
          <FaUser className="performancemanagement-role-icon-hr" />
          <p>{hr.name}<br /><span>[HR]</span></p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="performancemanagement-goals-section">
        <h3 className="performancemanagement-goals-header">Goals / Tasks</h3>
        {tasks.length === 0 ? (
          <p className="performancemanagement-no-goals">No tasks assigned for {selectedYear}</p>
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
              {tasks.map((task, index) => {
                const assigned = new Date(task.assignedDate);
                const due = new Date(task.dueDate);
                const now = new Date();
                const totalDuration = due - assigned;
                const elapsed = now - assigned;
                const progress = totalDuration > 0 ? Math.min((elapsed / totalDuration) * 100, 100) : 0;

                let progressColor = "#f44336";
                if (progress >= 50 && progress < 85) progressColor = "#ffeb3b";
                if (progress >= 85) progressColor = "#4caf50";

                const uniqueKey = task.id || `${task.text}-${index}`;

                return (
                  <React.Fragment key={uniqueKey}>
                    <tr
                      key={`${uniqueKey}-main`}
                      className="performancemanagement-task-row"
                      onClick={() =>
                        setOpenTaskReview(task._id === openTaskReview ? null : task._id)
                      }
                    >
                      <td>{task.text}</td>
                      <td>{task.assignedBy}</td>
                      <td>{task.assignedDate ? task.assignedDate.split("T")[0] : "-"}</td>
                      <td>{task.dueDate ? task.dueDate.split("T")[0] : "-"}</td>
                      <td>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={`star-${uniqueKey}-${i}`}
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

                    {openTaskReview === task._id && (
                      <tr key={`${uniqueKey}-review`}>
                        <td colSpan="6" className="performancemanagement-task-review-section">
                          <Reviews task={task} tasks={tasks} setTasks={updateTasks} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
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

              <h4>Manager Comments</h4>
              <textarea value={reviewData.comments || ""} readOnly />
            </div>

            <div className="performancemanagement-final-right">
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
                value={reviewData.empComment || ""}
                onChange={handleEmpCommentChange}
              />

              {reviewData.agree && (
                <button
                  className="performancemanagement-finalize-btn"
                  onClick={handleFinalize}
                  disabled={!canFinalize}
                >
                  Finalize Review
                </button>
              )}

              {reviewData.disagree && (
                <button
                  className="performancemanagement-report-btn"
                  onClick={handleReport}
                  disabled={!canFinalize}
                >
                  Report to TL
                </button>
              )}

              {/* <button
                className="simulate-btn"
                onClick={() => {
                  const updated = {
                    ...reviewData,
                    bandScore: "A1",
                    comments: "Excellent performance. Consistent delivery and leadership.",
                  };
                  setFinalReviews((prev) => ({ ...prev, [selectedYear]: updated }));
                  alert("Simulated manager input added!");
                }}
              >
                Simulate Manager Input
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceManagement;
