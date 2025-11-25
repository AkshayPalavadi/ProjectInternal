import React, { useState } from "react";
import FilterSidebar from "../carriercomponents/FilterSidebar";
import JobList from "./JobList";
import "./Job.css"; // contains .jobs-container CSS
import Header from "../carriercomponents/Header";

const Job = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    locations: [],
    jobTypes: [],
    experiences: [],
    education: "All",
    salaryRange: 150000,
  });

  return (
    <div>
      {/* ⭐ Header Added */}
      <header >
        <Header/>
      </header>

      {/* Main Layout */}
      <div className="jobs-container">
        <FilterSidebar updateFilters={setFilters} />
        <JobList filters={filters} />
      </div>
    </div>
  );
};

export default Job;
