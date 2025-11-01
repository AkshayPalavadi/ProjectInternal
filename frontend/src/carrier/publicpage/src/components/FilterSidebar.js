import React, { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUserTie,
  FaGraduationCap,
  FaRupeeSign,
  FaTimesCircle,
} from "react-icons/fa";
import "./FilterSidebar.css";

const FilterSidebar = ({ updateFilters }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState("");
  const [salaryRange, setSalaryRange] = useState(0);

  const handleUpdate = (key, value) => {
    updateFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    handleUpdate("searchTerm", e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    handleUpdate("locations", e.target.value ? [e.target.value] : []);
  };

  const handleCheckboxChange = (e, list, setList, key) => {
    const { checked, value } = e.target;
    const updatedList = checked
      ? [...list, value]
      : list.filter((v) => v !== value);
    setList(updatedList);
    handleUpdate(key, updatedList);
  };

  const handleEducationChange = (e) => {
    setEducation(e.target.value);
    handleUpdate("education", e.target.value ? [e.target.value] : []);
  };

  const handleSalaryChange = (e) => {
    const value = Number(e.target.value);
    setSalaryRange(value);
    handleUpdate("maxSalary", value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setJobTypes([]);
    setExperiences([]);
    setEducation("");
    setSalaryRange(0);
    updateFilters({
      searchTerm: "",
      locations: [],
      jobTypes: [],
      experiences: [],
      education: [],
      maxSalary: 0,
    });
  };

  return (
    <aside className="sidebar">
      {/* Search */}
      <div className="filter-section">
        <h3><FaSearch className="filter-icon" /> Search</h3>
        <input
          type="text"
          placeholder="Search by job title..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Location */}
      <div className="filter-section">
        <h3><FaMapMarkerAlt className="filter-icon" /> Location</h3>
        <select
          className="dropdown"
          value={location}
          onChange={handleLocationChange}
        >
          <option value="">All Cities</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Bengaluru">Bengaluru</option>
        </select>
      </div>

      {/* Job Type */}
      <div className="filter-section">
        <h3><FaBriefcase className="filter-icon" /> Job Type</h3>
        <ul>
          {["Full Time", "Part Time"].map((type) => (
            <li key={type}>
              <input
                type="checkbox"
                value={type}
                checked={jobTypes.includes(type)}
                onChange={(e) =>
                  handleCheckboxChange(e, jobTypes, setJobTypes, "jobTypes")
                }
              />
              {type}
            </li>
          ))}
        </ul>
      </div>

      {/* Experience */}
      <div className="filter-section">
        <h3><FaUserTie className="filter-icon" /> Experience Level</h3>
        <ul>
          {["Fresher", "1-2 Years", "2+ Years"].map((exp) => (
            <li key={exp}>
              <input
                type="checkbox"
                value={exp}
                checked={experiences.includes(exp)}
                onChange={(e) =>
                  handleCheckboxChange(
                    e,
                    experiences,
                    setExperiences,
                    "experiences"
                  )
                }
              />
              {exp}
            </li>
          ))}
        </ul>
      </div>

      {/* Education */}
      <div className="filter-section">
        <h3><FaGraduationCap className="filter-icon" /> Education</h3>
        <select
          className="dropdown"
          value={education}
          onChange={handleEducationChange}
        >
          <option value="">All</option>
          <option value="B.Tech">B.Tech</option>
          <option value="M.Tech">M.Tech</option>
          <option value="B.Sc">B.Sc</option>
          <option value="MBA">MBA</option>
        </select>
      </div>

      {/* Salary */}
      <div className="filter-section">
        <h3><FaRupeeSign className="filter-icon" /> Max Salary: ₹{salaryRange.toLocaleString()}</h3>
        <input
          type="range"
          min="0"
          max="2000000"
          step="50000"
          value={salaryRange}
          onChange={handleSalaryChange}
        />
      </div>

      {/* Clear Filters */}
      <div className="filter-section">
        <button className="clear-btn" onClick={clearFilters}>
          <FaTimesCircle className="filter-icon-f" /> Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
