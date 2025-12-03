import React, { useEffect, useState } from "react";
import JobApplicants from "./JobApplicants";
import { useLocation } from "react-router-dom";

const MonthJobApplicants = () => {
  const location = useLocation();
  const selectedMonth = location.state?.selectedMonth;  // e.g., "January"
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedMonth) return;

    fetch(
      `https://public-website-drab-ten.vercel.app/api/applications/month/${selectedMonth}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.applications || []); // <- API expected result
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching month applicants:", err);
        setLoading(false);
      });
  }, [selectedMonth]);

  if (!selectedMonth) return <h2>No month selected ❌</h2>;
  if (loading) return <h2>Loading applicants...</h2>;

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>
        Applicants for <span style={{ color: "#2563eb" }}>{selectedMonth}</span>
      </h2>
      <JobApplicants data={data} />
    </div>
  );
};

export default MonthJobApplicants;
