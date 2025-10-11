import "./History.css";

export default function History({ requests, onDelete }) {
  return (
    <div className="history-container">
      <table className="history-table">
        <thead>
          <tr>
            <th>From Date</th>
            <th>To Date</th>
            <th>Days</th>
            <th>Leave Type</th>
            <th>Reason</th>
            <th>File</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, index) => (
            <tr key={index}>
              <td>{req.fromDate}</td>
              <td>{req.toDate}</td>
              <td>{req.daysApplied}</td>
              <td>{req.leaveType === "custom" ? req.customTypes?.join(", ") : req.leaveType}</td>
              <td className="reason-cell">{req.reason}</td>
              <td>
                {req.file ? (
                  <a
                    href={URL.createObjectURL(req.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-emoji"
                  >
                    📄
                  </a>
                ) : "—"}
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
  );
}
