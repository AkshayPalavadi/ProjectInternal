import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import "./Reviews.css";

export default function Reviews({ task, tasks, setTasks }) {
  const role = localStorage.getItem("userRole") || "Employee";
  const isManager = role === "Manager";

  // Local UI state for rating & comments input/editing
  const [rating, setRating] = useState(task.rating || 0);
  const [newComment, setNewComment] = useState("");
  const [editState, setEditState] = useState(null); // { cIndex }
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setRating(task.rating || 0);
  }, [task]);

  // Helper to persist updated tasks via setTasks (parent will save to localStorage)
  const persistTasks = (updatedTasks) => {
    if (typeof setTasks === "function") {
      setTasks(updatedTasks);
    }
  };

  // Update rating logic: employee allowed only if manager hasn't edited; manager always allowed and sets managerEdited=true
  const handleRatingClick = (value) => {
    if (!isManager && task.managerEdited) return; // prevent employee editing after manager edited

    const updatedTasks = tasks.map((t) => {
      if (t.id !== task.id) return t;
      return {
        ...t,
        rating: value,
        managerEdited: isManager ? true : t.managerEdited || false,
      };
    });

    setRating(value);
    persistTasks(updatedTasks);
  };

  // Comments logic: comments stored on task.comments (array)
  const ensureCommentsArray = (t) => {
    if (!t.comments) return [];
    return t.comments;
  };

  const addComment = () => {
    if (!newComment || !newComment.trim()) return;
    const commentObj = {
      text: newComment.trim(),
      author: isManager ? "Manager" : "Employee",
      timestamp: new Date().toISOString(),
      edited: false,
      id: Date.now() + Math.random().toString(36).slice(2, 7),
    };

    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, comments: [...ensureCommentsArray(t), commentObj] } : t
    );
    setNewComment("");
    persistTasks(updatedTasks);
  };

  // Edit comment: only author can edit and within 24 hours (optional)
  const canModifyComment = (c) => {
    const roleLabel = isManager ? "Manager" : "Employee";
    if (c.author !== roleLabel) return false;

    // allow edit/delete within 24 hours since timestamp
    const diff = Date.now() - new Date(c.timestamp).getTime();
    return diff <= 24 * 60 * 60 * 1000;
  };

  const startEdit = (cIndex) => {
    const c = (task.comments || [])[cIndex];
    if (!c || !canModifyComment(c)) return;
    setEditState({ cIndex });
    setEditText(c.text);
  };

  const saveEdit = () => {
    if (!editState) return;
    const { cIndex } = editState;
    const updatedTasks = tasks.map((t) => {
      if (t.id !== task.id) return t;
      const updatedComments = [...(t.comments || [])];
      if (!updatedComments[cIndex]) return t;
      updatedComments[cIndex] = {
        ...updatedComments[cIndex],
        text: editText,
        edited: true,
        timestamp: updatedComments[cIndex].timestamp, // keep original timestamp (or could update)
      };
      return { ...t, comments: updatedComments };
    });
    setEditState(null);
    setEditText("");
    persistTasks(updatedTasks);
  };

  const deleteComment = (cIndex) => {
    const c = (task.comments || [])[cIndex];
    if (!c || !canModifyComment(c)) return;
    const updatedTasks = tasks.map((t) => {
      if (t.id !== task.id) return t;
      const updatedComments = [...(t.comments || [])];
      updatedComments.splice(cIndex, 1);
      return { ...t, comments: updatedComments };
    });
    persistTasks(updatedTasks);
  };

  return (
    <div className={`reviews-container ${!isManager && task.managerEdited ? "locked" : ""}`}>
      <h4>{task.text}</h4>

      {/* Rating stars */}
      <div className={`reviews-rating-stars ${!isManager && task.managerEdited ? "locked" : ""}`} style={{ marginTop: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => handleRatingClick(n)}
            style={{
              cursor:
                isManager || (!task.managerEdited && role === "Employee")
                  ? "pointer"
                  : "default",
              color: rating >= n ? "#ffb400" : "#ccc",
              fontSize: "22px",
              marginRight: "6px",
              transition: "transform 0.2s, color 0.2s",
            }}
            title={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </span>
        ))}
      </div>

      {(!isManager && task.managerEdited) && (
        <p style={{ color: "#999", marginTop: 8 }}>
          (Rating locked — Manager has finalized this task's rating)
        </p>
      )}

      {/* Comments / Chat */}
      <div style={{ marginTop: 12 }}>
        {(task.comments || []).map((c, idx) => {
          const disabled = !canModifyComment(c);
          const isEditing = editState && editState.cIndex === idx;

          return (
            <div
              key={c.id || `${idx}`}
              className={`reviews-comment-chat-bubble ${c.author === "Manager" ? "left" : "right"}`}
              style={{ marginBottom: 8 }}
            >
              {isEditing ? (
                <div className="reviews-edit-section">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ minWidth: 200 }}
                  />
                  <button onClick={saveEdit} disabled={!editText.trim()} style={{ marginLeft: 6 }}>
                    💾
                  </button>
                </div>
              ) : (
                <>
                  <div className="reviews-chat-text" style={{ marginBottom: 6 }}>{c.text}</div>
                  <div className="reviews-comment-chat-footer">
                    <span className="reviews-comment-chat-time">
                      {new Date(c.timestamp).toLocaleString()}
                      {c.edited && " (edited)"}
                    </span>
                    {canModifyComment(c) && (
                      <div className="reviews-comment-chat-buttons">
                        <button onClick={() => startEdit(idx)} title="Edit"><BiEdit /></button>
                        <button onClick={() => deleteComment(idx)} title="Delete"><RiDeleteBinLine /></button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        <div className="reviews-chat-input-container" style={{ marginTop: 6 }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addComment();
            }}
          />
          <button onClick={addComment}>💬</button>
        </div>
      </div>
    </div>
  );
}
