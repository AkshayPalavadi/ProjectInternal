import React from "react";
import JobCard from "./JobCard";
import "./JobList.css";
import Header from "../carriercomponents/Header";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    category: "Software IT",
    experience: "2 Years",
    education: "B.Tech",
    salary: "₹4,00,000 - ₹6,00,000",
    location: "Hyderabad",
    jobType: "Full Time",
  },
  {
    id: 2,
    title: "Content Writer",
    category: "Media",
    experience: "1 Year",
    education: "B.Sc",
    salary: "₹3,00,000 - ₹4,00,000",
    location: "Bengaluru",
    jobType: "Part Time",
  },
  {
    id: 3,
    title: "Backend Developer",
    category: "Software IT",
    experience: "3 Years",
    education: "B.Tech",
    salary: "₹4,00,000 - ₹6,00,000",
    location: "Hyderabad",
    jobType: "Full Time",
  },
  {
    id: 4,
    title: "Web Developer",
    category: "Software IT",
    experience: "1 Year",
    education: "M.Tech",
    salary: "₹3,50,000 - ₹5,00,000",
    location: "Chennai",
    jobType: "Full Time",
  },
  {
    id: 5,
    title: "UI/UX Designer",
    category: "Design",
    experience: "2 Years",
    education: "MBA",
    salary: "₹4,00,000 - ₹6,00,000",
    location: "Hyderabad",
    jobType: "Part Time",
  },
  {
    id: 6,
    title: "Python Developer",
    category: "Software IT",
    experience: "4 Years",
    education: "B.Tech",
    salary: "₹4,00,000 - ₹6,00,000",
    location: "Hyderabad",
    jobType: "Full Time",
  },
];

const JobList = ({ filters = {} }) => {
  const {
    searchTerm = "",
    locations = [],
    jobTypes = [],
    experiences = [],
    education = "All",
    salaryRange = 150000,
  } = filters;

  // Convert "2 Years" → 2 (number)
  const parseYears = (exp) => {
    if (exp.toLowerCase() === "fresher") return 0;
    return parseInt(exp);
  };

  // Experience Range Mapping
  const experienceRanges = {
    Fresher: [0, 0],
    "1-2 Years": [1, 2],
    "2-4 Years": [2, 4],
    "4-6 Years": [4, 6],
    "6+ Years": [6, 50],
  };

  const extractMinSalary = (salaryStr) => {
    const clean = salaryStr.replace(/[₹,]/g, "");
    return parseInt(clean.split(" - ")[0]);
  };

  const filteredJobs = jobs.filter((job) => {
    const jobYears = parseYears(job.experience);

    // Search
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Location
    const matchesLocation =
      locations.length === 0 || locations.includes(job.location);

    // Job Type
    const matchesJobType =
      jobTypes.length === 0 || jobTypes.includes(job.jobType);

    // Experience (new logic)
    const matchesExperience =
      experiences.length === 0 ||
      experiences.some((range) => {
        const [min, max] = experienceRanges[range];
        return jobYears >= min && jobYears <= max;
      });

    // Education FIXED (All = show all)
    const matchesEducation = education === "All" || job.education === education;

    // Salary
    const matchesSalary = extractMinSalary(job.salary) >= salaryRange;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesExperience &&
      matchesEducation &&
      matchesSalary
    );
  });

  return (
    <div className="joblist">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => <JobCard key={job.id} {...job} />)
      ) : (
        <p className="no-jobs">No jobs found.</p>
      )}
    </div>
  );
};

export default JobList;
