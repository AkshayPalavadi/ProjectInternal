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

const LS_KEY = "freshers_training_v2";

/* TRAINING PACKS */
const TRAINING_PACK = [
  {
    category: "Frontend Training",
    items: [
      "HTML Basics",
      "CSS Basics",
      "JavaScript Essentials",
      "Responsive Design",
      "Git & GitHub",
      "React Intro (Basics)",
      "Debugging Basics",
      "Mini Frontend Project",
    ],
  },
  {
    category: "Backend Training",
    items: [
      "Programming Basics (Python / Java / Node)",
      "REST API Basics",
      "SQL / MySQL Basics",
      "Server Basics",
      "Express.js / Spring Boot Intro",
      "Git & GitHub",
      "API Development Basics",
      "Small API Project",
    ],
  },
  {
    category: "UI/UX Training",
    items: [
      "Figma Basics",
      "Design Principles",
      "Wireframes & Prototypes",
      "Color Theory",
      "Typography Basics",
      "Basic Portfolio Project",
    ],
  },
  {
    category: "Soft Skills",
    items: [
      "Communication Skills",
      "Email Writing",
      "Presentation Skills",
      "Teamwork & Collaboration",
      "Time Management",
      "Corporate Etiquette",
    ],
  },
  {
    category: "Process & Tools",
    items: [
      "Company Policies",
      "SDLC Basics",
      "Scrum & Agile Overview",
      "JIRA / Trello Basics",
      "Documentation Training",
      "Security Awareness",
    ],
  },
  {
    category: "Mandatory Training",
    items: [
      "Orientation Program",
      "HR Policies & Compliance",
      "Company Tools Training",
      "IT Security & Access Training",
      "Communication & Soft Skills",
    ],
  },
];

const STATUS_OPTIONS = ["Not Started", "In Progress", "Completed"];

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

/* EMPLOYEE MASTER DATA */
const ALL_EMPLOYEES = [
  /* Frontend */
  { id: "F001", name: "Ravi Kumar", batchMonth: 0, yearOffset: 0, durationMonths: 1 },
  { id: "F002", name: "Anita Verma", batchMonth: 1, yearOffset: 0, durationMonths: 2 },
  { id: "F003", name: "Srikanth R", batchMonth: 2, yearOffset: 0, durationMonths: 1 },
  { id: "F004", name: "Kavya Das", batchMonth: 3, yearOffset: 0, durationMonths: 2 },
  { id: "F005", name: "Harish G", batchMonth: 4, yearOffset: 0, durationMonths: 1 },
  { id: "F006", name: "Lohit Sai", batchMonth: 0, yearOffset: 1, durationMonths: 2 },
  { id: "F007", name: "Ayesha Fatima", batchMonth: 1, yearOffset: 1, durationMonths: 3 },
  { id: "F008", name: "Vishal Sharma", batchMonth: 2, yearOffset: 1, durationMonths: 1 },
  { id: "F009", name: "Praneeth", batchMonth: 5, yearOffset: 0, durationMonths: 2 },
  { id: "F010", name: "Charitha", batchMonth: 6, yearOffset: 0, durationMonths: 1 },

  /* Backend */
  { id: "B001", name: "Kiran Kumar", batchMonth: 0, yearOffset: 0, durationMonths: 3 },
  { id: "B002", name: "Meghana T", batchMonth: 3, yearOffset: 0, durationMonths: 2 },
  { id: "B003", name: "Naveen R", batchMonth: 4, yearOffset: 0, durationMonths: 2 },
  { id: "B004", name: "Sunitha A", batchMonth: 1, yearOffset: 0, durationMonths: 3 },
  { id: "B005", name: "Rohit S", batchMonth: 2, yearOffset: 1, durationMonths: 2 },
  { id: "B006", name: "Dharani", batchMonth: 0, yearOffset: 1, durationMonths: 3 },
  { id: "B007", name: "Yogesh", batchMonth: 10, yearOffset: 0, durationMonths: 1 },
  { id: "B008", name: "Mounika", batchMonth: 11, yearOffset: 0, durationMonths: 2 },

  /* UI/UX */
  { id: "U001", name: "Harsha UI", batchMonth: 1, yearOffset: 0, durationMonths: 2 },
  { id: "U002", name: "Deepika UX", batchMonth: 2, yearOffset: 0, durationMonths: 1 },
  { id: "U003", name: "Vamshi UI", batchMonth: 0, yearOffset: 1, durationMonths: 2 },
  { id: "U004", name: "Hema UX", batchMonth: 4, yearOffset: 1, durationMonths: 2 },
  { id: "U005", name: "Tarun UI", batchMonth: 7, yearOffset: 0, durationMonths: 1 },
  { id: "U006", name: "Ananya UX", batchMonth: 8, yearOffset: 0, durationMonths: 1 },
];

