// src/pages/History.jsx
import "./History.css";

export default function History({ requests, onDelete }) {
  return (
    <div className="history-container">
      <div className="table-wrapper">
      <table className="history-table">
        <thead>
          <tr>
            <th>From Date</th>
            <th>To Date</th>
            <th>Total Days</th>
            <th>Leave Type & Breakdown</th>
            <th>Reason</th>
            <th>File</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {[...requests]
            .sort((a, b) => {
              const dateA = new Date(a.requestDate || a.fromDate);
              const dateB = new Date(b.requestDate || b.fromDate);
              return dateB - dateA; // latest applied leave first
            })
            .map((req, index) => (
            <tr key={index}>
              <td>{req.fromDate}</td>

              <td>{req.toDate}</td>

              <td>{req.daysApplied}</td>

              <td>
                {req.leaveType === "custom" ? (
                  <div>
                    <strong>Custom Mix:</strong>
                    <ul className="custom-breakdown">
                      {req.leaveDetails &&
                        Object.entries(
                          typeof req.leaveDetails === "string"
                            ? JSON.parse(req.leaveDetails)
                            : req.leaveDetails
                        ).map(([type, days]) => (
                          <li key={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)} —{" "}
                            <span className="days-count">
                              {days} day{days > 1 ? "s" : ""}
                            </span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                ) : (
                  <span>
                    {req.leaveType.charAt(0).toUpperCase() +
                      req.leaveType.slice(1)}{" "}
                    <span className="days-count">
                      ({req.daysApplied} day
                      {req.daysApplied > 1 ? "s" : ""})
                    </span>
                  </span>
                )}
              </td>

              <td className="reason-cell">{req.reason}</td>

              <td>
                {req.file ? (
                  typeof req.file === "string" ? (
                    <a
                      href={req.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-emoji"
                    >
                      📄
                    </a>
                  ) : req.file instanceof File ? (
                    <a
                      href={URL.createObjectURL(req.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-emoji"
                    >
                      📄
                    </a>
                  ) : (
                    "—"
                  )
                ) : (
                  "—"
                )}
              </td>

              <td>
                <span
                  className={`status-badge ${
                    req.status === "Pending"
                      ? "pending"
                      : req.status === "Approved" || req.status === "Granted"
                      ? "approved"
                      : "rejected"
                  }`}
                >
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
