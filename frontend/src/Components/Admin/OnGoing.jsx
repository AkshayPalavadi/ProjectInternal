import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { FiSearch, FiFilter } from "react-icons/fi";
import "./OnGoing.css";

const OnGoing = () => {
  const [searchFilters, setSearchFilters] = useState({
    id: "",
    name: "",
    course: "",
    start: "",
    end: "",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState("");

  const filterRef = useRef(null); // ⭐ NEW

  // ⭐ CLICK OUTSIDE TO CLOSE FILTER
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const trainings = [
    { id: "E001", name: "Likith ", course: "React-Native", start: "01-Oct-2025", end: "01-Nov-2025", progress: 30 },
    { id: "E002", name: "Sushma", course: "Node.js & Express Deep Dive", start: "25-Sep-2025", end: "25-Oct-2025", progress: 75 },
    { id: "E003", name: "Devi", course: "AI for UI/UX Designers", start: "02-Oct-2025", end: "01-Nov-2025", progress: 80 },
    { id: "E004", name: "Sravani", course: "Web- Development", start: "28-Oct-2025", end: "25-Nov-2025", progress: 25 },
    { id: "E005", name: "Ganagadhar", course:" React.js & React-Native", start: "01-Oct-2025", end: "01-Nov-2025", progress: 55 },
    { id: "E006", name: "Tataji", course: "Full Stack Web Development", start: "05-Oct-2025", end: "05-Nov-2025", progress: 60 },
    { id: "E007", name: "Jagadeesh", course: "React.js Mastery", start: "06-Oct-2025", end: "06-Nov-2025", progress: 70 },
    { id: "E008", name: "Lavanya", course: "Node.js & Express Deep Dive", start: "10-Oct-2025", end: "10-Nov-2025", progress: 40 },
    { id: "E009", name: "Rohit Sai", course: "Node.js & Express Deep Dive", start: "12-Oct-2025", end: "12-Nov-2025", progress: 45 },
    { id: "E010", name: "Somu Sunder", course: "AI for UI/UX Designers", start: "13-Oct-2025", end: "13-Nov-2025", progress: 50 },
  ];

  const courses = [...new Set(trainings.map((t) => t.course))];

  const handleCourseFilter = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handleProgressFilter = (value) => {
    setSelectedProgress(value === selectedProgress ? "" : value);
  };

  const filtered = trainings.filter((t) => {
    const matchesId = t.id.toLowerCase().includes(searchFilters.id.toLowerCase());
    const matchesName = t.name.toLowerCase().includes(searchFilters.name.toLowerCase());
    const matchesCourse = t.course.toLowerCase().includes(searchFilters.course.toLowerCase());
    const matchesStart = t.start.toLowerCase().includes(searchFilters.start.toLowerCase());
    const matchesEnd = t.end.toLowerCase().includes(searchFilters.end.toLowerCase());

    const matchesCourseFilter =
      selectedCourses.length === 0 || selectedCourses.includes(t.course);

    const matchesProgress =
      selectedProgress === "" ||
      (selectedProgress === "below50" && t.progress < 50) ||
      (selectedProgress === "50to75" && t.progress >= 50 && t.progress <= 75) ||
      (selectedProgress === "above75" && t.progress > 75);

    return (
      matchesId &&
      matchesName &&
      matchesCourse &&
      matchesStart &&
      matchesEnd &&
      matchesCourseFilter &&
      matchesProgress
    );
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OngoingTrainings");
    XLSX.writeFile(wb, "Ongoing_Trainings.xlsx");
  };

  return (
    <div className="ongoing-container">
      <h1 className="title">On-Going Trainings</h1>

      <div className="search-section-ongoing">
        <div className="filter-box-ongoing">
          <FiFilter
            className="filter-icon-ongoing"
            onClick={() => setShowFilter(!showFilter)}
          />

          {showFilter && (
            <div className="filter-dropdown-ongoing right" ref={filterRef}>  {/* ⭐ NEW */}
              <p className="filter-title">🎓 Filter by Course</p>
              {courses.map((course, index) => (
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

              <p className="filter-title">📊 Filter by Progress</p>

              <div className="filter-option">
                <input
                  type="radio"
                  name="progress"
                  checked={selectedProgress === "below50"}
                  onChange={() => handleProgressFilter("below50")}
                />
                <label>Below 50%</label>
              </div>

              <div className="filter-option">
                <input
                  type="radio"
                  name="progress"
                  checked={selectedProgress === "50to75"}
                  onChange={() => handleProgressFilter("50to75")}
                />
                <label>50% - 70%</label>
              </div>

              <div className="filter-option">
                <input
                  type="radio"
                  name="progress"
                  checked={selectedProgress === "above75"}
                  onChange={() => handleProgressFilter("above75")}
                />
                <label>Above 75%</label>
              </div>

              <button
                className="clear-btn"
                onClick={() => {
                  setSelectedCourses([]);
                  setSelectedProgress("");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="training-table">
          <thead>
            <tr>
              <th>
                Emp ID
                <input
                  type="text"
                  placeholder="Search ID"
                  className="column-search"
                  value={searchFilters.id}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, id: e.target.value })
                  }
                />
              </th>

              <th>
                Employee Name
                <input
                  type="text"
                  placeholder="Search Name"
                  className="column-search"
                  value={searchFilters.name}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, name: e.target.value })
                  }
                />
              </th>

              <th>
                Course Name
                <input
                  type="text"
                  placeholder="Search Course"
                  className="column-search"
                  value={searchFilters.course}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, course: e.target.value })
                  }
                />
              </th>

              <th>
                Start Date
                <input
                  type="text"
                  placeholder="Search Start"
                  className="column-search"
                  value={searchFilters.start}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, start: e.target.value })
                  }
                />
              </th>

              <th>
                End Date
                <input
                  type="text"
                  placeholder="Search End"
                  className="column-search"
                  value={searchFilters.end}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, end: e.target.value })
                  }
                />
              </th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t, i) => (
              <tr key={i}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.course}</td>
                <td>{t.start}</td>
                <td>{t.end}</td>
                <td>
                  <div className="progress-wrapper">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${t.progress}%`,
                        backgroundColor:
                          t.progress >= 75
                            ? "#4ade80"
                            : t.progress >= 50
                            ? "#facc15"
                            : "#f97316",
                      }}
                    >
                      <p className="progress-percentage-text">{t.progress}%</p>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className="onGoing-footer">
        <p>
          Total Employees in Training: <strong>{filtered.length}</strong>
        </p>

        <button onClick={exportToExcel} className="export-btn-ongoing">
          ⬇️ Export to Excel
        </button>
      </div>
    </div>
  );
};

export default OnGoing;
