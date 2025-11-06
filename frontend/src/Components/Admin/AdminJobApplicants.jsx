import React, { useState } from "react";
import "./AdminJobApplicants.css";
import { FaSliders } from "react-icons/fa6"; // filter icon
import * as XLSX from "xlsx";
import JobApplicants from "./JobAplicants";

//   const allApplicants = [
//     { id: "001", name: "N.Gangadhar", skills: "HTML, React JS, Java", experience: "0yrs", salary: "20,000", location: "Hyderabad", contact: "9000000001", month:"sep" },
//     { id: "002", name: "R.Jagadeesh", skills: "Python, React JS, Java", experience: "2yrs", salary: "35,000", location: "Hyderabad", contact: "9000000002" },
//     { id: "003", name: "N.Tatajii", skills: "Python, React JS, Java, SQL", experience: "1yr", salary: "25,000", location: "Chennai", contact: "9000000003" },
//     { id: "004", name: "A.Likhith", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000004" },
//     { id: "005", name: "A.Sushma", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000005" },
//     { id: "006", name: "P.Devi", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: "40,000", location: "Mumbai", contact: "9000000006" },
//     { id: "007", name: "K.Sravani", skills: "HTML, React JS, Java", experience: "0yrs", salary: "20,000", location: "Hyderabad", contact: "9000000007" },
//     { id: "008", name: "Karthik", skills: "Python, React JS, Java", experience: "2yrs", salary: "35,000", location: "Hyderabad", contact: "9000000008" },
//     { id: "009", name: "N.Madhu", skills: "Python, React JS, Java, SQL", experience: "1yr", salary: "25,000", location: "Chennai", contact: "9000000009" },
//     { id: "010", name: "Mahindra", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000010" },
//     { id: "011", name: "Rohith", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000011" },
  
//     { id: "012", name: "P.Akshay", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: "40,000", location: "Mumbai", contact: "9000000012" },
//    { id: "013", name: "Vaishnavi", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000013" },
//     { id: "014", name: "K.Lavanya", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000014" },
//     { id: "015", name: "Sathvika", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: "40,000", location: "Mumbai", contact: "9000000015" },
//    { id: "016", name: "Suji", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000010" },
//     { id: "017", name: "M.Eswari", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000011" },
//     { id: "018", name: "Bhargavi", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: "40,000", location: "Mumbai", contact: "9000000012" },
//   ];
//   const [filteredApplicants, setFilteredApplicants] = useState(data);
//   const [showFilter, setShowFilter] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [selectedExperience, setSelectedExperience] = useState("");

//   // Apply Filters
//   const applyFilters = () => {
//     // let result = allApplicants;
//     let result = data;

//     if (selectedLocation) {
//       result = result.filter((a) =>
//         a.location.toLowerCase().includes(selectedLocation.toLowerCase())
//       );
//     }

//     if (selectedExperience) {
//       result = result.filter((a) =>
//         a.experience.toLowerCase().includes(selectedExperience.toLowerCase())
//       );
//     }

//     setFilteredApplicants(result);
//     setShowFilter(false);
//   };

//   const resetFilters = () => {
//     setSelectedLocation("");
//     setSelectedExperience("");
//     // setFilteredApplicants(allApplicants);
//     setFilteredApplicants(data);
//   };

//   // Export to Excel
//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(filteredApplicants);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Applicants");
//     XLSX.writeFile(wb, "Job_Applicants.xlsx");
//   };

//   // Total applied jobs
//   const totalAppliedJobs = filteredApplicants.length;

//   return (
//     <div className="applicants-container">
//       <div className="header-section">
//         <h2>
//           Job Applicants{" "}
//           <span className="total-count">({totalAppliedJobs} Applications)</span>
//         </h2>
//         <div
//           className="filter-icon"
//           title="Filter Applicants"
//           onClick={() => setShowFilter(!showFilter)}
//         >
//           <FaSliders />
//         </div>

//         {/* Filter Dropdown */}
//         {showFilter && (
//           <div className="filter-dropdown">
//             <h4>Filter Applicants</h4>

