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

import "./TrainingAssignment.css";

const LS_KEY = "multiple_training_v2";

const STATUS_OPTIONS = ["Not Started", "In Progress", "Completed"];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// const DEPARTMENTS = ["Frontend", "Backend", "UI/UX", "Design"];
const TRAINING_NAMES = ["ReactJS", "React Native", "UI/UX Design", "Node.js"];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const TRAINERS = [
  "Vijay Kumar",
  "Jaswanth Kumar",
  "Ajay Kumar",
  "Divya Shree",
  "Manoj Reddy",
];

// const ALL_EMPLOYEES = [
//   /* Frontend */
//   { id: "F001", name: "Ravi Kumar", batchMonth: 0, yearOffset: 0, durationMonths: 1 },
//   { id: "F002", name: "Anita Verma", batchMonth: 1, yearOffset: 0, durationMonths: 2 },
//   { id: "F003", name: "Srikanth R", batchMonth: 2, yearOffset: 0, durationMonths: 1 },
//   { id: "F004", name: "Kavya Das", batchMonth: 3, yearOffset: 0, durationMonths: 2 },
//   { id: "F005", name: "Harish G", batchMonth: 4, yearOffset: 0, durationMonths: 1 },
//   { id: "F006", name: "Lohit Sai", batchMonth: 0, yearOffset: 1, durationMonths: 2 },
//   { id: "F007", name: "Ayesha Fatima", batchMonth: 1, yearOffset: 1, durationMonths: 3 },
//   { id: "F008", name: "Vishal Sharma", batchMonth: 2, yearOffset: 1, durationMonths: 1 },
//   { id: "F009", name: "Praneeth", batchMonth: 5, yearOffset: 0, durationMonths: 2 },
//   { id: "F010", name: "Charitha", batchMonth: 6, yearOffset: 0, durationMonths: 1 },

//   /* Backend */
//   { id: "B001", name: "Kiran Kumar", batchMonth: 0, yearOffset: 0, durationMonths: 3 },
//   { id: "B002", name: "Meghana T", batchMonth: 3, yearOffset: 0, durationMonths: 2 },
//   { id: "B003", name: "Naveen R", batchMonth: 4, yearOffset: 0, durationMonths: 2 },
//   { id: "B004", name: "Sunitha A", batchMonth: 1, yearOffset: 0, durationMonths: 3 },
//   { id: "B005", name: "Rohit S", batchMonth: 2, yearOffset: 1, durationMonths: 2 },
//   { id: "B006", name: "Dharani", batchMonth: 0, yearOffset: 1, durationMonths: 3 },
//   { id: "B007", name: "Yogesh", batchMonth: 10, yearOffset: 0, durationMonths: 1 },
//   { id: "B008", name: "Mounika", batchMonth: 11, yearOffset: 0, durationMonths: 2 },

//   /* UI/UX */
//   { id: "U001", name: "Harsha UI", batchMonth: 1, yearOffset: 0, durationMonths: 2 },
//   { id: "U002", name: "Deepika UX", batchMonth: 2, yearOffset: 0, durationMonths: 1 },
//   { id: "U003", name: "Vamshi UI", batchMonth: 0, yearOffset: 1, durationMonths: 2 },
//   { id: "U004", name: "Hema UX", batchMonth: 4, yearOffset: 1, durationMonths: 2 },
//   { id: "U005", name: "Tarun UI", batchMonth: 7, yearOffset: 0, durationMonths: 1 },
//   { id: "U006", name: "Ananya UX", batchMonth: 8, yearOffset: 0, durationMonths: 1 },
// ];

// const EMPLOYEE_MASTER = {
//   Frontend: ALL_EMPLOYEES.filter((e) => e.id.startsWith("F")),
//   Backend: ALL_EMPLOYEES.filter((e) => e.id.startsWith("B")),
//   "UI/UX": ALL_EMPLOYEES.filter((e) => e.id.startsWith("U")),
//   Design: ALL_EMPLOYEES.filter((e) => e.id.startsWith("U")),
// };

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

function progressFromStatus(status) {
  if (status === "Completed") return 100;
  if (status === "In Progress") return 50;
  return 0;
}

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

