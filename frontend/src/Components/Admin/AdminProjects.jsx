import React, { useState, useEffect, useRef } from "react";
import "./AdminProjects.css";

const calculateStatus = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  if (today < start) return "Future";
  if (today >= start && today <= end) return "In Progress";
  return "Completed";
};

const calculateWorkingDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

function AdminProjects({ employees }) {
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const editRef = useRef(null);

  // Load projects from localStorage
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  }, []);

  const toggleEmployee = (id) => {
    if (assignedEmployees.includes(id)) {
      setAssignedEmployees(prev => prev.filter(eid => eid !== id));
    } else {
      setAssignedEmployees(prev => [...prev, id]);
    }
  };

  const handleSaveProject = () => {
    if (!projectName || !startDate || !endDate || assignedEmployees.length === 0) {
      alert("Please fill all fields and assign at least one employee.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert("End Date cannot be before Start Date");
      return;
    }

    const duration = calculateWorkingDays(startDate, endDate);

    if (editingProjectId) {
      // Update existing project
      const updatedProjects = projects.map(p =>
        p.id === editingProjectId
          ? { ...p, endDate, assignedEmployees, duration }
          : p
      );
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      setEditingProjectId(null);
    } else {
      // Add new project
      const newProject = {
        id: Date.now(),
        name: projectName,
        startDate,
        endDate,
        duration,
        assignedEmployees: [...assignedEmployees],
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
    }

    resetForm();
  };

  const handleEditProject = (project) => {
    setProjectName(project.name);
    setStartDate(project.startDate);
    setEndDate(project.endDate);
    setAssignedEmployees([...project.assignedEmployees]);
    setEditingProjectId(project.id);

    // Scroll to edit block
    if (editRef.current) {
      editRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    resetForm();
  };

  const handleDeleteProject = (project) => {
    const status = calculateStatus(project.startDate, project.endDate);
    if (status === "Completed") {
      alert("Completed projects cannot be deleted.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      const updatedProjects = projects.filter(p => p.id !== project.id);
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
    }
  };

  const resetForm = () => {
    setProjectName("");
    setStartDate("");
    setEndDate("");
    setAssignedEmployees([]);
  };

  return (
    <div className="admin-container">
      <div className="admin-main" ref={editRef}>
        <h2>{editingProjectId ? "Edit Project" : "Add Project"}</h2>
        <div className="add-project-form">
          <div className="input-project">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={editingProjectId !== null}
          />
          </div>
          <div className="date-fields">
  <div className="date-group">
    <label>Start Date:</label>
    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
  </div>
  <div className="date-group">
    <label>End Date:</label>
    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
  </div>
</div>

          <div className="employee-selection">
            <p>Assign Employees:</p>
            {employees.map(emp => (
              <label key={emp.id}>
                <input
                  type="checkbox"
                  checked={assignedEmployees.includes(emp.id)}
                  onChange={() => toggleEmployee(emp.id)}
                />
                {emp.name}
              </label>
            ))}
          </div>
          <p>Duration: {calculateWorkingDays(startDate, endDate)} days</p>
          <div className="form-buttons">
            <button onClick={handleSaveProject}>{editingProjectId ? "Update Project" : "Add Project"}</button>
            {editingProjectId && <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>}
          </div>
        </div>

        {/* Projects Table */}
        {projects.length > 0 && (
          <div className="projects-table-container">
            <h2>Projects Overview</h2>
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Assigned Employees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => {
                  const status = calculateStatus(p.startDate, p.endDate);
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.startDate}</td>
                      <td>{p.endDate}</td>
                      <td>{p.duration}</td>
                      <td>{p.assignedEmployees.map(id => employees.find(e => e.id === id)?.name).join(", ")}</td>
                      <td>
                        <button onClick={() => handleEditProject(p)}>Edit</button>
                        <button
                          onClick={() => handleDeleteProject(p)}
                          disabled={status === "Completed"}
                          style={{ marginLeft: "5px" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProjects;
