// import React from 'react'

// import JobList from './components/JobList';
// import Header from './components/Header';
// import FilterSidebar from './components/FilterSidebar';
// import JobDetail from './components/JobDetail';
// // import JobList from "./JobList";

// const Job = () => {
//   return (
    
//     <div>
        
//       <Header />
//       <div className="main-container">
//         <FilterSidebar />
//         <JobList />
//         {/* <JobDetail /> */}
        
//       </div>
//         Job
//         </div>
    
//   )
// }

// export default Job



import React, { useState } from "react";
import Header from "./components/Header";
import FilterSidebar from "./components/FilterSidebar";
import JobList from "./Jobs/JobList";
import "./Job.css"; // make sure you have layout styling

const Job = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    locations: [],
    jobTypes: [],
    experiences: [],
    education: [],
    maxSalary: 0,
  });

  return (
    <div>
      <Header />
      <div className="main-container">
        {/* ✅ One single FilterSidebar */}
        <FilterSidebar updateFilters={setFilters} />

        {/* ✅ JobList gets filters */}
        <JobList filters={filters} />
      </div>
    </div>
  );
};

export default Job;
