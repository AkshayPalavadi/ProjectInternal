import React, { useState, useEffect } from "react";
import "./Reviews.css";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";

export default function Reviews({ taskTitle }) {
  const isAdmin = false; // true = Manager/Admin, false = Employee

  const defaultReviews = [
    {
      title: taskTitle || "Task",
      date: new Date().toISOString().split("T")[0],
      rating: 0,
      comments: [],
    },
  ];

  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem("interactive_reviews");
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = parsed.find((r) => r.title === taskTitle);
      return found ? [found] : defaultReviews;
    }
    return defaultReviews;
  });

  const [newComments, setNewComments] = useState({});
  const [editComments, setEditComments] = useState({});
  const [editComment, setEditComment] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("interactive_reviews") || "[]");
    const otherReviews = stored.filter((r) => r.title !== taskTitle);
    localStorage.setItem(
      "interactive_reviews",
      JSON.stringify([...otherReviews, ...reviews])
    );
  }, [reviews, taskTitle]);

  const setRating = (index, value) => {
    if (!isAdmin) return;
    const updated = [...reviews];
    updated[index].rating = value;
    setReviews(updated);
  };

  const addComment = (rIndex) => {
    const newComment = newComments[rIndex];
    if (!newComment?.trim()) return;

    const updated = [...reviews];
    updated[rIndex].comments.push({
      text: newComment,
      author: isAdmin ? "Manager" : "Employee",
      timestamp: new Date().toISOString(),
      edited: false,
    });

    setReviews(updated);
    setNewComments({ ...newComments, [rIndex]: "" });
  };

  const handleEdit = (rIndex, cIndex) => {
    setEditComment({ rIndex, cIndex });
    setEditComments({
      ...editComments,
      [`${rIndex}-${cIndex}`]: reviews[rIndex].comments[cIndex].text,
    });
  };

  const saveEdit = (rIndex, cIndex) => {
    const updated = [...reviews];
    updated[rIndex].comments[cIndex].text =
      editComments[`${rIndex}-${cIndex}`];
    updated[rIndex].comments[cIndex].edited = true;
    setReviews(updated);
    setEditComment(null);
    setEditComments({ ...editComments, [`${rIndex}-${cIndex}`]: "" });
  };

  const deleteComment = (rIndex, cIndex) => {
    const updated = [...reviews];
    updated[rIndex].comments.splice(cIndex, 1);
    setReviews(updated);
  };

  const isDisabled = (timestamp) => {
    const commentDate = new Date(timestamp);
    const diff = Date.now() - commentDate.getTime();
    return diff > 24 * 60 * 60 * 1000;
  };

  return (
    <div className="task-review-section">
      {reviews.map((review, rIndex) => (
        <div key={rIndex}>
          <h4>{review.title}</h4>

          <div className="rating-section">
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

          {/* Comments Section */}
          <div className="comments-section">
            {review.comments.map((c, cIndex) => {
              const disabled = isDisabled(c.timestamp);
              const isEditing =
                editComment?.rIndex === rIndex && editComment?.cIndex === cIndex;

              return (
                <div
                  key={cIndex}
                  className={`comment-chat-bubble ${
                    c.author === "Manager" ? "left" : "right"
                  }`}
                >
                  {isEditing ? (
                    <div className="edit-section">
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
                      <button
                        onClick={() => saveEdit(rIndex, cIndex)}
                        disabled={disabled}
                      >
                        💾
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="chat-text">{c.text}</div>

                      {/* ✅ Time and buttons on same line */}
                      <div className="comment-chat-footer">
                        <span className="comment-chat-time">
                          {new Date(c.timestamp).toLocaleString()}
                          {c.edited && " (edited)"}
                        </span>

                        {c.author === (isAdmin ? "Manager" : "Employee") && (
                          <div className="comment-chat-buttons">
                            <button
                              onClick={() => handleEdit(rIndex, cIndex)}
                              disabled={disabled}
                            >
                              <BiEdit />
                            </button>
                            <button
                              onClick={() => deleteComment(rIndex, cIndex)}
                              disabled={disabled}
                            >
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

            <div className="chat-input-container">
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
