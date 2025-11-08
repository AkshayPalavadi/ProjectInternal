import React from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";
import "./JobList.css";

const jobs = [
  { id: 1, title: "Frontend Developer", category: "Software IT", experience: "2+ Years", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad", jobType: "Full Time" },
  { id: 2, title: "Content Writing", category: "Media", experience: "Fresher", salary: "₹3,00,000 - ₹4,00,000", location: "Bengaluru", jobType: "Part Time" },
  { id: 3, title: "Backend Developer", category: "Software IT", experience: "1+ Years", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad", jobType: "Full Time" },
  { id: 4, title: "Web Developer", category: "Software IT", experience: "2+ Years", salary: "₹3,50,000 - ₹5,00,000", location: "Chennai", jobType: "Full Time" },
  { id: 5, title: "UI/UX Designer", category: "Design", experience: "2+ Years", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad", jobType: "Part Time" },
  { id: 6, title: "Python Developer", category: "Software IT", experience: "Fresher", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad", jobType: "Full Time" },
];

const JobList = ({ filters = {} }) => {
  const {
    searchTerm = "",
    locations = [],
    jobTypes = [],
    experiences = [],
  } = filters;

  const navigate = useNavigate();

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locations.length === 0 || locations.includes(job.location);
    const matchesJobType = jobTypes.length === 0 || jobTypes.includes(job.jobType);
    const matchesExperience = experiences.length === 0 || experiences.some((exp) => job.experience.includes(exp));

    return matchesSearch && matchesLocation && matchesJobType && matchesExperience;
  });

  return (
    <div className="joblist">
      {filteredJobs.length > 0 ? (
        <>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} {...job} /> // Pass job id and details
          ))}
        </>
      ) : (
        <p className="no-jobs">No jobs found.</p>
      )}
    </div>
  );
};

export default JobList;
