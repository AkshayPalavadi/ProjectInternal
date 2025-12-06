import React, { useState, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import "./CompletedTraining.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const CompletedTraining = () => {
  const navigate = useNavigate();

  // Column search states
  const [searchEmpId, setSearchEmpId] = useState("");
  const [searchEmpName, setSearchEmpName] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [searchLevelText, setSearchLevelText] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchCompletedDate, setSearchCompletedDate] = useState("");

  // Filter states
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");

  // ⭐ REVIEW star state
  const [ratings, setRatings] = useState({});

  // ⭐ NEW — POPUP modal states
  const [showSkillMap, setShowSkillMap] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleRating = (empId, star) => {
    setRatings((prev) => ({
      ...prev,
      [empId]: star,
    }));
  };

  const filterRef = useRef(null);
 


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const [data, setData] = useState([]);   // holds the tasks from API
const [loading, setLoading] = useState(true);  // optional, for showing a loading message
   useEffect(() => {
  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch("https://internal-website-rho.vercel.app/api/training/tasks/completed");
      const result = await response.json();

      // Format the data to match your table columns
      const formattedData = result.tasks.map(task => ({
        empId: task.employeeId,
        employeeName: task.employeeName,
        courseName: task.trainingTitle,
        level: task.level,
        startDate: new Date(task.fromDate).toLocaleDateString("en-GB"),
        completedDate: new Date(task.toDate).toLocaleDateString("en-GB")
      }));

      setData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      setLoading(false);
    }
  };

  fetchCompletedTasks();
}, []);

  const courseList = useMemo(() => [...new Set(data.map(item => item.courseName))], [data]);


  const handleCourseFilter = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handleLevelFilter = (level) => {
    setSelectedLevel(level === selectedLevel ? "" : level);
  };

  const filteredData = useMemo(() => {
    const txt = (v) => v.toLowerCase();
    return data.filter((item) => {
      const matchesSearch =
        txt(item.empId).includes(txt(searchEmpId)) &&
        txt(item.employeeName).includes(txt(searchEmpName)) &&
        txt(item.courseName).includes(txt(searchCourse)) &&
        txt(item.level).includes(txt(searchLevelText)) &&
        txt(item.startDate).includes(txt(searchStartDate)) &&
        txt(item.completedDate).includes(txt(searchCompletedDate));

      const matchesCourse =
        selectedCourses.length === 0 || selectedCourses.includes(item.courseName);

      const matchesLevel =
        selectedLevel === "" || selectedLevel === item.level;

      return matchesSearch && matchesCourse && matchesLevel;
    });
  }, [
    searchEmpId,
    searchEmpName,
    searchCourse,
    searchLevelText,
    searchStartDate,
    searchCompletedDate,
    selectedCourses,
    selectedLevel,
    loading
  ]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Certifications");
    XLSX.writeFile(workbook, "Certifications_Completed.xlsx");
  };

  const handleViewCertificate = (row) => {
    navigate("/admin/CertificatePage", { state: row });
  };
  const pdfRef = useRef();

// const downloadSkillMapPDF = async () => {
//   const input = pdfRef.current;

//   const canvas = await html2canvas(input, {
//     scale: 2,
//     useCORS: true,
//     backgroundColor: "#ffffff",
//   });

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");

//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();

//   const imgWidth = pageWidth;
//   const imgHeight = (canvas.height * pageWidth) / canvas.width;

//   let heightLeft = imgHeight;
//   let position = 0;

//   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

//   while (heightLeft > pageHeight) {
//     pdf.addPage();
//     position = heightLeft - imgHeight;
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;
//   }

//   pdf.save(`${selectedEmployee.employeeName}_SkillReport.pdf`);
// };


