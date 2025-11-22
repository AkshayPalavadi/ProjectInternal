import React, { useEffect, useState } from "react"; 
import { FiFilter } from "react-icons/fi";
import "./TrainingModule.css";
import { useLocation } from "react-router-dom";

const LS_KEY = "training_assignments_v1";

// 🔹 Static Employee Mapping
// const EMPLOYEE_DATA = {
//   E001: { employeeName: "Ravi Kumar", department: "Frontend", managerName: "Vijay" },
//   E002: { employeeName: "Priya Sharma", department: "Backend", managerName: "Deepa Reddy" },
//   E003: { employeeName: "John Doe", department: "UI/UX", managerName: "Vijay" },
// };

const EMPLOYEE_DATA_ARRAY = [
  { id: "E001", employeeName: "Likith", department: "Front-End Technologies", managerName: "Vijay" },
  { id: "E002", employeeName: "Sushma", department: "Back-End Technologies", managerName: "Vijay" },
  { id: "E003", employeeName: "Devi", department: "UI/UX Designing", managerName: "Vijay" }, 
  { id: "E004", employeeName: "Sravani", department: "Front-End Technologies", managerName: "Vijay" },
  { id: "E005", employeeName: "Gangadhar", department: "Front-End Technologies", managerName: "Vijay" },
  { id: "E006", employeeName: "Tataji", department: "Front-End Technologies", managerName: "Vijay" },
  { id: "E007", employeeName: "Jagadeesh", department: "Back-End Technologies", managerName: "Vijay" },
  { id: "E008", employeeName: "Lavanya", department: "Back-End Technologies", managerName: "Vijay" },
  { id: "E009", employeeName: "Rohit sai", department: "Back-End Technologies", managerName: "Vijay" },
  { id: "E0010", employeeName: "Somu", department: "UI/UX Designing", managerName: "Vijay" },
   
]

// 🔹 Static Training Dates Mapping + MODE added
const TRAINING_DATES = {
  "ReactJS Advanced": { from: "2025-01-10", to: "2025-01-20", level: "Advanced", mode: "Online" },
  "Node.js Essentials": { from: "2025-02-05", to: "2025-02-15", level: "Intermediate", mode: "Offline" },
  "UI/UX Masterclass": { from: "2025-03-01", to: "2025-03-10", level: "Beginner", mode: "Online" },
};

