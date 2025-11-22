import React, { useEffect, useState, useMemo } from "react";
import { FiSearch, FiCheckCircle } from "react-icons/fi";
import "./TrainingAssignment.css";

const LS_KEY = "training_assignments_v1";

const employees = [
  { id: "EMP001", name: "Likith Reddy" },
  { id: "EMP024", name: "Sravani kalisetti" },
  { id: "EMP057", name: "Akshay Kumar" },
  { id: "EMP079", name: " Balaji" },
  { id: "EMP105", name: "Manoj Reddy" },
  { id: "EMP128", name: "Lavanya" },
  { id: "EMP148", name: "Arjun Sai" },
  { id: "EMP171", name: "Eswari" },
  { id: "EMP193", name: "Sushma" },
  { id: "EMP204", name: "Sunita Devi" },
   { id: "EMP215", name: "Vaishnavi" },
  { id: "EMP226", name: "Sudha Rani" },
  { id: "EMP237", name: " Gangadhar" },
  { id: "EMP248", name: " Tataji" },
  { id: "EMP259", name: "Likith" },
  { id: "EMP270", name: "Vignish" },
  { id: "EMP281", name: "Bhargavi" },
  { id: "EMP292", name: "Devi palanati" },
  { id: "EMP303", name: "Somu Sunder" },
  { id: "EMP314", name: "Jagadesh" },
  { id: "EMP325", name: "Karthik" },
  { id: "EMP336", name: "Mahendra" },
  { id: "EMP347", name: "Rohit Sai" },
  { id: "EMP358", name: "Likitha" },
  { id: "EMP369", name: "Deepak Malhotra" },
  { id: "EMP380", name: "Anjali Verma"} ,
  { id: "EMP391", name: "Rajesh Khanna"},
  { id: "EMP402", name: "Sunil Grover"} ,
  { id: "EMP413", name: "Mira Nair"} ,
  { id: "EMP424", name: "Ayesha Takia"} ,
  { id: "EMP435", name: "Karan Johar"} ,
  { id: "EMP446", name: "Priyanka Chopra"} ,
  { id: "EMP457", name: "Salman Khan"} , 
  { id: "EMP468", name: "Alia Bhatt"} ,
  { id: "EMP479", name: "Shah Rukh Khan"} ,
  { id: "EMP490", name: "Katrina Kaif"} ,
];
// 🔹 Department → Projects
const PROJECTS = {
  Engineering: [
    "Website Revamp",
    "API Development",
    "Mobile App",
    "AI Dashboard",
    "System Migration",
    "Automation Script",
  ],
  Finance: [
    "Audit Automation",
    "Billing Optimization",
    "Payroll Accuracy",
    "Budget Forecast Tool",
  ],
  HR: [
    "Recruitment Portal",
    "Employee Survey System",
    "HR Compliance Monitoring",
  ],
  Marketing: [
    "Ad Campaign",
    "SEO Optimization",
    "Brand Redesign",
    "Email Automation",
  ],
  Design: [
    "UI Redesign",
    "Dashboard Prototype",
    "Illustration Pack",
    "Theme Revamp",
  ],
};

// 🔹 Project → Allowed Employees
const PROJECT_EMPLOYEES = {
  "Website Revamp": ["EMP001", "EMP057", "EMP148","EMP215" ],
  "API Development": ["EMP024", "EMP171", "EMP226"],
  "Mobile App": ["EMP105", "EMP128", "EMP237", "EMP358", "EMP369", "EMP380", "EMP391"],
  "AI Dashboard": ["EMP193", "EMP204","EMP248", "EMP259", "EMP270"],
  "System Migration": ["EMP001", "EMP105"],
  "Automation Script": ["EMP057", "EMP193"],

  "Audit Automation": ["EMP193", "EMP281"],
  "Billing Optimization": ["EMP204", "EMP292"],
  "Payroll Accuracy": ["EMP079","EMP303"],
  "Budget Forecast Tool": ["EMP204", "EMP057", "EMP314", "EMP325", "EMP336", "EMP347"],

  "Recruitment Portal": ["EMP128", "EMP402", "EMP413", "EMP424", "EMP435"],
  "Employee Survey System": ["EMP079", "EMP171"],
  "HR Compliance Monitoring": ["EMP024"],

  "Ad Campaign": ["EMP057", "EMP204"],
  "SEO Optimization": ["EMP105"],
  "Brand Redesign": ["EMP171", "EMP001"],
  "Email Automation": ["EMP193", "EMP435", "EMP446"],

  "UI Redesign": ["EMP001", "EMP128", "EMP457", "EMP468"],
  "Dashboard Prototype": ["EMP148", "EMP479", "EMP490"],
  "Illustration Pack": ["EMP171"],
  "Theme Revamp": ["EMP024", "EMP079"],
};
// 🔹 Training → Auto-fill Values
// 🔹 Training → Auto-fill Values (Trainer, Level, Dates, Mode)
const TRAINING_AUTO = {
  "React Basics": {
    trainer: "Vijay Kumar",
    level: "Beginner",
    from: "2025-02-01",
    to: "2025-02-05",
    mode: "Online",
  },
  "Advanced React": {
    trainer: "Jaswanth Kumar",
    level: "Advanced",
    from: "2025-03-10",
    to: "2025-03-15",
    mode: "Offline",
  },
  "JavaScript Essentials": {
    trainer: "Ajay Kumar",
    level: "Intermediate",
    from: "2025-04-01",
    to: "2025-04-05",
    mode: "Online",
  },
  "Communication Skills": {
    trainer: "Divya shree",
    level: "Beginner",
    from: "2025-02-20",
    to: "2025-02-22",
    mode: "Offline",
  },
  "UI/UX Fundamentals": {
    trainer: "Manoj Reddy",
    level: "Intermediate",
    from: "2025-05-01",
    to: "2025-05-05",
    mode: "Online",
  },
};