const EMPLOYEE_MASTER = {
  "Frontend Training": ALL_EMPLOYEES.filter((e) => e.id.startsWith("F")),
  "Backend Training": ALL_EMPLOYEES.filter((e) => e.id.startsWith("B")),
  "UI/UX Training": ALL_EMPLOYEES.filter((e) => e.id.startsWith("U")),
  "Soft Skills": ALL_EMPLOYEES,
  "Process & Tools": ALL_EMPLOYEES,
  "Mandatory Training": ALL_EMPLOYEES,
};

/* AUTO-GENERATE fields for each employee (single assign) */
function buildEmployeeDerivedFields(emp) {
  const now = new Date();
  const year = now.getFullYear() + (emp.yearOffset || 0);
  const monthIndex =
    typeof emp.batchMonth === "number" ? emp.batchMonth : now.getMonth();

  const batch = `${MONTHS[monthIndex]} ${year}`;

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + (emp.durationMonths || 1));

  const durationDays = Math.ceil(
    (endDate - startDate) / (1000 * 60 * 60 * 24)
  );

  return {
    batch,
    trainingStartDate: startDate.toISOString().slice(0, 10),
    trainingEndDate: endDate.toISOString().slice(0, 10),
    durationDays,
  };
}

/* Convert status → progress% when updated manually */
function progressFromStatus(status) {
  if (status === "Completed") return 100;
  if (status === "In Progress") return 50;
  return 0;
}

/* Auto time-based progress */
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

