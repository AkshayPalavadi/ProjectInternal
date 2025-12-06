import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { FiFilter } from "react-icons/fi";
import "./InProgress.css";

const InProgress = () => {
  const [searchFilters, setSearchFilters] = useState({
    id: "",
    name: "",
    course: "",
    level: "",
    start: "",
    end: "",
  });

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState("");

  const filterRef = useRef(null); // ⭐ for closing on outside click
const [trainings, setTrainings] = useState([]);
const [loading, setLoading] = useState(true);


  const courses = [...new Set(trainings.map((t) => t.course))];
  const levels = [...new Set(trainings.map((t) => t.level))];
useEffect(() => {
  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://internal-website-rho.vercel.app/api/training/tasks/in-progress"
      );
      const data = await response.json();

      // Map API response to the format your table expects
      const mappedData = data.tasks.map((t) => ({
        id: t.employeeId,
        name: t.employeeName,
        course: t.trainingTitle,
        level: t.level,
        start: new Date(t.fromDate).toLocaleDateString("en-GB"), // format DD/MM/YYYY
        end: new Date(t.toDate).toLocaleDateString("en-GB"),
        progress: 50, // Or any logic if your API has progress info
      }));

      setTrainings(mappedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching in-progress trainings:", error);
      setLoading(false);
    }
  };

  fetchTrainings();
}, []);

  // ⭐ Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCourseFilter = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handleLevelFilter = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  const handleProgressFilter = (value) => {
    setSelectedProgress(value === selectedProgress ? "" : value);
  };

  const totalSelectedCourseApplicants = trainings.filter((t) =>
    selectedCourses.length === 0 ? true : selectedCourses.includes(t.course)
  ).length;

  const filtered = trainings.filter((t) => {
    const matchesId = t.id.toLowerCase().includes(searchFilters.id.toLowerCase());
    const matchesName = t.name.toLowerCase().includes(searchFilters.name.toLowerCase());
    const matchesCourse = t.course.toLowerCase().includes(searchFilters.course.toLowerCase());
    const matchesLevel = t.level.toLowerCase().includes(searchFilters.level.toLowerCase());
    const matchesStart = t.start.toLowerCase().includes(searchFilters.start.toLowerCase());
    const matchesEnd = t.end.toLowerCase().includes(searchFilters.end.toLowerCase());

    const matchesCourseFilter =
      selectedCourses.length === 0 || selectedCourses.includes(t.course);

    const matchesLevelFilter =
      selectedLevels.length === 0 || selectedLevels.includes(t.level);

    const matchesProgress =
      selectedProgress === "" ||
      (selectedProgress === "below90" && t.progress < 90) ||
      (selectedProgress === "90to99" && t.progress >= 90 && t.progress < 100) ||
      (selectedProgress === "100" && t.progress === 100);

    return (
      matchesId &&
      matchesName &&
      matchesCourse &&
      matchesLevel &&
      matchesStart &&
      matchesEnd &&
      matchesCourseFilter &&
      matchesLevelFilter &&
      matchesProgress
    );
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CompletedTrainings");
    XLSX.writeFile(wb, "Completed_Trainings.xlsx");
  };

  return (
    <div className="completed-container">
      <h1 className="title">In Progress</h1>

      <div className="search-section-completed">
        <div className="filter-box-completed" ref={filterRef}>
          <FiFilter
            className="filter-icon-completed"
            onClick={() => setShowFilter(!showFilter)}
          />

          {showFilter && (
            <div className="filter-dropdown-completed right">
              <p className="filter-title">📘 Filter by Course</p>

              {courses.map((course, index) => (
                <div className="filter-option" key={index}>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course)}
                    onChange={() => handleCourseFilter(course)}
                  />
                  <label>{course}</label>
                </div>
              ))}

              {selectedCourses.length > 0 && (
                <p className="selected-course-count">
                  Selected Course Applicants:{" "}
                  <strong>{totalSelectedCourseApplicants}</strong>
                </p>
              )}

              <hr className="divider" />

              <p className="filter-title">🎯 Filter by Level</p>

              {levels.map((level, index) => (
                <div className="filter-option" key={index}>
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level)}
                    onChange={() => handleLevelFilter(level)}
                  />
                  <label>{level}</label>
                </div>
              ))}

              <hr className="divider" />

              <p className="filter-title">📊 Filter by Progress</p>

              <div className="filter-option">
                <input
                  type="radio"
                  name="progress"
                  checked={selectedProgress === "below90"}
                  onChange={() => handleProgressFilter("below90")}
                />
                <label>Below 90%</label>
              </div>

              <div className="filter-option">
                <input
                  type="radio"
                  name="progress"
                  checked={selectedProgress === "90to99"}
                  onChange={() => handleProgressFilter("90to99")}
                />
                <label>90% - 99%</label>
              </div>

              <div className="filter-option">
                <input
                  type="radio"
                  name="progress"
                  checked={selectedProgress === "100"}
                  onChange={() => handleProgressFilter("100")}
                />
                <label>100%</label>
              </div>

              <button
                className="clear-btn"
                onClick={() => {
                  setSelectedCourses([]);
                  setSelectedLevels([]);
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
                Level
                <input
                  type="text"
                  placeholder="Search Level"
                  className="column-search"
                  value={searchFilters.level}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, level: e.target.value })
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
                Completed Date
                <input
                  type="text"
                  placeholder="Search Completed"
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
                <td>{t.level}</td>
                <td>{t.start}</td>
                <td>{t.end}</td>

                <td>
                  <div className="progress-wrapper">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${t.progress}%`,
                        backgroundColor:
                          t.progress === 50
                            ? "#4ade80"
                            : t.progress >= 90
                            ? "#facc15"
                            : "#f97316",
                      }}
                    >
                      <p className="progress-percentage-text">
                        {t.progress}%
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="completed-footer">
        <p>
          Total Employees Completed Training:{" "}
          <strong>{filtered.length}</strong>
        </p>

        <button onClick={exportToExcel} className="export-btn-completed">
          ⬇️ Export to Excel
        </button>
      </div>
    </div>
  );
};

export default InProgress;
