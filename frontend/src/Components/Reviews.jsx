import React, { useState, useEffect } from "react";
import "./Reviews.css";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";

export default function Reviews({ taskTitle }) {
  const isAdmin = false; // manager flow pending
  const employeeId = "EMP-101"; // static for now
  const [reviews, setReviews] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [editComments, setEditComments] = useState({});
  const [editComment, setEditComment] = useState(null);

  // ✅ Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("https://internal-website-rho.vercel.app/api/tasks");
        const data = await res.json();
        const filtered = data.filter(
          (t) =>
            t.employeeId === employeeId &&
            t.text === taskTitle
        );
        if (filtered.length > 0) setReviews(filtered);
        else
          setReviews([
            {
              id: "TASK-STATIC",
              employeeId,
              text: taskTitle,
              rating: 0,
              comments: [],
            },
          ]);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [taskTitle]);

  // ✅ Save/Update Task to API
  const saveTaskToAPI = async (updatedTask) => {
    try {
      const res = await fetch("https://internal-website-rho.vercel.app/api/tasks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ✅ Set Rating
  const setRating = async (index, value) => {
    if (!isAdmin) return;
    const updated = [...reviews];
    updated[index].rating = value;
    setReviews(updated);
    await saveTaskToAPI(updated[index]);
  };

  // ✅ Add Comment
  const addComment = async (rIndex) => {
    const newComment = newComments[rIndex];
    if (!newComment?.trim()) return;

    const updated = [...reviews];
    const task = updated[rIndex];
    const comment = {
      authorId: employeeId,
      authorName: "Sushma",
      role: isAdmin ? "Manager" : "Employee",
      message: newComment,
      createdAt: new Date().toISOString(),
    };
    task.comments.push(comment);
    setReviews(updated);
    setNewComments({ ...newComments, [rIndex]: "" });

    await saveTaskToAPI(task);
  };

  // ✅ Edit Comment
  const handleEdit = (rIndex, cIndex) => {
    setEditComment({ rIndex, cIndex });
    setEditComments({
      ...editComments,
      [`${rIndex}-${cIndex}`]: reviews[rIndex].comments[cIndex].message,
    });
  };

  const saveEdit = async (rIndex, cIndex) => {
    const updated = [...reviews];
    const task = updated[rIndex];
    task.comments[cIndex].message = editComments[`${rIndex}-${cIndex}`];
    task.comments[cIndex].edited = true;
    task.comments[cIndex].updatedAt = new Date().toISOString();
    setReviews(updated);
    setEditComment(null);
    setEditComments({ ...editComments, [`${rIndex}-${cIndex}`]: "" });

    await saveTaskToAPI(task);
  };

  // ✅ Delete Comment
  const deleteComment = async (rIndex, cIndex) => {
    const updated = [...reviews];
    const task = updated[rIndex];
    task.comments.splice(cIndex, 1);
    setReviews(updated);
    await saveTaskToAPI(task);
  };

  // ✅ 24-hour edit limit
  const isDisabled = (timestamp) => {
    const commentDate = new Date(timestamp);
    const diff = Date.now() - commentDate.getTime();
    return diff > 24 * 60 * 60 * 1000;
  };

  return (
    <div className="reviews-task-review-section">
      {reviews.map((review, rIndex) => (
        <div key={review.id || rIndex}>
          <h4>{review.text}</h4>

          <div className="reviews-rating-section">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onClick={() => setRating(rIndex, n)}
                style={{
                  cursor: isAdmin ? "pointer" : "default",
                  color: review.rating >= n ? "#ffb400" : "#ccc",
                  fontSize: "18px",
                }}
              >
                ★
              </span>
            ))}
            <span style={{ marginLeft: 8 }}>
              {review.rating ? `${review.rating}/5` : "Not rated"}
            </span>
          </div>

          <div className="reviews-comments-section">
            {review.comments.map((c, cIndex) => {
              const disabled = isDisabled(c.createdAt);
              const isEditing =
                editComment?.rIndex === rIndex && editComment?.cIndex === cIndex;

              return (
                <div
                  key={c._id || cIndex}
                  className={`comment-chat-bubble ${
                    c.role === "Manager" ? "left" : "right"
                  }`}
                >
                  {isEditing ? (
                    <div className="reviews-edit-section">
                      <input
                        type="text"
                        value={editComments[`${rIndex}-${cIndex}`] || ""}
                        onChange={(e) =>
                          setEditComments({
                            ...editComments,
                            [`${rIndex}-${cIndex}`]: e.target.value,
                          })
                        }
                      />
                      <button onClick={() => saveEdit(rIndex, cIndex)} disabled={disabled}>
                        💾
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="reviews-chat-text">{c.message}</div>
                      <div className="reviews-comment-chat-footer">
                        <span className="reviews-comment-chat-time">
                          {new Date(c.createdAt).toLocaleString()}
                          {c.edited && " (edited)"}
                        </span>

                        {c.authorId === employeeId && (
                          <div className="reviews-comment-chat-buttons">
                            <button onClick={() => handleEdit(rIndex, cIndex)} disabled={disabled}>
                              <BiEdit />
                            </button>
                            <button onClick={() => deleteComment(rIndex, cIndex)} disabled={disabled}>
                              <RiDeleteBinLine />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <div className="reviews-chat-input-container">
              <input
                type="text"
                placeholder="Type your message..."
                value={newComments[rIndex] || ""}
                onChange={(e) =>
                  setNewComments({ ...newComments, [rIndex]: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && addComment(rIndex)}
              />
              <button onClick={() => addComment(rIndex)}>💬</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
