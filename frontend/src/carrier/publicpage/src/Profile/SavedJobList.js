import React, { useState } from "react";
import "./SavedJobList.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";

const SavedJobList = () => {
  const [jobs, setJobs] = useState([
    { title: "Frontened Developer", type: "Full Time", date: "12/06/2022", category: "Technology" },
    { title: "Content Writing", type: "Internship", date: "12/06/2022", category: "Technology" },
    { title: "Backened Developer", type: "Part time", date: "12/06/2022", category: "Technology" },
    { title: "Web Developer", type: "Full Time", date: "12/06/2022", category: "Technology" },
  ]);

  const handleDelete = (index) => {
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
  };

  const handleView = (job) => {
    alert(`Viewing job: ${job.title}`);
  };

  return (
    <div className="saved-job-container">
      <h3 className="saved-job-title">My Saved Job List</h3>

      <table className="saved-job-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Job Type</th>
            <th>Posted Date</th>
            <th>Job Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <tr key={index}>
                <td>{job.title}</td>
                <td>{job.type}</td>
                <td>{job.date}</td>
                <td>{job.category}</td>
                <td className="action-icons">
                  <FaTrashAlt
                    className="delete-icon"
                    onClick={() => handleDelete(index)}
                  />
                  <FaEye
                    className="view-icon"
                    onClick={() => handleView(job)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
                No saved jobs.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SavedJobList;