//             <div className="filter-field">
//               <label>Location:</label>
//               <input
//                 type="text"
//                 placeholder="e.g. Hyderabad"
//                 value={selectedLocation}
//                 onChange={(e) => setSelectedLocation(e.target.value)}
//               />
//             </div>

//             <div className="filter-field">
//               <label>Experience:</label>
//               <input
//                 type="text"
//                 placeholder="e.g. 2yrs"
//                 value={selectedExperience}
//                 onChange={(e) => setSelectedExperience(e.target.value)}
//               />
//             </div>

//             <div className="filter-actions">
//               <button onClick={applyFilters}>Apply</button>
//               <button onClick={resetFilters} className="reset-btn">
//                 Reset
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="table-wrapper">
//         <table className="applicants-table">
//           <thead>
//             <tr>
//               <th></th>
//               <th>S.No</th>
//               <th>Applicant</th>
//               <th>Skills</th>
//               <th>Experience</th>
//               <th>Exp Salary/M</th>
//               <th>Location</th>
//               <th>Contact</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredApplicants.map((app) => (
//               <tr key={app.id}>
//                 <td>
//                   <input type="checkbox" />
//                 </td>
//                 <td>{app.id}</td>
//                 <td>{app.name}</td>
//                 <td>{app.skills}</td>
//                 <td>{app.experience}</td>
//                 <td>{app.salary}</td>
//                 <td>{app.location}</td>
//                 <td>{app.contact}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="export-btn-container">
//         <button className="export-btn" onClick={exportToExcel}>
//           Export to Excel
//         </button>
//       </div>
//     </div>
//   );
// };


const AdminJobApplicants = () => {
  const allApplicants = [
    { id: "001", name: "N.Gangadhar", skills: "HTML, React JS, Java", experience: "0yrs", salary: "20,000", location: "Hyderabad", contact: "9000000001", month:"september" },
    { id: "002", name: "R.Jagadeesh", skills: "Python, React JS, Java", experience: "2yrs", salary: "35,000", location: "Hyderabad", contact: "9000000002", month:"september" },
    { id: "003", name: "N.Tatajii", skills: "Python, React JS, Java, SQL", experience: "1yr", salary: "25,000", location: "Chennai", contact: "9000000003", month:"octomber" },
    { id: "004", name: "A.Likhith", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000004", month:"octomber" },
    { id: "005", name: "A.Sushma", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000005", month:"octomber" },
    { id: "006", name: "P.Devi", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: "40,000", location: "Mumbai", contact: "9000000006", month:"January" },
    { id: "007", name: "K.Sravani", skills: "HTML, React JS, Java", experience: "0yrs", salary: "20,000", location: "Hyderabad", contact: "9000000007", month:"February" },
    { id: "008", name: "Karthik", skills: "Python, React JS, Java", experience: "2yrs", salary: "35,000", location: "Hyderabad", contact: "9000000008", month:"February" },
    { id: "009", name: "N.Madhu", skills: "Python, React JS, Java, SQL", experience: "1yr", salary: "25,000", location: "Chennai", contact: "9000000009", month:"April" },
    { id: "010", name: "Mahindra", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000010", month:"April" },
    { id: "011", name: "Rohith", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000011", month:"May" },

    { id: "012", name: "P.Akshay", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: "40,000", location: "Mumbai", contact: "9000000012", month:"June" },
   { id: "013", name: "Vaishnavi", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000013", month:"June" },
    { id: "014", name: "K.Lavanya", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000014", month:"July" },
    { id: "015", name: "Sathvika", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: "40,000", location: "Mumbai", contact: "9000000015", month:"August" },
   { id: "016", name: "Suji", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000010", month:"August" },
    { id: "017", name: "M.Eswari", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000011", month:"March" },
    { id: "018", name: "Bhargavi", skills: "HTML, CSS, JavaScript", experience: "2yrs", salary: "40,000", location: "Mumbai", contact: "9000000012", month:"March" },
  ];

  return(
    <div>
      <JobApplicants data={allApplicants} onAdminJobApplicants/>
    </div>
  )
}


export default AdminJobApplicants;