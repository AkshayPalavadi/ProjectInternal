// TrainingModule.jsx
import React, { useEffect, useState } from "react";
import "./TrainingModule.css";
import { useLocation } from "react-router-dom";

/**
 * COPY-PASTE READY file.
 * This is a cleaned, fixed version of your component tailored to the backend response
 * you provided (response shape: { message, tasks: [...] } with each task having _id, employeeId, employeeName, fromDate, toDate, duration, etc).
 *
 * Important:
 * - training-record id = task.backendId = _id from backend.
 * - marks APIs expect training record id (we use backendId/_id everywhere).
 * - When adding an exam we update both modal rows and assignments state.
 */

const calculateDuration = (from, to) => {
  if (!from || !to) return "";
  const d1 = new Date(from);
  const d2 = new Date(to);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return "";
  if (d2 < d1) return "";
  const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
  return `${diffDays} days`;
};

export default function TrainingModule() {
  const { state } = useLocation();
  const department = state?.department || "";

  // backend-driven state
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    managerName: "",
    trainingTitle: "",
    level: "",
    fromDate: "",
    toDate: "",
    mode: "",
    duration: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessBox, setShowSuccessBox] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [skipSecondCancel, setSkipSecondCancel] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [toasts, setToasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Marks modal
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    data: null,
    rows: [],
    recordIndex: null,
  });

  // ------------------ helper: toasts ------------------
  const pushToast = (msg, type = "success", timeout = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, timeout);
  };

  // ------------------ load employees + assigned trainings ------------------
  useEffect(() => {
    fetchEmployees();
    fetchAssignedTrainings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(
        "https://internal-website-rho.vercel.app/api/employees"
      );
      if (!res.ok) {
        pushToast("Failed to load employees (server error)", "error");
        return;
      }
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load employees error:", err);
      pushToast("Failed to load employees (network)", "error");
    }
  };

  const fetchAssignedTrainings = async () => {
    try {
      const res = await fetch(
        "https://internal-website-rho.vercel.app/api/training/assigned/employees"
      );
      if (!res.ok) {
        pushToast("Failed to load assigned trainings", "error");
        return;
      }
      const payload = await res.json();

      // your backend returns: { message: "...", tasks: [ ... ] }
      const rawTasks = Array.isArray(payload.tasks) ? payload.tasks : [];

      const formatted = rawTasks.map((a, idx) => {
        return {
          id: a.employeeId || a.id || `EMP-${idx + 1}`,
          name: a.employeeName || a.name || "Unknown",
          department: a.department || "N/A",
          manager: a.managerName || a.manager || "N/A",
          training: a.trainingTitle || a.training || "N/A",
          level: a.level || "N/A",
          mode: a.mode || "N/A",
          from: a.fromDate || a.from || "",
          to: a.toDate || a.to || "",
          duration: a.duration || calculateDuration(a.fromDate || a.from, a.toDate || a.to),
          // BACKEND IDs
          backendId: a._id || a.backendId || `BACK-${idx + 1}`, // <-- use _id as training record id
          // Keep any marks/exams if provided; normalize to examId/id
          marksData:
            Array.isArray(a.marksData) && a.marksData.length > 0
              ? a.marksData.map((m) => ({
                  id: m.examId ?? m.id ?? m._id ?? Math.random().toString(36).slice(2, 9),
                  exam: m.exam ?? "",
                  marks: m.marks ?? "",
                }))
              : [],
          assignedAt: a.assignedAt || Date.now() + Math.random(),
        };
      });

      setAssignments(formatted);
      pushToast("Assigned trainings loaded", "success");
    } catch (err) {
      console.error("Load assigned trainings error:", err);
      pushToast("Network error while loading assigned trainings", "error");
    }
  };

  // ------------------ form handling ------------------
  const employeeData = employees.filter((emp) =>
    department ? emp.department === department : true
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "employeeId") {
        // when employeeId selected, fetch profile details
        fetchTrainingDetails(value);
      }

      if (name === "fromDate" || name === "toDate") {
        updated.duration = calculateDuration(
          name === "fromDate" ? value : updated.fromDate,
          name === "toDate" ? value : updated.toDate
        );
      }

      return updated;
    });

    setErrors((s) => ({ ...s, [name]: "" }));
  };

  const validateForm = () => {
    const e = {};
    const fieldLabels = {
      employeeId: "Employee ID",
      employeeName: "Employee name",
      department: "Department",
      managerName: "Manager name",
      trainingTitle: "Training title",
      level: "Level",
      mode: "Mode",
      fromDate: "From date",
      toDate: "To date",
      duration: "Duration",
    };

    const order = [
      "employeeId",
      "trainingTitle",
      "level",
      "mode",
      "fromDate",
      "toDate",
    ];

    let firstErrorKey = null;

    order.forEach((key) => {
      const value = formData[key];
      if (!value) {
        if (!firstErrorKey) firstErrorKey = key;
        if (key === "toDate" || key === "fromDate") {
          e[key] = "Please select valid From & To dates";
        } else {
          e[key] = `${fieldLabels[key]} is required`;
        }
      }
    });

    setErrors(e);

    if (firstErrorKey) {
      setTimeout(() => {
        const el = document.querySelector(`[name="${firstErrorKey}"]`);
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (el && el.focus) {
          el.focus();
        }
      }, 0);
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowSuccessBox(true);
  };

  // ------------------ save training ------------------
  const saveTrainingDetails = async () => {
    try {
      const payload = {
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        department: formData.department,
        managerName: formData.managerName,
        trainingTitle: formData.trainingTitle,
        level: formData.level,
        mode: formData.mode,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        duration: formData.duration,
      };

      const response = await fetch(
        "https://internal-website-rho.vercel.app/api/training/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return data; // expected to include created training record with _id
      } else {
        pushToast(data.message || "Failed to save training", "error");
        return null;
      }
    } catch (err) {
      console.error("Save training error:", err);
      pushToast("Server error", "error");
      return null;
    }
  };

  const confirmAssignment = () => {
    saveTrainingDetails().then((created) => {
      if (!created) return;

      const backendId = created._id || created.id || created.backendId;
      const entry = {
        id: formData.employeeId,
        name: formData.employeeName,
        department: formData.department,
        manager: formData.managerName,
        training: formData.trainingTitle,
        level: formData.level,
        from: formData.fromDate,
        to: formData.toDate,
        mode: formData.mode,
        duration: formData.duration,
        assignedAt: Date.now(),
        taskId: backendId,
        backendId: backendId,
        marksData: created.marksData
          ? created.marksData.map((m) => ({
              id: m.examId ?? m.id ?? m._id ?? Math.random().toString(36).slice(2, 9),
              exam: m.exam ?? "",
              marks: m.marks ?? "",
            }))
          : [],
      };

      setAssignments((prev) => [entry, ...prev]);
      pushToast("Training assigned successfully", "success");

      setShowSuccessBox(false);
      setEditingIndex(null);
      setFormData({
        employeeId: "",
        employeeName: "",
        department: "",
        managerName: "",
        trainingTitle: "",
        level: "",
        fromDate: "",
        toDate: "",
        mode: "",
        duration: "",
      });
      setErrors({});
    });
  };

  const handleCancelClick = () => {
    if (skipSecondCancel) {
      setShowSuccessBox(false);
      pushToast("Cancelled", "error");
      setSkipSecondCancel(false);
      return;
    }
    setShowSuccessBox(false);
    setShowCancelWarning(true);
  };

  const confirmCancel = () => {
    setShowCancelWarning(false);
    pushToast("Assignment cancelled", "error");
    setSkipSecondCancel(false);
  };

  const closeWarning = () => {
    setShowCancelWarning(false);
    setShowSuccessBox(true);
    setSkipSecondCancel(true);
  };

  const editAssignment = (i) => {
    const a = assignments[i];
    if (!a) return;
    setFormData({
      employeeId: a.id,
      employeeName: a.name,
      department: a.department,
      managerName: a.manager,
      trainingTitle: a.training,
      level: a.level,
      fromDate: a.from,
      toDate: a.to,
      mode: a.mode,
      duration: a.duration,
    });
    setEditingIndex(i);
    setErrors({});
    pushToast("Editing...", "info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteAssignment = (i) => {
    const a = assignments[i];
    // optionally call backend delete API here if exists
    setAssignments(assignments.filter((_, idx) => idx !== i));
    pushToast("Assignment deleted", "error");
  };

  const filteredAssignments = assignments.filter((a) => {
    const s = searchTerm.toLowerCase();
    return (
      a.id?.toLowerCase().includes(s) ||
      a.name?.toLowerCase().includes(s) ||
      a.training?.toLowerCase().includes(s)
    );
  });

  const handleReset = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      department: "",
      managerName: "",
      trainingTitle: "",
      level: "",
      fromDate: "",
      toDate: "",
      mode: "",
      duration: "",
    });
    setErrors({});
    pushToast("Form reset", "info");
  };

  // ------------------ MARKS modal handlers ------------------
  const openDetailsModal = (record) => {
    const idx = assignments.findIndex((x) => x.assignedAt === record.assignedAt);
    if (idx === -1) return;
    const existingRows = assignments[idx].marksData || [];
    const rows =
      existingRows.length > 0
        ? existingRows.map((row, index) => ({
            id: row.id ?? index + 1,
            exam: row.exam || "",
            marks: row.marks || "",
          }))
        : [
            {
              id: Math.random().toString(36).slice(2, 9),
              exam: "",
              marks: "",
            },
          ];

    setDetailsModal({
      open: true,
      data: {
        ...record,
        // ensure training record id is available
        taskId: record.taskId || record.backendId || record.backendId,
      },
      rows,
      recordIndex: idx,
    });
  };

  const closeMarksModal = () => {
    setDetailsModal({ open: false, data: null, rows: [], recordIndex: null });
  };

  // update a single marks row locally + backend
  const handleMarksRowChange = async (rowId, field, value) => {
    // optimistic UI update for modal rows
    setDetailsModal((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
    }));

    // backend update only if row has an examId (meaning it's persisted). Otherwise it's a local/new row.
    const examId = rowId;
    const taskId = detailsModal.data?.taskId || detailsModal.data?.backendId;

    if (!taskId) return;

    // if this row is newly created on frontend and not yet persisted, don't call update endpoint
    const isNewLocalRow = String(examId).startsWith("tmp_") || String(examId).length < 6;
    // The backend route expects something like: /api/training/:taskId/update-exam/:examId
    if (isNewLocalRow) return;

    try {
      await fetch(
        `https://internal-website-rho.vercel.app/api/training/${taskId}/update-exam/${examId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        }
      );
      // optionally handle response
    } catch (err) {
      console.error("Update exam error:", err);
    }
  };

  // add new exam row (persist to backend then update both modal and assignments)
  const addMarksRow = async () => {
    const taskId = detailsModal.data?.taskId || detailsModal.data?.backendId;

    if (!taskId) {
      pushToast("No training id found for this record", "error");
      return;
    }

    try {
      const res = await fetch(
        `https://internal-website-rho.vercel.app/api/training/${taskId}/add-exam`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exams: "", marks: "" }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        pushToast(data.message || "Failed to add exam", "error");
        return;
      }

      // Backend returns an exam id — attempt to read it
      const examId = data.examId ?? data.id ?? data._id ?? Math.random().toString(36).slice(2, 9);

      // update detailsModal rows
      setDetailsModal((prev) => ({
        ...prev,
        rows: [
          ...prev.rows,
          {
            id: examId,
            exam: "",
            marks: "",
          },
        ],
      }));

      // Also update assignments state so UI table shows the new exam immediately
      setAssignments((prev) => {
        const copy = [...prev];
        const idx = detailsModal.recordIndex;
        if (idx === null || idx === undefined || !copy[idx]) return copy;
        const existing = Array.isArray(copy[idx].marksData) ? copy[idx].marksData.slice() : [];
        existing.push({ id: examId, exam: "", marks: "" });
        copy[idx] = { ...copy[idx], marksData: existing };
        return copy;
      });

      pushToast("Exam added", "success");
    } catch (err) {
      console.error("Add exam error:", err);
      pushToast("Server error while adding exam", "error");
    }
  };

  const removeMarksRow = async (rowId) => {
    const taskId = detailsModal.data?.taskId || detailsModal.data?.backendId;

    if (!taskId) {
      pushToast("No training id found", "error");
      return;
    }

    try {
      const res = await fetch(
        `https://internal-website-rho.vercel.app/api/training/${taskId}/delete-exam/${rowId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        pushToast("Failed to delete exam", "error");
        return;
      }

      // remove from modal rows
      setDetailsModal((prev) => ({
        ...prev,
        rows: prev.rows.filter((r) => r.id !== rowId),
      }));

      // remove from assignments state
      setAssignments((prev) => {
        const copy = [...prev];
        const idx = detailsModal.recordIndex;
        if (idx === null || idx === undefined || !copy[idx]) return copy;
        copy[idx] = {
          ...copy[idx],
          marksData: copy[idx].marksData.filter((r) => r.id !== rowId),
        };
        return copy;
      });

      pushToast("Exam deleted", "success");
    } catch (err) {
      console.error("Delete exam error:", err);
      pushToast("Server error while deleting exam", "error");
    }
  };

  // Save all rows to backend in one request (update-exams)
 const saveMarksForEmployee = async () => {
  const index = detailsModal.recordIndex;
  if (index === null || index === undefined) return;

  const taskId = detailsModal.data?.taskId || detailsModal.data?.backendId;
  if (!taskId) {
    pushToast("No training id found", "error");
    return;
  }

  for (const row of detailsModal.rows) {
    const payload = {
      exams: row.exam,
      marks: row.marks
    };

    const res = await fetch(
      `https://internal-website-rho.vercel.app/api/training/${taskId}/add-exam`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      pushToast(data.message || "Failed to save marks", "error");
      return;
    }
  }

  pushToast("Marks saved successfully!", "success");
  closeMarksModal();
  fetchAssignedTrainings();
};


  // Fetch employee profile details by employeeId (used when selecting employeeId)
  const fetchTrainingDetails = async (empId) => {
    if (!empId) return;
    try {
      const response = await fetch(
        `https://internal-website-rho.vercel.app/api/training/employee/${empId}/details`
      );

      if (!response.ok) {
        pushToast("Employee details not found on server", "error");
        return;
      }

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        employeeName: data.employeeName || prev.employeeName || "",
        department: data.department || prev.department || "",
        managerName: data.managerName || prev.managerName || "",
      }));

      pushToast("Employee details loaded", "success");
    } catch (err) {
      console.error("Fetch employee details error:", err);
      pushToast("Failed to connect to server", "error");
    }
  };

  // ------------------ Render ------------------
  return (
    <>
      {(showSuccessBox || showCancelWarning || detailsModal.open) && (
        <>
          <div className="background-blur"></div>
          <div className="overlay-dark"></div>
        </>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessBox && (
        <div className="center-success-box animate-slide">
          <h3>Confirm Training Assignment</h3>

          <div className="popup-details">
            <p>
              <strong>ID:</strong> {formData.employeeId}
            </p>
            <p>
              <strong>Name:</strong> {formData.employeeName}
            </p>
            <p>
              <strong>Department:</strong> {formData.department}
            </p>
            <p>
              <strong>Manager:</strong> {formData.managerName}
            </p>
            <p>
              <strong>Training:</strong> {formData.trainingTitle}
            </p>
            <p>
              <strong>Level:</strong> {formData.level}
            </p>
            <p>
              <strong>Mode:</strong> {formData.mode}
            </p>
            <p>
              <strong>From:</strong> {formData.fromDate}
            </p>
            <p>
              <strong>To:</strong> {formData.toDate}
            </p>
            <p>
              <strong>Duration:</strong> {formData.duration}
            </p>
          </div>

          <div className="popup-buttons">
            <button className="ok-btn" onClick={confirmAssignment}>
              OK
            </button>
            <button className="cancel-btn" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CANCEL WARNING */}
      {showCancelWarning && (
        <div className="center-warning-box animate-slide">
          <h3>Are you sure?</h3>
          <p>You want to cancel this assignment?</p>

          <div className="popup-buttons">
            <button className="ok-btn" onClick={confirmCancel}>
              Yes
            </button>
            <button className="cancel-btn" onClick={closeWarning}>
              No
            </button>
          </div>
        </div>
      )}

      {/* MARKS / PERFORMANCE MODAL */}
      {detailsModal.open && (
        <div className="marks-modal">
          <div className="marks-modal-content">
            <div className="marks-modal-header">
              <div>
                <h3>Training Performance</h3>
                <p className="marks-subtitle">
                  Capture exam-wise marks & evaluation for this employee.
                </p>
              </div>
              <button className="marks-close-btn" onClick={closeMarksModal}>
                ✕
              </button>
            </div>

            {detailsModal.data && (
              <div className="marks-meta">
                <div>
                  <span className="meta-label">Employee</span>
                  <span className="meta-value">
                    {detailsModal.data.name} ({detailsModal.data.id})
                  </span>
                </div>
                <div>
                  <span className="meta-label">Department</span>
                  <span className="meta-value">{detailsModal.data.department}</span>
                </div>
                <div>
                  <span className="meta-label">Training</span>
                  <span className="meta-value">{detailsModal.data.training}</span>
                </div>
              </div>
            )}

            <div className="marks-rows-wrapper">
              <div className="marks-rows-header">
                <span className="col-course">Exam / Topic</span>
                <span className="col-marks">Marks (%)</span>
                <span className="col-actions">Remove</span>
              </div>

              {detailsModal.rows.map((row) => (
                <div key={row.id} className="marks-row">
                  <input
                    type="text"
                    className="marks-input course-input"
                    placeholder="e.g. React Basics"
                    value={row.exam}
                    onChange={(e) => handleMarksRowChange(row.id, "exam", e.target.value)}
                  />
                  <input
                    type="number"
                    className="marks-input marks-input-field"
                    placeholder="0 - 100"
                    min={0}
                    max={100}
                    value={row.marks}
                    onChange={(e) => handleMarksRowChange(row.id, "marks", e.target.value)}
                  />
                  <button
                    type="button"
                    className="row-remove-btn"
                    onClick={() => removeMarksRow(row.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button type="button" className="add-row-btn" onClick={addMarksRow}>
                + Add Exam & Marks
              </button>
            </div>

            <div className="marks-footer">
              <button type="button" className="save-marks-btn" onClick={saveMarksForEmployee}>
  Save Marks
</button>

              <button type="button" className="cancel-marks-btn" onClick={closeMarksModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <span>{t.msg}</span>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* FORM CONTAINER */}
      <div className="training-form-container">
        <h2 className="form-title">Training Module</h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          {/* Employee Id */}
          <div className="form-group">
            <label>Employee Id</label>
            <input
              type="text"
              name="employeeId"
              list="empList"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Search or select ID"
              className={errors.employeeId ? "input-error" : ""}
            />
            <datalist id="empList">
              {employeeData.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employeeName}
                </option>
              ))}
            </datalist>
            {errors.employeeId && <span className="error-text">{errors.employeeId}</span>}
          </div>

          {/* Employee Name */}
          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              className={errors.employeeName ? "input-error" : ""}
            />
            {errors.employeeName && <span className="error-text">{errors.employeeName}</span>}
          </div>

          {/* Department */}
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? "input-error" : ""}
            />
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>

          {/* Manager Name */}
          <div className="form-group">
            <label>Manager Name</label>
            <input
              type="text"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
              className={errors.managerName ? "input-error" : ""}
            />
            {errors.managerName && <span className="error-text">{errors.managerName}</span>}
          </div>

          {/* Training Title */}
          <div className="form-group">
            <label>Training Title</label>
            <input
              type="text"
              name="trainingTitle"
              list="trainingList"
              value={formData.trainingTitle}
              onChange={handleChange}
              className={errors.trainingTitle ? "input-error" : ""}
            />
            <datalist id="trainingList">
              <option value="React Js " />
              <option value="Node Js " />
              <option value="UI/UX Design" />
              <option value="React Native " />
            </datalist>
            {errors.trainingTitle && <span className="error-text">{errors.trainingTitle}</span>}
          </div>

          {/* Level */}
          <div className="form-group">
            <label>Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={errors.level ? "input-error" : ""}
            >
              <option value="">Select</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            {errors.level && <span className="error-text">{errors.level}</span>}
          </div>

          {/* Mode */}
          <div className="form-group">
            <label>Mode</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className={errors.mode ? "input-error" : ""}
            >
              <option value="">Select</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Hybrid</option>
            </select>
            {errors.mode && <span className="error-text">{errors.mode}</span>}
          </div>

          {/* From Date */}
          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className={errors.fromDate ? "input-error" : ""}
            />
            {errors.fromDate && <span className="error-text">{errors.fromDate}</span>}
          </div>

          {/* To Date */}
          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className={errors.toDate ? "input-error" : ""}
            />
            {errors.toDate && <span className="error-text">{errors.toDate}</span>}
          </div>

          {/* Duration */}
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              readOnly
              className={errors.duration ? "input-error" : ""}
            />
            {errors.duration && <span className="error-text">{errors.duration}</span>}
          </div>

          {/* Buttons */}
          <div className="form-group full-width buttons-row">
            <button type="submit" className="assign-btn">
              {editingIndex !== null ? "Update" : "Assign"}
            </button>
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        <div className="assignments-section">
          <h3>Assigned Trainings</h3>

          <input
            type="text"
            placeholder="Search…"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredAssignments.length === 0 ? (
            <p className="muted">No matching assignments.</p>
          ) : (
            <div className="table-wrap">
              <table className="assignments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Manager</th>
                    <th>Training</th>
                    <th>Level</th>
                    <th>Mode</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssignments.map((a) => (
                    <tr key={a.backendId}>

                      <td>{a.id}</td>
                      <td>
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => openDetailsModal(a)}
                        >
                          {a.name}
                        </button>
                      </td>
                      <td>{a.department}</td>
                      <td>{a.manager}</td>
                      <td>{a.training}</td>
                      <td>{a.level}</td>
                      <td>{a.mode}</td>
                      <td>{a.from ? new Date(a.from).toLocaleDateString() : ""}</td>
                      <td>{a.to ? new Date(a.to).toLocaleDateString() : ""}</td>
                      <td>{a.duration}</td>
                      <td>
                        <button
                          className="edit-module"
                          onClick={() => {
                            const idx = assignments.findIndex((x) => x.assignedAt === a.assignedAt);
                            if (idx !== -1) editAssignment(idx);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-module"
                          onClick={() => {
                            const idx = assignments.findIndex((x) => x.assignedAt === a.assignedAt);
                            if (idx !== -1) deleteAssignment(idx);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
