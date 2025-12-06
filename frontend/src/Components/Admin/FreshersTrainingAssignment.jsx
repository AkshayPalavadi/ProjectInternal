import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";

import "./FreshersTrainingAssignment.css";
// Fetch all training categories & courses
async function fetchTrainingPack() {
  const res = await fetch("https://internal-website-rho.vercel.app/api/training/departments");
  return res.json();
}

// Fetch all employees
async function fetchEmployees() {
  const res = await fetch(`https://internal-website-rho.vercel.app/api/training/departments/:deparmentname)/employees`);
  return res.json();
}

// API: CREATE TRAINING ASSIGNMENT
async function createTrainingAssignment(payload) {
  try {
    const response = await fetch("https://internal-website-rho.vercel.app/api/training/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("API RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data.message || "API error");
    }

    return data;
  } catch (err) {
    console.error("Create Assignment Error:", err);
    throw err;
  }
}


const LS_KEY = "freshers_training_v2";

/* TRAINING PACK */

function getBatchFromDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const STATUS_OPTIONS = ["Not Started", "In Progress", "Completed"];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* EMPLOYEE MASTER DATA */
// Dynamic fetched data
// const [trainingPack, setTrainingPack] = useState([]);
// const [allEmployees, setAllEmployees] = useState([]);

// Category → employees


/* Helper – time-based progress */
function calculateTimeBasedProgress(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 0;

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const today = new Date();

  if (isNaN(start) || isNaN(end) || end <= start) return 0;

  const total = end - start;
  const elapsed = today - start;

  let p = Math.round((elapsed / total) * 100);
  if (p < 0) p = 0;
  if (p > 100) p = 100;

  return p;
}

/* Manual status → progress */
function progressFromStatus(status) {
  if (status === "Completed") return 100;
  if (status === "In Progress") return 50;
  return 0;
}

/* ======================= MAIN COMPONENT ======================= */
export default function FreshersTrainingAssignment() {
    // Dynamic data
       const [trainingPack, setTrainingPack] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
  async function loadData() {
    try {
      const pack = await fetchTrainingPack();
      const employees = await fetchEmployees();

      console.log("Fetched Training Pack:", pack);
      console.log("Fetched Employees:", employees);

      setTrainingPack(pack.departments || []);
      setAllEmployees(employees.data || []);
    } catch (e) {
      console.error("Failed loading data:", e);
    }
  }

  loadData();
}, []);
 
  /* SINGLE ASSIGN STATE */
  const [form, setForm] = useState({
    fresherName: "",
    fresherId: "",
    batch: "",
    trainingCategory: "",
    selectedCourses: [],
    trainingStartDate: "",
    trainingEndDate: "",
    durationDays: 0,
    Mode: "",
  });

  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  /* BULK ASSIGN STATE */
  const [bulkAssignCategory, setBulkAssignCategory] = useState("");
  const [selectedBulkEmployees, setSelectedBulkEmployees] = useState([]);
  const [bulkSearch, setBulkSearch] = useState("");

  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkEndDate, setBulkEndDate] = useState("");
  const [bulkDurationDays, setBulkDurationDays] = useState(0);
  const [bulkBatch, setBulkBatch] = useState("");
  const [bulkMode, setBulkMode] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  /* ⭐ MARKS / PERFORMANCE POPUP STATE (Option A) */
  const [showMarksPopup, setShowMarksPopup] = useState(false);
  const [activeMarksIndex, setActiveMarksIndex] = useState(null);
  const [marksRows, setMarksRows] = useState([{ id: 1, exam: "", marks: "" }]);
  // INSIDE component ↓↓↓