export default function TrainingAssignment() {
  const [form, setForm] = useState({
    Name: "",
    Id: "",
    batch: "",
    trainingCategory: "",
    selectedCourses: [],
    trainingStartDate: "",
    trainingEndDate: "",
    durationDays: 0,
    Mode: "",
    trainingName: "",
    level: "",
    trainer: "",
  });

  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [bulkAssignCategory, setBulkAssignCategory] = useState("");
  const [bulkTrainingName, setBulkTrainingName] = useState("");
  const [bulkLevel, setBulkLevel] = useState("");
  const [bulkTrainer, setBulkTrainer] = useState("");

  const [selectedBulkEmployees, setSelectedBulkEmployees] = useState([]);
  const [bulkSearch, setBulkSearch] = useState("");

  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkEndDate, setBulkEndDate] = useState("");
  const [bulkDurationDays, setBulkDurationDays] = useState(0);
  const [bulkBatch, setBulkBatch] = useState("");
  const [bulkMode, setBulkMode] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

    // ⭐ Fetch departments from API
  const [DEPARTMENTS, setDEPARTMENTS] = useState([]);

  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await fetch(
          "https://internal-website-rho.vercel.app/api/training/departments"
        );
        const data = await res.json();
        if (data.departments) {
          setDEPARTMENTS(data.departments);
        }
      } catch (err) {
        console.error("Department fetch error:", err);
      }
    }

    loadDepartments();
  }, []);

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

useEffect(() => {
  if (!bulkAssignCategory) return;

  async function loadEmployees() {
    try {
      setLoadingEmployees(true);

      const res = await fetch(
        `https://internal-website-rho.vercel.app/api/training/departments/${bulkAssignCategory}`
      );
      const data = await res.json();

      console.log("Employee API response:", data);

      if (data.employees && data.employees.length > 0) {
        const mapped = data.employees.map((emp) => ({
          id: emp.employeeId,
          name: emp.employeeName,
          department: emp.department,
          manager: emp.managerName,
        }));

        setEmployees(mapped);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error("Employee fetch error:", err);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }

  loadEmployees();
}, [bulkAssignCategory]);

  // ⭐ Marks / Performance popup state (exam + marks)
  const [showMarksPopup, setShowMarksPopup] = useState(false);
  const [activeMarksIndex, setActiveMarksIndex] = useState(null);
  const [marksRows, setMarksRows] = useState([
    { id: 1, exam: "", marks: "" },
  ]);

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

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(assignments));
  }, [assignments]);

  // ⭐ AUTO UPDATE PROGRESS WHEN PAGE LOADS
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⭐ AUTO UPDATE PROGRESS DAILY (24 hours)
  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 86400000); // 24 hours

    return () => clearInterval(interval);
  }, [assignments]);

  // const employeesForCategory = useMemo(() => {
  //   return EMPLOYEE_MASTER[form.trainingCategory] || [];
  // }, [form.trainingCategory]);
  const employeesForCategory = employees || [];

const filteredEmployeeOptions = useMemo(() => {
  const search = (employeeSearch || "").toLowerCase();

  return employees.filter((emp) => {
    const name = (emp?.name || "").toLowerCase();
    const id = (emp?.id || "").toLowerCase();

    return name.includes(search) || id.includes(search);
  });
}, [employees, employeeSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "trainingCategory") {
        updated.selectedCourses = [];
        updated.Id = "";
        updated.Name = "";
        updated.batch = "";
        updated.trainingStartDate = "";
        updated.trainingEndDate = "";
        updated.durationDays = 0;
        setEmployeeSearch("");
      }

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

const handleEmployeeSelect = async (e) => {
  const id = e.target.value;

  try {
    const res = await fetch(
      `https://internal-website-rho.vercel.app/api/training/departments/${bulkAssignCategory}/${id}`
    );
    const data = await res.json();

    if (!data.employee) return;

    const emp = data.employee;

    setForm((prev) => ({
      ...prev,
      Id: emp.employeeId,
      Name: emp.employeeName,
      batch: "",
      trainingStartDate: "",
      trainingEndDate: "",
      durationDays: 0,
    }));
  } catch (err) {
    console.error("Employee fetch error:", err);
  }
};

  const validateSingle = () =>
    form.Name &&
    form.Id &&
    form.batch &&
    form.trainingCategory &&
    form.trainingStartDate &&
    form.trainingEndDate &&
    form.Mode &&
    form.trainingName &&
    form.level &&
    form.trainer;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateSingle()) {
      alert("Please fill all required fields");
      return;
    }
    setShowConfirm(true);
  };

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

  try {
    const res = await fetch(
      "https://internal-website-rho.vercel.app/api/training/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();
    console.log("CREATE API RESPONSE:", result);
  } catch (err) {
    console.error("Create API error:", err);
  }

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
    Name: "",
    Id: "",
    batch: "",
    trainingCategory: "",
    selectedCourses: [],
    trainingStartDate: "",
    trainingEndDate: "",
    durationDays: 0,
    Mode: "",
    trainingName: "",
    level: "",
    trainer: "",
  });
};