const downloadSkillMapPDF = async () => {
  const input = pdfRef.current;

  // TEMPORARY FIX: remove CSS transforms during capture
  input.classList.add("html2canvas-fix");

  await new Promise(resolve => setTimeout(resolve, 200)); // allow DOM to update

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    onclone: (doc) => {
      // ensure popup becomes fully visible
      const el = doc.querySelector(".skillmap-container");
      el.style.opacity = "1";
    }
  });

  // restore CSS after capture
  input.classList.remove("html2canvas-fix");

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 10;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 5;

  pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    pdf.addPage();
    position = heightLeft - imgHeight + 5;
    pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${selectedEmployee.employeeName}_SkillReport.pdf`);
};

console.log("Filtered Data:", filteredData); // Debugging line

  return (
    <div className="certifications-container">
      <h2 className="title">Completed Training</h2>

      <div className="filter-box-completed">
        <FiFilter className="filter-icon-completed" onClick={() => setShowFilter(!showFilter)} />
        {showFilter && (
          <div className="filter-dropdown-completed right" ref={filterRef}>
            <p className="filter-title">🎓 Filter by Course</p>

            {courseList.map((course, index) => (
              <div key={index} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course)}
                  onChange={() => handleCourseFilter(course)}
                />
                <label>{course}</label>
              </div>
            ))}

            <hr className="divider" />

            <p className="filter-title">📊 Filter by Level</p>

            <div className="filter-option">
              <input
                type="radio"
                name="level"
                checked={selectedLevel === "Advanced"}
                onChange={() => handleLevelFilter("Advanced")}
              />
              <label>Advanced</label>
            </div>

            <div className="filter-option">
              <input
                type="radio"
                name="level"
                checked={selectedLevel === "Senior"}
                onChange={() => handleLevelFilter("Senior")}
              />
              <label>Senior</label>
            </div>

            <button className="clear-btn" onClick={() => { setSelectedCourses([]); setSelectedLevel(""); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

     {loading ? (
  <p>Loading completed trainings...</p>
) : (
  <div className="table-container">
    <table className="certifications-table">
      <thead>
        <tr>
          <th>Emp Id
            <input className="col-search" placeholder="Search ID" value={searchEmpId} onChange={(e) => setSearchEmpId(e.target.value)} />
          </th>
          <th>Employee Name
            <input className="col-search" placeholder="Search Name" value={searchEmpName} onChange={(e) => setSearchEmpName(e.target.value)} />
          </th>
          <th>Course Name
            <input className="col-search" placeholder="Search Course" value={searchCourse} onChange={(e) => setSearchCourse(e.target.value)} />
          </th>
          <th>Level
            <input className="col-search" placeholder="Search Level" value={searchLevelText} onChange={(e) => setSearchLevelText(e.target.value)} />
          </th>
          <th>Start Date
            <input className="col-search" placeholder="Search Start" value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} />
          </th>
          <th>Completed Date
            <input className="col-search" placeholder="Search Completed" value={searchCompletedDate} onChange={(e) => setSearchCompletedDate(e.target.value)} />
          </th>
          <th>Review</th>
          <th>Certificate</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((row, index) => (
          <tr key={index}>
            <td>{row.empId}</td>
            <td
              style={{ color: "#0056d6", fontWeight: "600", cursor: "pointer" }}
              onClick={() => {
                setSelectedEmployee(row);
                setShowSkillMap(true);
              }}
            >
              {row.employeeName}
            </td>
            <td>{row.courseName}</td>
            <td>{row.level}</td>
            <td>{row.startDate}</td>
            <td>{row.completedDate}</td>
            <td className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(row.empId, star)}
                  style={{
                    cursor: "pointer",
                    color: star <= (ratings[row.empId] || 0) ? "#f7c600" : "#ccc",
                    fontSize: "20px",
                    marginRight: "3px"
                  }}
                >
                  ★
                </span>
              ))}
            </td>
            <td className="icon-cell">
              <button className="view-btn" onClick={() => handleViewCertificate(row)}>
                👁️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      <div className="bottom-section">
        <div className="total-count">Total Certifications: {filteredData.length}</div>

        <button className="export-btn-completed" onClick={exportToExcel}>
          ⬇️ Export to Excel
        </button>
      </div>

      {/* ⭐ POPUP SKILL MAP */}
      {showSkillMap && selectedEmployee && (
  <div className="skillmap-overlay">
    <div className="skillmap-container" ref={pdfRef}>

      <button className="skillmap-close-btn" onClick={() => setShowSkillMap(false)}>
        ✖
      </button>

      <h2 className="skillmap-title">EMPLOYEE SKILL MAP</h2>

      <div className="skillmap-section">
        <h3>EMPLOYEE DETAILS</h3>
        <p className="details"><strong>Name:</strong> {selectedEmployee.employeeName}</p>
        <p className="details"><strong>ID:</strong> {selectedEmployee.empId}</p>
        <p className="details"><strong>Course:</strong> {selectedEmployee.courseName}</p>
        <p className="details"><strong>Completed:</strong> {selectedEmployee.completedDate}</p>
        <p className="details"><strong>Level:</strong> {selectedEmployee.level}</p>
      </div>

      <div className="skillmap-section">
        <h3>SKILL PROFICIENCY</h3>

        {selectedEmployee.empId === "E001" && (
          <ul>
            <li>React — Advanced</li>
            <li>JavaScript — Advanced</li>
            {/* <li>UI/UX — Intermediate</li> */}
          </ul>
        )}
         {selectedEmployee.empId === "E002" && (
          <ul>
            <li>Node js — Advanced</li>
            <li>JavaScript — Advanced</li>
            {/* <li>UI/UX — Intermediate</li> */}
          </ul>
        )}
      
        {selectedEmployee.empId === "E003" && (
          <ul>
            <li>Figma — Advanced</li>
            <li>UI/UX — Advanced</li>
            <li>AI Tools — Intermediate</li>
          </ul>
        )}

        {selectedEmployee.empId === "E004" && (
          <ul>
            <li>HTML/CSS — Advanced</li>
            <li>React — Intermediate</li>
            {/* <li>UI/UX — Beginner</li> */}
          </ul>
        )}
        {selectedEmployee.empId === "E005" && (
          <ul>
            <li>React — Advanced</li>
            <li>JavaScript — Advanced</li>
            {/* <li>UI/UX — Intermediate</li> */}
          </ul>
        )}
        {selectedEmployee.empId === "E006" && (
          <ul>
            <li>React Native — Advanced</li>
            <li>JavaScript — Advanced</li>
            {/* <li>UI/UX — Intermediate</li> */}
          </ul>
        )}
        {selectedEmployee.empId === "E007" && (
          <ul>
            <li>Node js — Advanced</li>
            <li>JavaScript — Advanced</li>
            {/* <li>UI/UX — Intermediate</li> */}
          </ul>
        )}
        {selectedEmployee.empId === "E009" && (
          <ul>
            <li>React — Intermediate</li>
            <li>JavaScript — Advanced</li>
            {/* <li>UI/UX — Intermediate</li> */}
          </ul>
        )}
        {selectedEmployee.empId === "E010" && (
          <ul>
            <li>Figma — Advanced</li>
            <li>UI/UX — Advanced</li>
            <li>AI Tools — Intermediate</li>
          </ul>
        )}
        {/* {!["E001", "E003"].includes(selectedEmployee.empId) && (
          <p>No skill mapping added for this employee.</p>
        )} */}
      </div>

      <div className="skillmap-section">
        <h3>Suggestive Trainings</h3>
        
        <p>[UI/UX Masterclass] [React Mastery] [API Essentials]</p>
      </div>

      <div className="skillmap-actions">
        {/* <button className="skillmap-btn-primary">Assign Training</button> */}

        {/* ⭐ DOWNLOAD REPORT BUTTON ⭐ */}
        <button className="skillmap-btn-secondary" 
        onClick={() =>
  navigate("/admin/ReportPage", {
    state: {
      employee: selectedEmployee,   // full employee data
      skills: ratings[selectedEmployee.empId] || 0  // optional stars
    }
  })
}

        >
           Report
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CompletedTraining;