const employeesForCategory = useMemo(() => {
  if (!form.trainingCategory) return [];
  return allEmployees.filter(emp => emp.category === form.trainingCategory);
}, [form.trainingCategory, allEmployees]);


  /* LOAD assignments from storage */
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) || [];

      const migrated = parsed.map((a) => {
        const progress = calculateTimeBasedProgress(
          a.trainingStartDate,
          a.trainingEndDate
        );

        let status = a.status || "Not Started";
        if (!a.status) {
          if (progress >= 100) status = "Completed";
          else if (progress > 0) status = "In Progress";
        }

        return { ...a, progress, status };
      });

      setAssignments(migrated);
    } catch {
      setAssignments([]);
    }
  }, []);

  /* AUTO UPDATE PROGRESS EVERY PAGE LOAD */
  useEffect(() => {
    const updated = assignments.map((a) => {
      const progress = calculateTimeBasedProgress(
        a.trainingStartDate,
        a.trainingEndDate
      );

      let status = a.status;

      if (progress >= 100) status = "Completed";
      else if (progress > 0) status = "In Progress";
      else status = "Not Started";

      return { ...a, progress, status };
    });

    if (updated.length > 0) {
      setAssignments(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* DAILY PROGRESS RECALCULATION */
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = assignments.map((a) => {
        const progress = calculateTimeBasedProgress(
          a.trainingStartDate,
          a.trainingEndDate
        );

        let status = "Not Started";
        if (progress >= 100) status = "Completed";
        else if (progress > 0) status = "In Progress";

        return { ...a, progress, status };
      });

      setAssignments(updated);
    }, 86400000); // every 24 hours

    return () => clearInterval(timer);
  }, [assignments]);

  /* SAVE to LS */
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(assignments));
  }, [assignments]);

  /* EMPLOYEE OPTIONS for selected category */

  const filteredEmployeeOptions = useMemo(() => {
    const s = employeeSearch.toLowerCase();
    return employeesForCategory.filter(
      (e) =>
        e.id.toLowerCase().includes(s) ||
        e.name.toLowerCase().includes(s)
    );
  }, [employeesForCategory, employeeSearch]);

  /* HANDLE FORM CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updated = { ...prev, [name]: value };

      /* RESET when category changes */
      if (name === "trainingCategory") {
        const pack = trainingPack.find((p) => p.category === value);


        updated.selectedCourses = pack ? pack.items : [];
        updated.fresherId = "";
        updated.fresherName = "";
        updated.batch = "";
        updated.trainingStartDate = "";
        updated.trainingEndDate = "";
        updated.durationDays = 0;

        setEmployeeSearch("");
      }

      /* Recalculate duration + batch from dates */
      if (name === "trainingStartDate" || name === "trainingEndDate") {
        if (name === "trainingStartDate") {
          updated.batch = getBatchFromDate(value);
        }

        if (updated.trainingStartDate && updated.trainingEndDate) {
          const d1 = new Date(updated.trainingStartDate);
          const d2 = new Date(updated.trainingEndDate);

          updated.durationDays = Math.ceil(
            (d2 - d1) / (1000 * 60 * 60 * 24)
          );
        } else {
          updated.durationDays = 0;
        }
      }

      return updated;
    });
  };

  /* USER SELECTS EMPLOYEE (single assign) */
  const handleEmployeeSelect = (e) => {
    const id = e.target.value;

    const emp = employeesForCategory.find((x) => x.id === id);
    if (!emp) return;

    // ONLY auto-fill ID & NAME
    setForm((prev) => ({
      ...prev,
      fresherId: emp.id,
      fresherName: emp.name,
      batch: "",
      trainingStartDate: "",
      trainingEndDate: "",
      durationDays: 0,
    }));
  };

  /* VALIDATE SINGLE FORM (Mode required) */
  const validateSingle = () =>
    !!(
      form.fresherName &&
      form.fresherId &&
      form.batch &&
      form.trainingCategory &&
      form.trainingStartDate &&
      form.trainingEndDate &&
      form.Mode
    );

  /* SUBMIT SINGLE ASSIGNMENT */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateSingle()) {
      alert("Please fill all required fields including Mode");
      return;
    }
    setShowConfirm(true);
  };

  /* CONFIRM SINGLE ASSIGN */
  const confirmAssignment = async () => {
  const progress = calculateTimeBasedProgress(
    form.trainingStartDate,
    form.trainingEndDate
  );

  let status = "Not Started";
  if (progress >= 100) status = "Completed";
  else if (progress > 0) status = "In Progress";

  const data = {
    ...form,
    progress,
    status,
    isBulk: false,
    assignedDate: new Date().toISOString(),
  };

  // 🔥 CALL API
  try {
    const apiRes = await createTrainingAssignment(data);
    console.log("SINGLE CREATE SUCCESS:", apiRes);
  } catch (err) {
    alert("API Error: " + err.message);
    return;
  }

  // Add to UI after API success
  if (editingIndex !== null) {
    const updated = [...assignments];
    updated[editingIndex] = data;
    setAssignments(updated);
    setEditingIndex(null);
  } else {
    setAssignments((prev) => [data, ...prev]);
  }

  setShowConfirm(false);

  // Reset form
  setForm({
    fresherName: "",
    fresherId: "",
    batch: "",
    trainingCategory: "",
    selectedCourses: [],
    trainingStartDate: "",
    trainingEndDate: "",
    durationDays: 0,
    Mode: "",
  });
};


  /* ========== BULK ASSIGN LOGIC ========== */

  const bulkEmployeesForCategory = useMemo(() => {
  if (!bulkAssignCategory) return [];
  return allEmployees.filter(
    emp => emp.category === bulkAssignCategory
  );
}, [bulkAssignCategory, allEmployees]);


  const bulkFilteredEmployees = useMemo(() => {
    const s = bulkSearch.toLowerCase();
    return bulkEmployeesForCategory.filter(
      (e) =>
        e.id.toLowerCase().includes(s) ||
        e.name.toLowerCase().includes(s)
    );
  }, [bulkSearch, bulkEmployeesForCategory]);

  const bulkCoursesForCategory = useMemo(() => {
    if (!bulkAssignCategory) return [];
    const pack = trainingPack.find(p => p.category === bulkAssignCategory);

    return pack ? pack.items : [];
  }, [bulkAssignCategory]);

  /* When Bulk Start / End change → recalc duration & batch */
  useEffect(() => {
    if (bulkStartDate && bulkEndDate) {
      const d1 = new Date(bulkStartDate);
      const d2 = new Date(bulkEndDate);
      if (!isNaN(d1) && !isNaN(d2) && d2 >= d1) {
        const days = Math.ceil(
          (d2 - d1) / (1000 * 60 * 60 * 24)
        );
        setBulkDurationDays(days);
      } else {
        setBulkDurationDays(0);
      }
    } else {
      setBulkDurationDays(0);
    }

    if (bulkStartDate) {
      const d = new Date(bulkStartDate);
      if (!isNaN(d)) {
        const monthName = MONTHS[d.getMonth()];
        const year = d.getFullYear();
        setBulkBatch(`${monthName} ${year}`);
      } else {
        setBulkBatch("");
      }
    } else {
      setBulkBatch("");
    }
  }, [bulkStartDate, bulkEndDate]);

  /* BULK AUTO ASSIGN */
 const handleBulkAutoAssign = () => {
    if (!bulkAssignCategory)
      return alert("Select training category first");
    if (!bulkStartDate || !bulkEndDate)
      return alert("Please select bulk Start Date and End Date");
    if (!bulkMode)
      return alert("Please select Mode for bulk assignment");
    if (selectedBulkEmployees.length === 0)
      return alert("Please select employees");

    const d1 = new Date(bulkStartDate);
    const d2 = new Date(bulkEndDate);
    if (d2 < d1) {
      alert("End Date should be after Start Date");
      return;
    }

    const empList = allEmployees.filter(
  emp => emp.category === bulkAssignCategory
);


    const pack =
      trainingPack.find((p) => p.category === bulkAssignCategory) || {
        items: [],
      };

    const progress = calculateTimeBasedProgress(
      bulkStartDate,
      bulkEndDate
    );

    let status = "Not Started";
    if (progress >= 100) status = "Completed";
    else if (progress > 0) status = "In Progress";

    const newItems = selectedBulkEmployees
      .map((id) => {
        const emp = empList.find((e) => e.id === id);
        if (!emp) return null;

        return {
          fresherId: emp.id,
          fresherName: emp.name,
          batch: bulkBatch,
          trainingCategory: bulkAssignCategory,
          selectedCourses: pack.items,
          progress,
          status,
          isBulk: true,
          Mode: bulkMode,
          assignedDate: new Date().toISOString(),
          trainingStartDate: bulkStartDate,
          trainingEndDate: bulkEndDate,
          durationDays: bulkDurationDays,
        };
      })
      .filter(Boolean);

    setAssignments((prev) => [...newItems, ...prev]);
    setSelectedBulkEmployees([]);
    setBulkSearch("");
    setBulkMode("");
    alert("Bulk Assigned Successfully!");
  }; 

  /* UPDATE STATUS (manual) – not used in UI now, but kept */
  const updateStatus = (index, status) => {
    const updated = [...assignments];
    updated[index].status = status;
    updated[index].progress = progressFromStatus(status);
    setAssignments(updated);
  };

  /* EDIT SINGLE ASSIGNMENT */
  const startEdit = (index) => {
    const a = assignments[index];

    setForm({
      fresherName: a.fresherName,
      fresherId: a.fresherId,
      batch: a.batch,
      trainingCategory: a.trainingCategory,
      selectedCourses: a.selectedCourses || [],
      trainingStartDate: a.trainingStartDate || "",
      trainingEndDate: a.trainingEndDate || "",
      durationDays: a.durationDays || 0,
      Mode: a.Mode || "",
    });

    setEmployeeSearch(a.fresherId || "");
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* FILTER TABLE (search + category filter) */
  const filtered = assignments.filter((a) => {
    const s = search.toLowerCase();

    const matchesSearch =
      a.fresherName.toLowerCase().includes(s) ||
      a.fresherId.toLowerCase().includes(s) ||
      a.trainingCategory.toLowerCase().includes(s);

    const matchesCategory =
      categoryFilter === "All" || a.trainingCategory === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  /* AVG PROGRESS BY CATEGORY (unused chart) */
  const avgProgressByCategory = useMemo(() => {
    const categoryMap = {};

    assignments.forEach((record) => {
      const cat = record.trainingCategory;
      if (!cat) return;

      if (!categoryMap[cat]) {
        categoryMap[cat] = {
          totalProgress: 0,
          totalEmployees: 0,
        };
      }

      categoryMap[cat].totalProgress += record.progress || 0;
      categoryMap[cat].totalEmployees++;
    });

    return Object.keys(categoryMap).map((cat) => {
      const { totalProgress, totalEmployees } = categoryMap[cat];
      return {
        category: cat,
        avg: Math.round(totalProgress / totalEmployees) || 0,
      };
    });
  }, [assignments]);

  /* EXCEL EXPORT: ALL ASSIGNMENTS */
  const exportToExcel = () => {
    if (assignments.length === 0) {
      alert("No data to export!");
      return;
    }

    const exportData = assignments.map((a, index) => ({
      S_No: index + 1,
      Fresher_ID: a.fresherId,
      Fresher_Name: a.fresherName,
      Training_Category: a.trainingCategory,
      Batch: a.batch,
      Courses_Assigned: (a.selectedCourses || []).join(", "),
      Start_Date: a.trainingStartDate,
      End_Date: a.trainingEndDate,
      Duration_Days: a.durationDays,
      Mode: a.Mode,
      Progress: (a.progress ?? 0) + "%",
      Status: a.status,
      Assigned_Date: a.assignedDate
        ? new Date(a.assignedDate).toLocaleDateString()
        : "",
      Assigned_Type: a.isBulk ? "Bulk" : "Single",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Training_Assignments");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "Freshers_Training_Assignments.xlsx");
  };

  /* BLANK TEMPLATE EXPORT – kept if needed */
  const downloadBlankTemplate = () => {
    const template = [
      {
        "S.No": "",
        "Fresher ID": "",
        "Fresher Name": "",
        "Training Category": "",
        "Batch": "",
        "Courses Assigned": "",
        "Start Date": "",
        "End Date": "",
        "Duration (Days)": "",
        "Progress (%)": "",
        "Status": "",
        "Assigned Date": "",
        "Assigned Type": "",
        "Mode": "",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Blank Template");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "Freshers_Training_Blank_Template.xlsx");
  };

  /* ================= MARKS POPUP HELPERS (Option A) ================= */

  const openMarksPopup = (assignmentIndex) => {
    const rec = assignments[assignmentIndex];
    if (!rec) return;

    setActiveMarksIndex(assignmentIndex);

    if (Array.isArray(rec.marksData) && rec.marksData.length > 0) {
      const mapped = rec.marksData.map((row, idx) => ({
        id: row.id ?? idx + 1,
        exam: row.exam ?? row.course ?? "",
        marks: row.marks ?? "",
      }));
      setMarksRows(mapped);
    } else {
      setMarksRows([{ id: 1, exam: "", marks: "" }]);
    }

    setShowMarksPopup(true);
  };

  const addMarksRow = () => {
    setMarksRows((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((r) => r.id || 0)) + 1 : 1;
      return [...prev, { id: nextId, exam: "", marks: "" }];
    });
  };

  const updateMarksRow = (rowId, field, value) => {
    setMarksRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  const removeMarksRow = (rowId) => {
    setMarksRows((prev) => {
      const filtered = prev.filter((row) => row.id !== rowId);
      return filtered.length > 0 ? filtered : prev;
    });
  };

  const saveMarks = () => {
    if (activeMarksIndex === null) return;

    const cleaned = marksRows
      .map((r) => ({
        id: r.id,
        exam: (r.exam || "").trim(),
        marks: (r.marks || "").trim(),
      }))
      .filter((r) => r.exam || r.marks);

    setAssignments((prev) =>
      prev.map((item, idx) =>
        idx === activeMarksIndex ? { ...item, marksData: cleaned } : item
      )
    );

    setShowMarksPopup(false);
    setActiveMarksIndex(null);
  };

  const closeMarksPopup = () => {
    setShowMarksPopup(false);
    setActiveMarksIndex(null);

    
  };
  console.log("TRAINING PACK:", trainingPack);

  /* =======================  UI START  ======================= */
  return (
    <div className="ftd-root">
      <h1 className="heading">Freshers Training — Assignment</h1>

      {/* =================== SINGLE ASSIGN FORM =================== */}
      <div className="ftd-form-card">
        <form onSubmit={handleSubmit}>
          <div className="ftd-grid">
            {/* Category */}
            <div>
              <label>Training Category</label>
              <select
                name="trainingCategory"
                value={form.trainingCategory}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {trainingPack.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Fresher */}
            <div>
              <label>Search Fresher (ID / Name)</label>
              <input
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Search..."
                disabled={!form.trainingCategory}
              />
            </div>

            {/* Fresher ID */}
            <div>
              <label>Fresher ID</label>
              <select
                name="fresherId"
                value={form.fresherId}
                onChange={handleEmployeeSelect}
                disabled={!form.trainingCategory}
              >
                <option value="">-- Select --</option>
                {filteredEmployeeOptions.map((emp) => (
                  <option key={emp.id} value={emp.employeeId}>
                    {emp.employeeId} - {emp.firstName}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label>Fresher Name</label>
              <input value={form.fresherName} readOnly />
            </div>

            {/* Batch */}
            <div>
              <label>Batch</label>
              <input value={form.batch} readOnly />
            </div>

            {/* Start Date */}
            <div>
              <label>Start Date</label>
              <input
                type="date"
                name="trainingStartDate"
                value={form.trainingStartDate}
                onChange={handleChange}
              />
            </div>

            {/* End Date */}
            <div>
              <label>End Date</label>
              <input
                type="date"
                name="trainingEndDate"
                value={form.trainingEndDate}
                onChange={handleChange}
              />
            </div>

            {/* Duration */}
            <div>
              <label>Duration (Days)</label>
              <input value={form.durationDays} readOnly />
            </div>
          </div>

          {/* Mode */}
          <div style={{ marginTop: 16, maxWidth: 260 }}>
            <label>Mode</label>
            <select
              name="Mode"
              value={form.Mode}
              onChange={handleChange}
            >
              <option value="">-- Select Mode --</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="ftd-actions">
            <button className="primary" type="submit">
              {editingIndex !== null ? "Update" : "Assign Training"}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={() => {
                setForm({
                  fresherName: "",
                  fresherId: "",
                  batch: "",
                  trainingCategory: "",
                  selectedCourses: [],
                  trainingStartDate: "",
                  trainingEndDate: "",
                  durationDays: 0,
                  Mode: "",
                });
                setEmployeeSearch("");
                setEditingIndex(null);
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Courses list */}
        {form.selectedCourses.length > 0 && (
          <div className="ftd-selected">
            <strong>Courses Included:</strong>
            <ul>
              {form.selectedCourses.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* =================== BULK ASSIGN =================== */}
      <div className="ftd-bulk-card">
        <h3>Bulk Assign – Select Employees</h3>

        {/* Category + Start/End Dates */}
        <div
          className="ftd-grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {/* Category */}
          <div>
            <label>
              <b>Select Training Category</b>
            </label>
            <select
              value={bulkAssignCategory}
              onChange={(e) => {
                setBulkAssignCategory(e.target.value);
                setSelectedBulkEmployees([]);
                setBulkSearch("");
              }}
            >
              <option value="">-- Select Category --</option>
              {trainingPack.map((p) => (
                <option key={p.category} value={p.category}>
                  {p.category}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label>Bulk Start Date</label>
            <input
              type="date"
              value={bulkStartDate}
              onChange={(e) => setBulkStartDate(e.target.value)}
              disabled={!bulkAssignCategory}
            />
          </div>

          {/* End Date */}
          <div>
            <label>Bulk End Date</label>
            <input
              type="date"
              value={bulkEndDate}
              onChange={(e) => setBulkEndDate(e.target.value)}
              disabled={!bulkAssignCategory}
            />
          </div>
        </div>

        {/* Batch + Duration + Mode */}
        {bulkAssignCategory && (
          <div
            className="ftd-grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: 10 }}
          >
            <div>
              <label>Batch (Month Year)</label>
              <input value={bulkBatch} readOnly />
            </div>

            <div>
              <label>Duration (Days)</label>
              <input value={bulkDurationDays} readOnly />
            </div>

            <div>
              <label>Mode</label>
              <select
                value={bulkMode}
                onChange={(e) => setBulkMode(e.target.value)}
              >
                <option value="">-- Select Mode --</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        )}

        {/* Courses list for category */}
        {bulkAssignCategory && bulkCoursesForCategory.length > 0 && (
          <div className="ftd-selected" style={{ marginTop: 10 }}>
            <strong>Courses for this Category:</strong>
            <ul>
              {bulkCoursesForCategory.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Employee list */}
        {bulkAssignCategory && (
          <>
            <div className="bulk-emp-list">
              <label>
                <b>Select Employees</b>
              </label>

              {/* Search */}
              <input
                type="text"
                placeholder="Search employees..."
                value={bulkSearch}
                onChange={(e) => setBulkSearch(e.target.value)}
                className="bulk-search"
              />

              {/* Select all / Clear all */}
              <div className="bulk-actions">
                <button
                  type="button"
                  className="bulk-small-btn"
                  onClick={() =>
                    setSelectedBulkEmployees(
                      bulkFilteredEmployees.map((e) => e.id)
                    )
                  }
                >
                  Select All
                </button>

                <button
                  type="button"
                  className="bulk-small-btn clear"
                  onClick={() => setSelectedBulkEmployees([])}
                >
                  Clear All
                </button>
              </div>

              {/* Employees */}
              {bulkFilteredEmployees.map((emp) => (
                <div key={emp.id} className="bulk-emp-item">
                  <input
                    type="checkbox"
                    value={emp.id}
                    checked={selectedBulkEmployees.includes(emp.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBulkEmployees((prev) => [...prev, emp.id]);
                      } else {
                        setSelectedBulkEmployees((prev) =>
                          prev.filter((id) => id !== emp.id)
                        );
                      }
                    }}
                  />
                  <span className="bulk-emp-text">
                    {emp.id} – {emp.name}
                  </span>
                </div>
              ))}

              {bulkFilteredEmployees.length === 0 && (
                <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                  No employees found for this search.
                </div>
              )}
            </div>

            <button
              className="primary"
              type="button"
              onClick={handleBulkAutoAssign}
              disabled={
                selectedBulkEmployees.length === 0 ||
                !bulkStartDate ||
                !bulkEndDate ||
                !bulkMode
              }
              style={{ marginTop: "15px" }}
            >
              Assign Selected Employees
            </button>
          </>
        )}
      </div>

      {/* =================== EXCEL BUTTONS =================== */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button className="primary" onClick={exportToExcel}>
          📥 Download Excel (All Assignments)
        </button>
      </div>

      {/* =================== SEARCH & CATEGORY FILTER =================== */}
      <div className="ftd-search-row">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="All">All Categories</option>
          {trainingPack.map((p) => (
            <option key={p.category} value={p.category}>
              {p.category}
            </option>
          ))}
        </select>

        <div className="counts">
          Total Assignments: <strong>{assignments.length}</strong>
        </div>
      </div>

      {/* =================== TABLE =================== */}
      <div className="ftd-table-wrap">
        <table className="ftd-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fresher</th>
              <th>Category</th>
              <th>Batch</th>
              <th>Courses</th>
              <th>Start</th>
              <th>End</th>
              <th>Days</th>
              <th>Mode</th>
              <th>Progress</th>
              <th>Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", padding: 20 }}>
                  No results found
                </td>
              </tr>
            ) : (
              filtered.map((a, i) => (
                <tr key={i}>
                  <td>{a.fresherId}</td>

                  <td>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => openMarksPopup(
                        assignments.findIndex(
                          (item) =>
                            item.fresherId === a.fresherId &&
                            item.assignedDate === a.assignedDate
                        ) ?? i
                      )}
                    >
                      {a.fresherName}
                    </button>
                    {a.isBulk && <span className="bulk-tag"> (Bulk)</span>}
                  </td>

                  <td>{a.trainingCategory}</td>
                  <td>{a.batch}</td>

                  <td>
                    <ul className="mini-list">
                      {(a.selectedCourses || []).slice(0, 3).map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                      {a.selectedCourses &&
                        a.selectedCourses.length > 3 && (
                          <li>+ {a.selectedCourses.length - 3} more</li>
                        )}
                    </ul>
                  </td>

                  <td>{a.trainingStartDate}</td>
                  <td>{a.trainingEndDate}</td>
                  <td>{a.durationDays}</td>
                  <td>{a.Mode}</td>

                  <td style={{ minWidth: "150px" }}>
                    <div className="progress-line">
                      <div
                        className="progress-fill"
                        style={{ width: `${a.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="progress-number">
                      {a.progress || 0}%
                    </div>
                  </td>

                  <td>
                    {a.assignedDate
                      ? new Date(a.assignedDate).toLocaleDateString()
                      : ""}
                  </td>

                  <td className="actions">
                    <button onClick={() => startEdit(i)}>Edit</button>
                    <button
                      className="danger"
                      onClick={() => {
                        if (window.confirm("Delete?")) {
                          setAssignments((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          );
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =================== CONFIRM POPUP =================== */}
      {showConfirm && (
        <div className="ftd-popup">
          <div className="ftd-popup-box">
            <h3>Confirm Assignment</h3>

            <p>
              <strong>{form.fresherName}</strong> →{" "}
              <em>{form.trainingCategory}</em> (
              {form.Mode || "No Mode Selected"})
            </p>

            <div className="popup-actions" style={{ marginTop: 15 }}>
              <button className="primary" onClick={confirmAssignment}>
                Confirm
              </button>

              <button
                className="secondary"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ MARKS / PERFORMANCE POPUP (Option A, Glass UI) ⭐ */}
      {showMarksPopup && activeMarksIndex !== null && (
        <div className="marks-modal">
          <div className="marks-modal-content">
            <div className="marks-modal-header">
              <div>
                <h3>Training Performance</h3>
                <p className="marks-subtitle">
                  Capture exam-wise marks & evaluation for this fresher.
                </p>
              </div>
              <button
                className="marks-close-btn"
                onClick={closeMarksPopup}
              >
                ✕
              </button>
            </div>

            {/* Meta info */}
            <div className="marks-meta">
              <div>
                <span className="meta-label">Fresher</span>
                <span className="meta-value">
                  {assignments[activeMarksIndex]?.fresherName} (
                  {assignments[activeMarksIndex]?.fresherId})
                </span>
              </div>
              <div>
                <span className="meta-label">Category</span>
                <span className="meta-value">
                  {assignments[activeMarksIndex]?.trainingCategory}
                </span>
              </div>
              <div>
                <span className="meta-label">Batch</span>
                <span className="meta-value">
                  {assignments[activeMarksIndex]?.batch || "-"}
                </span>
              </div>
            </div>

            {/* Rows header */}
            <div className="marks-rows-header">
              <span>Exam / Topic</span>
              <span>Marks (%)</span>
              <span>Remove</span>
            </div>

            {/* Rows */}
            {marksRows.map((row) => (
              <div key={row.id} className="marks-row">
                <input
                  type="text"
                  className="marks-input course-input"
                  placeholder="e.g. React Basics"
                  value={row.exam}
                  onChange={(e) =>
                    updateMarksRow(row.id, "exam", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="marks-input marks-input-field"
                  placeholder="0 - 100"
                  min={0}
                  max={100}
                  value={row.marks}
                  onChange={(e) =>
                    updateMarksRow(row.id, "marks", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="row-remove-btn"
                  onClick={() => removeMarksRow(row.id)}
                  title="Remove this row"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-row-btn"
              onClick={addMarksRow}
            >
              + Add Exam & Marks
            </button>

            <div className="marks-footer">
              <button
                type="button"
                className="save-marks-btn"
                onClick={saveMarks}
              >
                Save Marks
              </button>
              <button
                type="button"
                className="cancel-marks-btn"
                onClick={closeMarksPopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
