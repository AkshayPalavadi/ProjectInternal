import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Task.css";

export default function Task({ selectedFY, onUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(null);

  // Load tasks from localStorage
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    setTasks(allTasks[selectedFY] || []);
    setNewTask(null);
  }, [selectedFY]);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    allTasks[selectedFY] = updatedTasks;
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    if (onUpdate) onUpdate(updatedTasks);
  };

  const addTask = () => {
    setNewTask({
      id: Date.now(),
      text: "",
      assigned: "You",
      assignedDate: new Date().toISOString().split("T")[0],
      dueDate: "",
    });
  };

  const handleSave = () => {
    if (!newTask.text || !newTask.dueDate) return;
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setNewTask(null);
  };

  const handleEdit = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, isEditing: true } : t
    );
    setTasks(updated);
  };

  const handleUpdate = (id, text, dueDate) => {
    if (!text || !dueDate) return;
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, text, dueDate, isEditing: false } : t
    );
    saveTasks(updated);
  };

  const handleDelete = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  return (
    <div className="task-container">
      <h3>Assigned Tasks ({selectedFY})</h3>
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Assigned</th>
            <th>Assigned Date</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && !newTask && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No tasks added.
              </td>
            </tr>
          )}

          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                {task.isEditing ? (
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id ? { ...t, text: e.target.value } : t
                        )
                      )
                    }
                  />
                ) : (
                  task.text
                )}
              </td>
              <td>{task.assigned}</td>
              <td>{task.assignedDate}</td>
              <td>
                {task.isEditing ? (
                  <input
                    type="date"
                    value={task.dueDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id ? { ...t, dueDate: e.target.value } : t
                        )
                      )
                    }
                  />
                ) : (
                  task.dueDate
                )}
              </td>
              <td>
                {task.isEditing ? (
                  <button
                    className="save-btn"
                    onClick={() =>
                      handleUpdate(task.id, task.text, task.dueDate)
                    }
                    disabled={!task.text || !task.dueDate}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(task.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="del-btn"
                      onClick={() => handleDelete(task.id)}
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
                  className="save-btn"
                  onClick={handleSave}
                  disabled={!newTask.text || !newTask.dueDate}
                >
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setNewTask(null)}
                  style={{ marginLeft: "5px" }}
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="add-task-section">
        {!newTask && (
          <button className="add-task-btn" onClick={addTask}>
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
}