export default function TrainingAssignment() {
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    department: "",
    project: "",
    trainer: "",
    fromDate: "",
    toDate: "",
    mode: "",
  });

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchEmp, setSearchEmp] = useState("");
  const [errors, setErrors] = useState({});

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [skipSecondCancel, setSkipSecondCancel] = useState(false);
  const [blurActive, setBlurActive] = useState(false);

  const [assignedList, setAssignedList] = useState([]);

  const [tableSearch, setTableSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const [editingAssignedAt, setEditingAssignedAt] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setAssignedList(JSON.parse(raw));
      else localStorage.setItem(LS_KEY, JSON.stringify([]));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(assignedList));
    } catch (e) {}
  }, [assignedList]);

  const pushToast = (msg) => setTimeout(() => alert(msg), 50);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));
  // 🔹 Auto-fill fields based on Training Title
if (name === "title") {
  const auto = TRAINING_AUTO[value];
  if (auto) {
    setFormData((prev) => ({
      ...prev,
      level: auto.level,
      trainer: auto.trainer,
      fromDate: auto.from,
      toDate: auto.to,
      mode: auto.mode, // 🔹 NEW AUTO-FILL FIELD
    }));
  }
}


  // 🔹 Reset project when department changes
  if (name === "department") {
    setFormData((prev) => ({ ...prev, project: "" }));
    setSelectedEmployees([]);
  }

  // 🔹 When project selected → filter employees
  if (name === "project") {
    const allowed = PROJECT_EMPLOYEES[value] || [];
    setSelectedEmployees(allowed);
  }
};

  const handleCheckboxChange = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Training Title is required";
    if (!formData.level) newErrors.level = "Select a level";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.trainer) newErrors.trainer = "Trainer/Manager is required";
    if (!formData.fromDate) newErrors.fromDate = "From Date required";
    if (!formData.toDate) newErrors.toDate = "To Date required";
    if (selectedEmployees.length === 0)
      newErrors.employees = "Select at least one employee";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      pushToast("Fix validation errors");
      return;
    }
    setShowConfirmPopup(true);
    setBlurActive(true);
  };

  const handleCancelClick = () => {
    if (skipSecondCancel) {
      resetAll();
      pushToast("Assignment cancelled");
      return;
    }

    setShowConfirmPopup(false);
    setShowCancelWarning(true);
    setBlurActive(true);
  };

  const confirmCancel = () => {
    resetAll();
    pushToast("Assignment cancelled");
  };

  const closeWarning = () => {
    setShowCancelWarning(false);
    setShowConfirmPopup(true);
    setSkipSecondCancel(true);
    setBlurActive(true);
  };

  const resetAll = () => {
    setShowConfirmPopup(false);
    setShowCancelWarning(false);
    setBlurActive(false);
    setSkipSecondCancel(false);
    setEditingAssignedAt(null);
    setFormData({
      title: "",
      level: "",
      department: "",
      trainer: "",
      fromDate: "",
      toDate: "",
    });
    setSelectedEmployees([]);
  };

  const confirmAndSave = () => {
    try {
      const now = new Date().toISOString();

      if (editingAssignedAt) {
        const updated = assignedList.map((item) =>
          item.assignedAt === editingAssignedAt
            ? {
                ...item,
                id: selectedEmployees[0] || item.id,
                name:
                  employees.find(
                    (e) => e.id === (selectedEmployees[0] || item.id)
                  )?.name || item.name,
                trainingTitle: formData.title,
                level: formData.level,
                department: formData.department,
                trainer: formData.trainer,
                from: formData.fromDate,
                to: formData.toDate,
              }
            : item
        );
        setAssignedList(updated);
        pushToast("Assignment updated");
      } else {
        const newEntries = selectedEmployees.map((id) => {
          const emp = employees.find((e) => e.id === id);
          return {
            id: emp.id,
            name: emp.name,
            trainingTitle: formData.title,
            level: formData.level,
            department: formData.department,
            trainer: formData.trainer,
            from: formData.fromDate,
            to: formData.toDate,
            assignedAt: now + "-" + id,
          };
        });
        setAssignedList((prev) => [...newEntries, ...prev]);
        pushToast("Training assigned successfully");
      }
    } catch (err) {}

    resetAll();
  };

  const handleEdit = (item) => {
    setEditingAssignedAt(item.assignedAt);
    setFormData({
      title: item.trainingTitle,
      level: item.level,
      department: item.department,
      trainer: item.trainer,
      fromDate: item.from,
      toDate: item.to,
    });
    setSelectedEmployees([item.id]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    pushToast("Editing mode enabled");
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Delete ${item.id} - ${item.name}?`)) return;
    setAssignedList((prev) =>
      prev.filter((e) => e.assignedAt !== item.assignedAt)
    );
    pushToast("Assignment deleted");
  };

  const filteredAndSorted = useMemo(() => {
    const q = tableSearch.toLowerCase();
    let f = assignedList.filter((it) =>
      `${it.id} ${it.name} ${it.trainingTitle} ${it.level} ${it.department}`
        .toLowerCase()
        .includes(q)
    );

    if (sortBy) {
      f.sort((a, b) => {
        let A = a[sortBy] ?? "";
        let B = b[sortBy] ?? "";

        if (sortBy === "from" || sortBy === "to") {
          A = new Date(A).getTime();
          B = new Date(B).getTime();
        } else {
          A = String(A).toLowerCase();
          B = String(B).toLowerCase();
        }

        if (A < B) return sortDir === "asc" ? -1 : 1;
        if (A > B) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return f;
  }, [assignedList, tableSearch, sortBy, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / PAGE_SIZE)
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredAndSorted.length, totalPages]);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, currentPage]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((s) => (s === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  return (
    <div className="training-assignment-container">
      {(showConfirmPopup || showCancelWarning) && (
        <div className="blur-overlay" />
      )}

      {/* POPUP */}
      {showConfirmPopup && (
        <div className="success-overlay">
          <div className="success-popup-big">
            <FiCheckCircle className="popup-icon-big" />
            <h3 className="success-title-big">Confirm Training Assignment</h3>

            <div className="popup-details-big">
              <p>
                <strong>Training:</strong> {formData.title}
              </p>
              <p>
                <strong>Level:</strong> {formData.level}
              </p>
              <p>
                <strong>Department:</strong> {formData.department}
              </p>
              <p>
                <strong>Trainer:</strong> {formData.trainer}
              </p>
              <p>
                <strong>From:</strong> {formData.fromDate}
              </p>
              <p>
                <strong>To:</strong> {formData.toDate}
              </p>
            </div>

            <div className="assigned-list-big">
              <h4>Employees</h4>
              {selectedEmployees.map((id) => {
                const emp = employees.find((e) => e.id === id);
                return (
                  <div key={id} className="assigned-emp-row">
                    {emp.id} — {emp.name}
                  </div>
                );
              })}
            </div>

            <div className="popup-buttons">
              <button className="ok-btn-big" onClick={confirmAndSave}>
                OK
              </button>
              <button className="cancel-btn" onClick={handleCancelClick}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECOND CANCEL POPUP */}
      {showCancelWarning && (
        <div className="center-warning-box">
          <div className="warning-inner">
            <h3>Are you sure?</h3>
            <p>You want to cancel this training?</p>

            <div className="popup-buttons">
              <button className="ok-btn" onClick={confirmCancel}>
                Yes
              </button>
              <button className="cancel-btn" onClick={closeWarning}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      <form className={`training-form ${blurActive ? "blur-bg" : ""}`} onSubmit={handleSubmit}>
        <h2>Training Assignment (Multiple Employees)</h2>

        <div className="form-grid">

          {/* TRAINING TITLE DROPDOWN */}
          <div className="form-group">
            <label>Training Title</label>
            <select name="title" value={formData.title} onChange={handleChange}>
              <option value="">Select Training</option>
              <option value="React Basics">React Basics</option>
              <option value="Advanced React">Advanced React</option>
              <option value="JavaScript Essentials">JavaScript Essentials</option>
              <option value="Communication Skills">Communication Skills</option>
              <option value="UI/UX Fundamentals">UI/UX Fundamentals</option>
            </select>
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          {/* LEVEL */}
          <div className="form-group">
            <label>Level</label>
           <input type="text" name="level" value={formData.level} onChange={handleChange} />
            {errors.level && <span className="error-text">{errors.level}</span>}
          </div>

          {/* DEPARTMENT DROPDOWN */}
          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option>Engineering</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Marketing</option>
              <option>Design</option>
            </select>
            {errors.department && (
              <span className="error">{errors.department}</span>
            )}
          </div>
          {/* PROJECT DROPDOWN */}
<div className="form-group">
  <label>Project</label>
  <select
    name="project"
    value={formData.project}
    disabled={!formData.department}
    onChange={handleChange}
  >
    <option value="">Select Project</option>

    {formData.department &&
      PROJECTS[formData.department]?.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
  </select>
</div>


          {/* TRAINER DROPDOWN */}
          <div className="form-group">
            <label>Trainer / Manager</label>
            <input type="text" name="trainer" value={formData.trainer} onChange={handleChange} />
            {errors.trainer && <span className="error-text">{errors.trainer}</span>}
          </div>
          {/* MODE */}
           <div className="form-group">
            <label>Mode</label>
            <input type="text" name="mode" value={formData.mode} onChange={handleChange} />
            {errors.mode && <span className="error-text">{errors.mode}</span>}
          </div>
          {/* FROM */}
          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
            />
            {errors.fromDate && (
              <span className="error">{errors.fromDate}</span>
            )}
          </div>

          {/* TO */}
          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
            />
            {errors.toDate && <span className="error">{errors.toDate}</span>}
          </div>
        </div>

        {/* EMPLOYEE SELECT */}
        <div className="employee-list">
          <h3>Select Employees (Multiple)</h3>

          <div className="employee-search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchEmp}
              onChange={(e) => setSearchEmp(e.target.value)}
            />
          </div>

          <div className="employee-checkboxes">
           {formData.department &&
 formData.project &&
 employees
  .filter((emp) =>
    PROJECT_EMPLOYEES[formData.project]?.includes(emp.id)
  )
  .filter((emp) =>

                (emp.id + " " + emp.name)
                  .toLowerCase()
                  .includes(searchEmp.toLowerCase())
              )
              .map((emp) => {
                const selected = selectedEmployees.includes(emp.id);
                return (
                  <label
                    key={emp.id}
                    className={`employee-row ${selected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleCheckboxChange(emp.id)}
                    />
                    <span className="emp-id">
                      {emp.id} - {emp.name}
                    </span>
                  </label>
                );
              })}
          </div>

          {errors.employees && (
            <span className="error">{errors.employees}</span>
          )}
        </div>

        <div className="button-group">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setShowCancelWarning(true);
              setBlurActive(true);
            }}
          >
            Cancel
          </button>

          <button type="submit" className="assign-btn">
            {editingAssignedAt ? "Update" : "Assign"}
          </button>
        </div>
      </form>

      {/* TABLE SECTION */}
      <div className="assigned-output">
        <div className="assigned-head">
          <h3>Assigned Trainings</h3>

          <div className="table-search-wrap">
            <FiSearch />
            <input
              type="text"
              placeholder="Search..."
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {assignedList.length === 0 ? (
          <p>No assignments yet.</p>
        ) : (
          <>
            <table className="assigned-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>ID</th>
                  <th onClick={() => handleSort("name")}>Name</th>
                  <th onClick={() => handleSort("trainingTitle")}>
                    Training
                  </th>
                  <th onClick={() => handleSort("level")}>Level</th>
                  <th onClick={() => handleSort("department")}>
                    Department
                  </th>
                  <th onClick={() => handleSort("from")}>From</th>
                  <th onClick={() => handleSort("to")}>To</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {pageData.map((item) => (
                  <tr key={item.assignedAt}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.trainingTitle}</td>
                    <td>{item.level}</td>
                    <td>{item.department}</td>
                    <td>{new Date(item.from).toLocaleDateString()}</td>
                    <td>{new Date(item.to).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <div className="pagination">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}



