import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { FiSearch, FiFilter } from "react-icons/fi";
import "./Assigned.css";

const Assigned = () => {
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
  const [trainings, setTrainings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


  const filterRef = useRef(null); // ⭐ NEW
useEffect(() => {
  const fetchAssignedTrainings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://internal-website-rho.vercel.app/api/training/assigned"
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      // Map API response to match table structure
      const formattedData = data.tasks.map((t) => ({
        id: t.employeeId,
        name: t.employeeName,
        course: t.trainingTitle,
        start: new Date(t.fromDate).toLocaleDateString("en-GB"),
        end: new Date(t.toDate).toLocaleDateString("en-GB"),
        progress: 0, // Set 0 or calculate if backend provides progress
      }));

      setTrainings(formattedData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch assigned trainings");
      setLoading(false);
    }
  };

  fetchAssignedTrainings();
}, []);

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
    XLSX.utils.book_append_sheet(wb, ws, "AssignedTrainings");
    XLSX.writeFile(wb, "Assigned_Trainings.xlsx");
  };

  return (
    <div className="Assigned-container">
      <h1 className="title">Assign-Trainings</h1>

      <div className="search-section-Assigned">
        <div className="filter-box-Assigned">
          <FiFilter
            className="filter-icon-Assigned"
            onClick={() => setShowFilter(!showFilter)}
          />

          {showFilter && (
            <div className="filter-dropdown-Assigned right" ref={filterRef}>  {/* ⭐ NEW */}
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

              {/* <p className="filter-title">📊 Filter by Progress</p> */}


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
        {loading && <p>Loading assigned trainings...</p>} 
        {error && <p style={{ color: "red" }}>{error}</p>}
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

              {/* <th>Status</th> */}
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
                      {/* <p className="progress-percentage-text">{t.progress}%</p> */}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className="Assigned-footer">
        <p>
          Total Employees in Training: <strong>{filtered.length}</strong>
        </p>

        <button onClick={exportToExcel} className="export-btn-Assigned">
          ⬇️ Export to Excel
        </button>
      </div>
    </div>
  );
};

export default Assigned;
