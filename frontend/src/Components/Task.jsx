import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./Task.css";

export default function Task({ selectedFY, onUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employeeId = localStorage.getItem("empId") || "EMP-101";
  const employeeName = localStorage.getItem("userName") || "You";
  const currentDate = new Date();
  const fyShort = String(currentDate.getFullYear()).slice(-2);
  const currentFY = `FY${fyShort}`;

  // Fetch tasks for selected FY and this employee
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://internal-website-rho.vercel.app/api/tasks");
        const data = await res.json();
        const filtered = data.filter(
          (t) => t.fy === selectedFY && t.employeeId === employeeId
        );
        setTasks(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedFY, employeeId]);

  // Save task to API
  const saveTaskToAPI = async (taskData) => {
    try {
      const payload = {
        id: taskData.id || `TASK-${Date.now()}`,
        employeeId,
        fy: selectedFY,
        text: taskData.text,
        assigned: employeeName, // Use actual username
        assignedDate: taskData.assignedDate || new Date().toISOString(),
        dueDate: new Date(taskData.dueDate).toISOString(),
        status: "Open",
      };

      const res = await fetch("https://internal-website-rho.vercel.app/api/tasks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save task");
      const saved = await res.json();
      return saved;
    } catch (err) {
      console.error(err);
      setError("Failed to save task");
      return null;
    }
  };

  const deleteTaskFromAPI = async (taskId) => {
    try {
      const res = await fetch(`https://internal-website-rho.vercel.app/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
      return false;
    }
  };

  const addTask = () => {
    if (selectedFY !== currentFY) return;
    const todayISO = new Date().toISOString();
    setNewTask({
      text: "",
      dueDate: todayISO,
      assignedDate: todayISO,
    });
  };

  const handleSave = async () => {
    if (!newTask.text || !newTask.dueDate) return;
    const saved = await saveTaskToAPI(newTask);
    if (saved) {
      const updatedTasks = [...tasks, saved];
      setTasks(updatedTasks);
      onUpdate(updatedTasks); // update parent
      setNewTask(null);
    }
  };

  const handleDelete = async (taskId) => {
    const success = await deleteTaskFromAPI(taskId);
    if (success) {
      const updatedTasks = tasks.filter((t) => t.id !== taskId);
      setTasks(updatedTasks);
      onUpdate(updatedTasks);
    }
  };

  return (
    <div className="tasks-container">
      <h3>Assigned Tasks ({selectedFY})</h3>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned By</th>
              <th>Assigned Date</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && !newTask && (
              <tr key="no-tasks">
                <td colSpan="5">No tasks assigned.</td>
              </tr>
            )}

            {tasks.map((task, index) => (
              <tr key={task._id || task.id || `task-${index}`}>
                <td>{task.text}</td>
                <td>{task.assigned}</td>
                <td>{new Date(task.assignedDate).toLocaleDateString()}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(task.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {newTask && (
              <tr key="new-task">
                <td>
                  <input
                    type="text"
                    value={newTask.text}
                    onChange={(e) =>
                      setNewTask({ ...newTask, text: e.target.value })
                    }
                  />
                </td>
                <td>{employeeName}</td>
                <td>{new Date(newTask.assignedDate).toLocaleDateString()}</td>
                <td>
                  <input
                    type="date"
                    value={newTask.dueDate.split("T")[0]}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    onClick={handleSave}
                    disabled={!newTask.text || !newTask.dueDate}
                  >
                    Save
                  </button>
                  <button onClick={() => setNewTask(null)}>Cancel</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {!newTask && (
        <button onClick={addTask} disabled={selectedFY !== currentFY}>
          + Add Task
        </button>
      )}
    </div>
  );
}