const bulkEmployeesForCategory = useMemo(() => {
  if (!bulkAssignCategory || employees.length === 0) return [];
  

 const filtered = employees.filter((e) => {
  const dept = e.department || ""; // safe fallback
  const cat = bulkAssignCategory || ""; // safe fallback
  return dept.toLowerCase().includes(cat.toLowerCase());
});

  // Remove duplicates by id
  const uniqueMap = new Map();
  filtered.forEach((e) => {
    if (!uniqueMap.has(e.id)) {
      uniqueMap.set(e.id, {
        id: e.id,
        name: e.name,
        department: e.department,
        manager: e.manager,
      });
    }
  });

  return Array.from(uniqueMap.values());
}, [employees, bulkAssignCategory]);

const bulkFilteredEmployees = useMemo(() => {
  const s = bulkSearch.toLowerCase();
  return bulkEmployeesForCategory.filter(
    (e) =>
      e.id.toLowerCase().includes(s) ||
      e.name.toLowerCase().includes(s)
  );
}, [bulkSearch, bulkEmployeesForCategory]);

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

 const handleBulkAutoAssign = async () => {
  if (!bulkAssignCategory)
    return alert("Please select Department");
  if (!bulkTrainingName)
    return alert("Please select Training");
  if (!bulkLevel)
    return alert("Please select Level");
  if (!bulkTrainer)
    return alert("Please select Trainer");
  if (!bulkStartDate || !bulkEndDate)
    return alert("Please select Start Date and End Date");
  if (!bulkMode)
    return alert("Please select Mode");
  if (selectedBulkEmployees.length === 0)
    return alert("Please select employees");

  const d1 = new Date(bulkStartDate);
  const d2 = new Date(bulkEndDate);
  if (d2 < d1) {
    alert("End Date should be after Start Date");
    return;
  }

  const empList = bulkEmployeesForCategory;

  const progress = calculateTimeBasedProgress(bulkStartDate, bulkEndDate);

  let status = "Not Started";
  if (progress >= 100) status = "Completed";
  else if (progress > 0) status = "In Progress";

  const newItems = selectedBulkEmployees
    .map((id) => {
      const emp = empList.find((e) => e.id === id);
      if (!emp) return null;

      return {
        Id: emp.id,
        Name: emp.name,
        trainingCategory: bulkAssignCategory,
        trainingName: bulkTrainingName,
        level: bulkLevel,
        trainer: bulkTrainer,
        batch: bulkBatch,
        selectedCourses: [],
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

  if (newItems.length === 0) {
    return alert("No valid employees selected for assignment.");
  }

  // ⭐ SEND EACH EMPLOYEE TO CREATE API
  for (const item of newItems) {
    try {
      const resp = await fetch(
        "https://internal-website-rho.vercel.app/api/training/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }
      );

      const result = await resp.json();
      console.log("BULK CREATE RESPONSE:", result);
    } catch (err) {
      console.error("Bulk create error:", err);
    }
  }

  // Add locally
  setAssignments((prev) => [...newItems, ...prev]);

  setSelectedBulkEmployees([]);
  setBulkSearch("");
  setBulkMode("");
  setBulkTrainingName("");
  setBulkLevel("");
  setBulkTrainer("");

  alert("Bulk Assigned Successfully!");
};



  const updateStatus = (index, status) => {
    const updated = [...assignments];
    updated[index].status = status;
    updated[index].progress = progressFromStatus(status);
    setAssignments(updated);
  };

  const startEdit = (index) => {
    const a = assignments[index];

    setForm({
      Name: a.Name,
      Id: a.Id,
      batch: a.batch,
      trainingCategory: a.trainingCategory,
      selectedCourses: a.selectedCourses || [],
      trainingStartDate: a.trainingStartDate || "",
      trainingEndDate: a.trainingEndDate || "",
      durationDays: a.durationDays || 0,
      Mode: a.Mode || "",
      trainingName: a.trainingName || "",
      level: a.level || "",
      trainer: a.trainer || "",
    });

    setEmployeeSearch(a.Id || "");
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ⭐ filtered now keeps original index as _index
  const filtered = assignments
    .map((a, idx) => ({ ...a, _index: idx }))
    .filter((a) => {
      const s = search.toLowerCase();

      const matchesSearch =
        a.Name.toLowerCase().includes(s) ||
        a.Id.toLowerCase().includes(s) ||
        (a.trainingCategory || "").toLowerCase().includes(s) ||
        (a.trainingName || "").toLowerCase().includes(s);

      const matchesCategory =
        categoryFilter === "All" || a.trainingCategory === categoryFilter;

      return matchesSearch && matchesCategory;
    });

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

  const exportToExcel = () => {
    if (assignments.length === 0) {
      alert("No data to export!");
      return;
    }

    const exportData = assignments.map((a, index) => ({
      S_No: index + 1,
      ID: a.Id,
      Name: a.Name,
      Department: a.trainingCategory,
      Training_Name: a.trainingName,
      Level: a.level,
      Trainer: a.trainer,
      Batch: a.batch,
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

    saveAs(blob, "Training_Assignments.xlsx");
  };

  const downloadBlankTemplate = () => {
    const template = [
      {
        "S.No": "",
        " ID": "",
        " Name": "",
        "Department": "",
        "Training Name": "",
        "Level": "",
        "Trainer": "",
        "Batch": "",
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

    // saveAs(blob, "Multiple_Training_Blank_Template.xlsx");
  };

  /* ===================== MARKS POPUP HELPERS (exam + marks) ===================== */

  const openMarksPopup = (assignmentIndex) => {
    const rec = assignments[assignmentIndex];
    if (!rec) return;

    setActiveMarksIndex(assignmentIndex);

    if (Array.isArray(rec.marksData) && rec.marksData.length > 0) {
      // Support old structure (course/marks/remarks) & new (exam/marks)
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
      // Keep at least one row
      return filtered.length > 0 ? filtered : prev;
    });
  };

  const saveMarks = () => {
    if (activeMarksIndex === null) return;

    setAssignments((prev) =>
      prev.map((item, idx) =>
        idx === activeMarksIndex ? { ...item, marksData: marksRows } : item
      )
    );

    setShowMarksPopup(false);
    setActiveMarksIndex(null);
  };

  /* =======================  UI START  ======================= */

  return (
    <div className="ftd-root">
      <h1 className="heading"> Training Assigned (Multiple)</h1>

      {/* =================== BULK ASSIGN =================== */}
      <div className="ftd-bulk-card">
        <h3> – Select Employees (Multiple)</h3>

        <div
          className="ftd-grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <div>
            <label>
              <b>Department</b>
            </label>
            <select
              value={bulkAssignCategory}
              onChange={(e) => {
                setBulkAssignCategory(e.target.value);
                setSelectedBulkEmployees([]);
                setBulkSearch("");
              }}
            >
              <option value="">-- Select Department --</option>
              {DEPARTMENTS.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
          
          <div>
  <label>Select Employee</label>

  {loadingEmployees ? (
    <p>Loading employees...</p>
  ) : (
    <select value={form.Id} onChange={handleEmployeeSelect}>
      <option value="">-- Select Employee --</option>
      console.log("FILTERED EMPLOYEE OPTIONS =", filteredEmployeeOptions);


      {filteredEmployeeOptions.map((emp) => (
        
        <option key={emp.id} value={emp.id}>
          {emp.name !== "Unknown" ? emp.name : emp.id} — {emp.id}
        </option>
      ))}
    </select>
  )}
</div>


          <div>
            <label> Start Date</label>
            <input
              type="date"
              value={bulkStartDate}
              onChange={(e) => setBulkStartDate(e.target.value)}
              disabled={!bulkAssignCategory}
            />
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              value={bulkEndDate}
              onChange={(e) => setBulkEndDate(e.target.value)}
              disabled={!bulkAssignCategory}
            />
          </div>
        </div>

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

        {bulkAssignCategory && (
          <div
            className="ftd-grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: 10 }}
          >
            <div>
              <label>Trainer</label>
              <select
                value={bulkTrainer}
                onChange={(e) => setBulkTrainer(e.target.value)}
              >
                <option value="">-- Select Trainer --</option>
                {TRAINERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Training</label>
              <select
                value={bulkTrainingName}
                onChange={(e) => setBulkTrainingName(e.target.value)}
              >
                <option value="">-- Select Training --</option>
                {TRAINING_NAMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Level</label>
              <select
                value={bulkLevel}
                onChange={(e) => setBulkLevel(e.target.value)}
              >
                <option value="">-- Select Level --</option>
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {bulkAssignCategory && (
          <>
            <div className="bulk-emp-list">
              <label>
                <b>Select Employees</b>
              </label>

              <input
                type="text"
                placeholder="Search employees..."
                value={bulkSearch}
                onChange={(e) => setBulkSearch(e.target.value)}
                className="bulk-search"
              />

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
      {emp.name !== "Unknown" ? emp.name : emp.id} – {emp.id}
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
                !bulkMode ||
                !bulkAssignCategory ||
                !bulkTrainingName ||
                !bulkLevel ||
                !bulkTrainer
              }
              style={{ marginTop: "15px" }}
            >
              Assign Selected Employees
            </button>
          </>
        )}
      </div>

      {/* SEARCH BAR */}
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
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <div className="counts">
          Total Assignments: <strong>{assignments.length}</strong>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="ftd-table-wrap">
        <table className="ftd-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Training</th>
              <th>Level</th>
              <th>Trainer</th>
              <th>Batch</th>
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
                <td colSpan="15" style={{ textAlign: "center", padding: 20 }}>
                  No results found
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a._index}>
                  <td>{a.Id}</td>

                  <td>
                    <button
                      type="button"
                      className="name-link"
                      onClick={() => openMarksPopup(a._index)}
                    >
                      {a.Name}
                    </button>
                    {a.isBulk && <span className="bulk-tag"> (Bulk)</span>}
                  </td>

                  <td>{a.trainingCategory}</td>
                  <td>{a.trainingName || "-"}</td>
                  <td>{a.level || "-"}</td>
                  <td>{a.trainer || "-"}</td>
                  <td>{a.batch}</td>

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
                    <button onClick={() => startEdit(a._index)}>Edit</button>
                    <button
                      className="danger"
                      onClick={() => {
                        if (window.confirm("Delete?")) {
                          setAssignments((prev) =>
                            prev.filter((_, idx) => idx !== a._index)
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

      {/* CONFIRM POPUP */}
      {showConfirm && (
        <div className="ftd-popup">
          <div className="ftd-popup-box">
            <h3>Confirm Assignment</h3>

            <p>
              <strong>{form.Name}</strong> →{" "}
              <em>
                {form.trainingName} ({form.trainingCategory})
              </em>{" "}
              ({form.Mode})
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

      {/* ⭐ MARKS / PERFORMANCE POPUP ⭐ (Exam + Marks) */}
      {showMarksPopup && (
        <>
          <div className="marks-overlay"></div>

          <div className="marks-popup">
            <h2>
              Performance Marks —{" "}
              {activeMarksIndex !== null
                ? assignments[activeMarksIndex]?.Name
                : ""}
            </h2>

            <p className="marks-subtitle">
              Department:{" "}
              {activeMarksIndex !== null
                ? assignments[activeMarksIndex]?.trainingCategory
                : "-"}{" "}
              | Training:{" "}
              {activeMarksIndex !== null
                ? assignments[activeMarksIndex]?.trainingName
                : "-"}
            </p>

            {marksRows.map((row) => (
              <div key={row.id} className="marks-row">
                <input
                  placeholder="Exam / Topic"
                  value={row.exam}
                  onChange={(e) =>
                    updateMarksRow(row.id, "exam", e.target.value)
                  }
                />

                <input
                  placeholder="Marks"
                  type="number"
                  value={row.marks}
                  onChange={(e) =>
                    updateMarksRow(row.id, "marks", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="remove-row"
                  onClick={() => removeMarksRow(row.id)}
                >
                  ✕
                </button>
              </div>
            ))}

            <button type="button" className="add-row" onClick={addMarksRow}>
              + Add Exam & Marks
            </button>

            <div className="marks-actions">
              <button type="button" className="primary" onClick={saveMarks}>
                Save Marks
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => setShowMarksPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}