export default function TrainingModule() {
 const {state}= useLocation()
 const department = state?.department || "";

 const employeeData = EMPLOYEE_DATA_ARRAY.filter((emp) => emp.department === department);
 console.log(employeeData)
//  const state = location.state || {};
 console.log(state)
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    managerName: "",
    trainingTitle: "",
    level: "",
    fromDate: "",
    toDate: "",
    mode: "",   // ⭐ NEW FIELD
  });

  const [errors, setErrors] = useState({});
  const [showSuccessBox, setShowSuccessBox] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [blurActive, setBlurActive] = useState(false);
  const [skipSecondCancel, setSkipSecondCancel] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [rowRemovingIndex, setRowRemovingIndex] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setAssignments(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(assignments));
    } catch (e) {}
  }, [assignments]);

  const pushToast = (message, type = "success", timeout = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((t) => [...t, { id, message, type }]);
    if (timeout > 0) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(name, value);

    setFormData((s) => ({ ...s, [name]: value }));
    setErrors((s) => ({ ...s, [name]: "" }));

    // 🔹 Auto-Fill based on Employee ID
    if (name === "employeeId") {
      const emp = employeeData.find((emp) => emp.id === value);
      if (emp) {
        setFormData((prev) => ({
          ...prev,
          employeeName: emp.employeeName,
          department: emp.department,
          managerName: emp.managerName,
        }));
      }
    }

    // 🔹 Auto-Fill based on Training Title (Dates + Level + Mode)
    if (name === "trainingTitle") {
      const dt = TRAINING_DATES[value];
      if (dt) {
        setFormData((prev) => ({
          ...prev,
          fromDate: dt.from,
          toDate: dt.to,
          level: dt.level,
          mode: dt.mode,   // ⭐ AUTO-FILL MODE
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((k) => {
      if (!formData[k]) newErrors[k] = "Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setBlurActive(true);
    setShowSuccessBox(true);
  };

  const confirmAssignment = () => {
    const entry = {
      id: formData.employeeId,
      name: formData.employeeName,
      department: formData.department,
      manager: formData.managerName,
      training: formData.trainingTitle,
      level: formData.level,
      from: formData.fromDate,
      to: formData.toDate,
      mode: formData.mode,     // ⭐ SAVE MODE
      assignedAt: new Date().toISOString(),
    };

    if (editingIndex !== null && editingIndex >= 0) {
      setAssignments((prev) => {
        const copy = [...prev];
        copy[editingIndex] = entry;
        return copy;
      });
      pushToast("Assignment updated", "info");
    } else {
      setAssignments((prev) => [entry, ...prev]);
      pushToast("Training assigned", "success");
    }

    setShowSuccessBox(false);
    setBlurActive(false);
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
      mode: "",   // ⭐ RESET MODE
    });

    setSkipSecondCancel(false);
  };

  const handleCancelClick = () => {
    if (skipSecondCancel) {
      setShowSuccessBox(false);
      setBlurActive(false);
      pushToast("Assignment cancelled", "error");
      setSkipSecondCancel(false);
      return;
    }
    setShowSuccessBox(false);
    setShowCancelWarning(true);
    setBlurActive(true);
  };

  const confirmCancel = () => {
    setShowCancelWarning(false);
    setBlurActive(false);
    pushToast("Assignment cancelled", "error");
    setSkipSecondCancel(false);
  };

  const closeWarning = () => {
    setShowCancelWarning(false);
    setShowSuccessBox(true);
    setBlurActive(true);
    setSkipSecondCancel(true);
  };

  const deleteAssignment = (index) => {
    setRowRemovingIndex(index);
    setTimeout(() => {
      setAssignments((prev) => prev.filter((_, i) => i !== index));
      setRowRemovingIndex(null);
      pushToast("Assignment deleted", "error");
    }, 300);
  };

  const editAssignment = (index) => {
    const a = assignments[index];
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
      mode: a.mode,   // ⭐ LOAD MODE ON EDIT
    });

    setEditingIndex(index);
    pushToast("Editing assignment — update and click Assign", "info", 3500);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeToast = (id) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  const filteredAssignments = assignments.filter((a) => {
    const s = searchTerm.toLowerCase();
    return (
      a.id.toLowerCase().includes(s) ||
      a.name.toLowerCase().includes(s) ||
      a.department.toLowerCase().includes(s) ||
      a.manager.toLowerCase().includes(s) ||
      a.training.toLowerCase().includes(s) ||
      a.level.toLowerCase().includes(s) ||
      a.mode.toLowerCase().includes(s)
    );
  });

  console.log(department)
  console.log(employeeData)

  return (
    <>
      {(showSuccessBox || showCancelWarning) && <div className="blur-overlay"></div>}

      {showSuccessBox && (
        <div className="center-success-box animate-slide">
          <h3>{editingIndex !== null ? "Confirm Update" : "Confirm Training Assignment"}</h3>

          <div className="popup-details">
            <p><strong>ID:</strong> {formData.employeeId}</p>
            <p><strong>Name:</strong> {formData.employeeName}</p>
            <p><strong>Department:</strong> {formData.department}</p>
            <p><strong>Manager:</strong> {formData.managerName}</p>
            <p><strong>Training:</strong> {formData.trainingTitle}</p>
            <p><strong>Level:</strong> {formData.level}</p>
            <p><strong>Mode:</strong> {formData.mode}</p> {/* ⭐ ADDED */}
            <p><strong>From:</strong> {formData.fromDate}</p>
            <p><strong>To:</strong> {formData.toDate}</p>
          </div>

          <div className="popup-buttons">
            <button className="ok-btn" onClick={confirmAssignment}>OK</button>
            <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
      )}

      {showCancelWarning && (
        <div className="center-warning-box animate-slide">
          <h3>Are you sure?</h3>
          <p>You want to cancel this assignment?</p>

          <div className="popup-buttons">
            <button className="ok-btn" onClick={confirmCancel}>Yes, Cancel</button>
            <button className="cancel-btn" onClick={closeWarning}>No</button>
          </div>
        </div>
      )}

      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <div>{t.message}</div>
            <button onClick={() => removeToast(t.id)}>✕</button>
          </div>
        ))}
      </div>

      <div className={`training-form-container ${blurActive ? "blur-bg" : ""}`}>
        <h2 className="form-title">Training Module</h2>

        {/* FORM */}
        <form className="form-grid" onSubmit={handleSubmit}>
          
          {/* Employee Id */}
          <div className="form-group">
            <label>Employee Id</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            >
              <option value="">Select Employee Id</option>
              {
                employeeData.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.id}</option>
                ))
              }
              {/* <option>E001</option>
              <option>E002</option>
              <option>E003</option> */}
            </select>
            {errors.employeeId && <span className="error-text">{errors.employeeId}</span>}
          </div>

          {/* Employee Name */}
          <div className="form-group">
            <label>Employee Name</label>
             <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} />
            {errors.employeeName && <span className="error-text">{errors.employeeName}</span>}
          </div>

          {/* Department */}
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} />
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>

          {/* Manager */}
          <div className="form-group">
            <label>Manager Name</label>
            <input type="text" name="managerName" value={formData.managerName} onChange={handleChange} />
            {errors.managerName && <span className="error-text">{errors.managerName}</span>}
          </div>

          {/* Training Title */}
          <div className="form-group">
            <label>Training Title</label>
            <select
              name="trainingTitle"
              value={formData.trainingTitle}
              onChange={handleChange}
            >
              <option value="">Select Training</option>
              <option>ReactJS Advanced</option>
              <option>Node.js Essentials</option>
              <option>UI/UX Masterclass</option>
            </select>
            {errors.trainingTitle && <span className="error-text">{errors.trainingTitle}</span>}
          </div>

          {/* Level */}
          <div className="form-group">
            <label>Level</label>
            <input type="level" name="level" value={formData.level} onChange={handleChange} />
            {errors.level && <span className="error-text">{errors.level}</span>}
          </div>

          {/* ⭐ MODE READ ONLY FIELD */}
          <div className="form-group">
            <label>Mode</label>
             <input type="text" name="mode" value={formData.mode} onChange={handleChange} />
            {errors.mode && <span className="error-text">{errors.mode}</span>}
          </div>
          {/* From Date */}
          <div className="form-group">
            <label>From Date</label>
            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} />
            {errors.fromDate && <span className="error-text">{errors.fromDate}</span>}
          </div>

          {/* To Date */}
          <div className="form-group">
            <label>To Date</label>
            <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} />
            {errors.toDate && <span className="error-text">{errors.toDate}</span>}
          </div>

          <div className="form-group full-width">
            <button type="submit" className="assign-btn">
              {editingIndex !== null ? "Update / Confirm" : "Assign"}
            </button>
          </div>
        </form>

        {/* ASSIGNMENTS SECTION */}
        <div className="assignments-section">
          <h3>Assigned Trainings</h3>

          {/* SEARCH BAR */}
          <input
            type="text"
            placeholder="Search by ID, Name, Department, Manager, Training..."
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
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Manager</th>
                    <th>Training</th>
                    <th>Level</th>
                    <th>Mode</th> {/* ⭐ NEW COLUMN */}
                    <th>From</th>
                    <th>To</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssignments.map((a, idx) => (
                    <tr key={a.assignedAt}>
                      <td>{a.id}</td>
                      <td>{a.name}</td>
                      <td>{a.department}</td>
                      <td>{a.manager}</td>
                      <td>{a.training}</td>
                      <td>{a.level}</td>
                      <td>{a.mode}</td> {/* ⭐ MODE DISPLAY */}
                      <td>{new Date(a.from).toLocaleDateString("en-GB")}</td>
                      <td>{new Date(a.to).toLocaleDateString("en-GB")}</td>

                      <td className="actions-td">
                        <button
                          type="button"
                          className="table-btn edit-module"
                          onClick={() => editAssignment(assignments.indexOf(a))}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="table-btn delete-module"
                          onClick={() => deleteAssignment(assignments.indexOf(a))}
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
