import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Task.css";

export default function Task({ selectedFY, onUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employeeId = "EMP-101"; // static for now
  const currentDate = new Date();
  const fyShort = String(currentDate.getFullYear()).slice(-2);
  const currentFY = `FY${fyShort}`; // ✅ backend expects FY25 format

  // ✅ Fetch tasks from API
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
        console.error("Fetch error:", err);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedFY]);

  // ✅ Correct Save API
  const saveTaskToAPI = async (taskData) => {
    try {
      const payload = {
        id: taskData.id || `TASK-${Date.now()}`,
        employeeId: taskData.employeeId || employeeId,
        fy: taskData.fy || selectedFY || currentFY,
        text: taskData.text || "",
        assigned: taskData.assigned || "Sushma",
        assignedDate:
          taskData.assignedDate ||
          new Date().toISOString().split("T")[0],
        dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
        rating: taskData.rating ?? 0,
        score: taskData.score ?? 0,
        status: taskData.status || "Open",
        comments: taskData.comments || [],
      };

      const res = await fetch("https://internal-website-rho.vercel.app/api/tasks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error("Failed to save task: " + msg);
      }

      const saved = await res.json();
      return saved;
    } catch (err) {
      console.error("Save failed:", err);
      setError("Save failed. Try again.");
      return null;
    }
  };

  // ✅ Add new task
  const addTask = () => {
    if (selectedFY !== currentFY) return; // only for current FY
    setNewTask({
      id: `TASK-${Date.now()}`,
      text: "",
      assigned: "You",
      assignedDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      fy: selectedFY,
      employeeId,
      rating: 0,
      score: 0,
      status: "Open",
      comments: [],
    });
  };

  // ✅ Save new task
  const handleSave = async () => {
    if (!newTask.text || !newTask.dueDate) return;
    const saved = await saveTaskToAPI(newTask);
    if (saved) {
      const updated = [...tasks, saved];
      setTasks(updated);
      if (onUpdate) onUpdate(updated);
      setNewTask(null);
    }
  };

  // ✅ Edit existing task
  const handleEdit = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, isEditing: true } : t))
    );
  };

  // ✅ Update task (within 24h)
  const handleUpdate = async (id, text, dueDate) => {
    const target = tasks.find((t) => t._id === id);
    if (!target) return;

    const canEdit =
      Date.now() - new Date(target.createdAt).getTime() < 24 * 60 * 60 * 1000;
    if (!canEdit) return alert("Editing window expired!");

    const updatedTask = { ...target, text, dueDate };
    const saved = await saveTaskToAPI(updatedTask);
    if (saved) {
      const updatedList = tasks.map((t) =>
        t._id === id ? { ...saved, isEditing: false } : t
      );
      setTasks(updatedList);
      if (onUpdate) onUpdate(updatedList);
    }
  };

  // ✅ Soft delete task
  const handleDelete = async (id) => {
    const target = tasks.find((t) => t._id === id);
    if (!target) return;

    const canDelete =
      Date.now() - new Date(target.createdAt).getTime() < 24 * 60 * 60 * 1000;
    if (!canDelete) return alert("Delete window expired!");

    const deletedTask = { ...target, status: "Deleted" };
    const saved = await saveTaskToAPI(deletedTask);
    if (saved) {
      const updatedList = tasks.filter((t) => t._id !== id);
      setTasks(updatedList);
      if (onUpdate) onUpdate(updatedList);
    }
  };

  return (
    <div className="tasks-container">
      <h3 className="tasks-header">Assigned Tasks ({selectedFY})</h3>

      {loading ? (
        <p className="tasks-loading">Loading tasks...</p>
      ) : error ? (
        <p className="tasks-error">{error}</p>
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
              <tr>
                <td colSpan="5" className="tasks-empty">
                  No tasks assigned.
                </td>
              </tr>
            )}

            {tasks.map((task) => (
              <tr key={task._id}>
                <td>
                  {task.isEditing ? (
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) =>
                        setTasks((prev) =>
                          prev.map((t) =>
                            t._id === task._id
                              ? { ...t, text: e.target.value }
                              : t
                          )
                        )
                      }
                    />
                  ) : (
                    task.text
                  )}
                </td>
                <td>{task.assigned}</td>
                <td>{new Date(task.assignedDate).toLocaleDateString()}</td>
                <td>
                  {task.isEditing ? (
                    <input
                      type="date"
                      value={task.dueDate.split("T")[0]}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setTasks((prev) =>
                          prev.map((t) =>
                            t._id === task._id
                              ? { ...t, dueDate: e.target.value }
                              : t
                          )
                        )
                      }
                    />
                  ) : (
                    new Date(task.dueDate).toLocaleDateString()
                  )}
                </td>
                <td>
                  {task.isEditing ? (
                    <button
                      className="tasks-btn save"
                      onClick={() =>
                        handleUpdate(task._id, task.text, task.dueDate)
                      }
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="tasks-btn edit"
                        onClick={() => handleEdit(task._id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="tasks-btn delete"
                        onClick={() => handleDelete(task._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {newTask && (
              <tr>
                <td>
                  <input
                    type="text"
                    value={newTask.text}
                    onChange={(e) =>
                      setNewTask({ ...newTask, text: e.target.value })
                    }
                  />
                </td>
                <td>{newTask.assigned}</td>
                <td>{newTask.assignedDate}</td>
                <td>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    className="tasks-btn save"
                    onClick={handleSave}
                    disabled={!newTask.text || !newTask.dueDate}
                  >
                    Save
                  </button>
                  <button
                    className="tasks-btn cancel"
                    onClick={() => setNewTask(null)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="tasks-footer">
        {!newTask && (
          <button
            className="tasks-add-btn"
            onClick={addTask}
            disabled={selectedFY !== currentFY}
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
}
