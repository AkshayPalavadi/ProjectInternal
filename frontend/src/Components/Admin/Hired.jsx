import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FiFilter, FiDownload } from "react-icons/fi";
import "./Hired.css";

const Hired = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const applicants = useMemo(
    () => [
      { id: "001", name: "Meena Reddy", skills: "HTML, React JS, Java", experience: "0yrs", salary: "20000", location: "Hyderabad", doj: "To Be Announced" },
      { id: "002", name: "Ramesh Reddy", skills: "Python, React JS, Java", experience: "2yrs", salary: "35000", location: "Hyderabad", doj: "24/3/27" },
      { id: "003", name: "Srujana", skills: "Python, React JS, Java, SQL", experience: "1yr", salary: "25000", location: "Chennai", doj: "Acceptance Pending" },
      { id: "004", name: "Kumari", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30000", location: "Bangalore", doj: "22/4/27" },
      { id: "005", name: "Devika", skills: "MongoDB, Node JS, React", experience: "0yrs", salary: "15000", location: "Hyderabad", doj: "Offer Accepted" },
      { id: "006", name: "Hari Prasad", skills: "HTML, CSS, Javascript", experience: "2yrs", salary: "40000", location: "Mumbai", doj: "30/5/26" },
    ],
    []
  );

  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(applicants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hired");
    XLSX.writeFile(workbook, "Hired_List.xlsx");
  };

  return (
    <div className="hired-container">
      {/* Header */}
      <div className="hired-header">
        <h1 className="hired-title">Hired Applicants</h1>
        <div className="hired-header-actions">
          <button className="icon-btn" title="Filter">
            <FiFilter />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="hired-card">
        <table className="hired-table">
          <thead>
            <tr>
              <th></th>
              <th>S.No</th>
              <th>Applicant</th>
              <th>Skills</th>
              <th>Experience</th>
              <th>Exp Salary / M</th>
              <th>Location</th>
              <th>DOJ</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <tr
                key={a.id}
                className={selectedRows.includes(a.id) ? "selected-row" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(a.id)}
                    onChange={() => handleCheckbox(a.id)}
                  />
                </td>
                <td>{a.id}</td>
                <td className="font-semibold text-gray-800">{a.name}</td>
                <td className="text-gray-600">{a.skills}</td>
                <td className="text-gray-600">{a.experience}</td>
                <td className="font-semibold text-gray-900">
                  ₹{Number(a.salary).toLocaleString("en-IN")}
                </td>
                <td>{a.location}</td>
                <td className="doj">{a.doj}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="hired-footer">
        <button onClick={exportToExcel} className="export-btn">
          <FiDownload className="mr-2" /> Export to Excel
        </button>
      </div>
    </div>
  );
};

export default Hired;