/* ======================= MAIN COMPONENT ======================= */
export default function FreshersTrainingAssignment() {

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

  /* SAVE to LS */
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(assignments));
  }, [assignments]);

  /* EMPLOYEE OPTIONS for selected category */
  const employeesForCategory = useMemo(() => {
    return EMPLOYEE_MASTER[form.trainingCategory] || [];
  }, [form.trainingCategory]);

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
        const pack = TRAINING_PACK.find((p) => p.category === value);

        updated.selectedCourses = pack ? pack.items : [];
        updated.fresherId = "";
        updated.fresherName = "";
        updated.batch = "";
        updated.trainingStartDate = "";
        updated.trainingEndDate = "";
        updated.durationDays = 0;

        setEmployeeSearch("");
      }

      /* Recalculate duration */
      if (name === "trainingStartDate" || name === "trainingEndDate") {
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

    const derived = buildEmployeeDerivedFields(emp);

    setForm((prev) => ({
      ...prev,
      fresherId: emp.id,
      fresherName: emp.name,
      batch: derived.batch,
      trainingStartDate: derived.trainingStartDate,
      trainingEndDate: derived.trainingEndDate,
      durationDays: derived.durationDays,
    }));
  };

  /* VALIDATE SINGLE FORM */
  const validateSingle = () =>
    form.fresherName &&
    form.fresherId &&
    form.batch &&
    form.trainingCategory &&
    form.trainingStartDate &&
    form.trainingEndDate;
    form.Mode;

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
  const confirmAssignment = () => {
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

    if (editingIndex !== null) {
      const updated = [...assignments];
      updated[editingIndex] = data;
      setAssignments(updated);
      setEditingIndex(null);
    } else {
      setAssignments((prev) => [data, ...prev]);
    }

    setShowConfirm(false);

    setForm({
      fresherName: "",
      fresherId: "",
      batch: "",
      trainingCategory: "",
      selectedCourses: [],
      trainingStartDate: "",
      trainingEndDate: "",
      durationDays: 0,
      Mode:"",
    });
  };

  /* ================== BULK ASSIGN LOGIC ================== */

  /* employees list for bulk category */
  const bulkEmployeesForCategory = useMemo(() => {
    return EMPLOYEE_MASTER[bulkAssignCategory] || [];
  }, [bulkAssignCategory]);

  /* bulk employees filtered by search */
  const bulkFilteredEmployees = useMemo(() => {
    const s = bulkSearch.toLowerCase();
    return bulkEmployeesForCategory.filter(
      (e) =>
        e.id.toLowerCase().includes(s) ||
        e.name.toLowerCase().includes(s)
    );
  }, [bulkSearch, bulkEmployeesForCategory]);

  /* bulk courses for selected bulk category */
  const bulkCoursesForCategory = useMemo(() => {
    if (!bulkAssignCategory) return [];
    const pack = TRAINING_PACK.find(
      (p) => p.category === bulkAssignCategory
    );
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

  /* BULK AUTO ASSIGN (same dates + batch for all selected employees) */
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

    const empList = EMPLOYEE_MASTER[bulkAssignCategory] || [];
    const pack =
      TRAINING_PACK.find((p) => p.category === bulkAssignCategory) || {
        items: [],
      };

    /* same date range → same time-based progress */
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
          batch: bulkBatch, // same for all
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

  /* UPDATE STATUS (manual) */
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

  /* ⭐ FINAL: AVG PROGRESS BY CATEGORY (Single + Bulk supported) */
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

  /* ========== EXCEL EXPORT: ALL ASSIGNMENTS ========== */
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

  /* ========== EXCEL EXPORT: BLANK TEMPLATE ========== */
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
                {TRAINING_PACK.map((p) => (
                  <option key={p.category} value={p.category}>
                    {p.category}
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
                  <option key={emp.id} value={emp.id}>
                    {emp.id} - {emp.name}
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
              <div>
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
        <div className="ftd-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>

          {/* Category */}
          <div>
            <label><b>Select Training Category</b></label>
            <select
              value={bulkAssignCategory}
              onChange={(e) => {
                setBulkAssignCategory(e.target.value);
                setSelectedBulkEmployees([]);
                setBulkSearch("");
              }}
            >
              <option value="">-- Select Category --</option>
              {TRAINING_PACK.map((p) => (
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

        {/* Batch + Duration */}
        {bulkAssignCategory && (
          <div
            className="ftd-grid"
            style={{ gridTemplateColumns: "repeat(2, 1fr)", marginTop: 10 }}
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
              <label><b>Select Employees</b></label>

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

      {/* =================== CHART =================== */}
      <div className="ftd-charts">
        <div className="chart-card">
          <h4>Average Progress by Category</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={avgProgressByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =================== EXCEL BUTTONS =================== */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button className="primary" onClick={exportToExcel}>
          📥 Download Excel (All Assignments)
        </button>

        {/* <button className="secondary" onClick={downloadBlankTemplate}>
          📄 Download Blank Template
        </button> */}
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
          {TRAINING_PACK.map((p) => (
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
              <th>Status</th>
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
                    {a.fresherName}
                    {a.isBulk && <span className="bulk-tag"> (Bulk)</span>}
                  </td>

                  <td>{a.trainingCategory}</td>
                  <td>{a.batch}</td>

                  <td>
                    <ul className="mini-list">
                      {a.selectedCourses.slice(0, 3).map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                      {a.selectedCourses.length > 3 && (
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
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(i, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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

    </div>
  );
}