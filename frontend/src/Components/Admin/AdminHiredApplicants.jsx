import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FiDownload, FiFilter } from "react-icons/fi";
import "./AdminHiredApplicants.css";

const Hired = () => {
  const [filters, setFilters] = useState({
    name: "",
    contact:"",
    email:'',
    desgination:'',
    experience: "",
    location: "",
    recuitername:'',
    offerletter:'',
    expecteddoj: "",
    actualdoj:"",
    
  });

  const [showFilterBox, setShowFilterBox] = useState(false);

  const applicants = useMemo(
    () => [
      { id: "001", name: "Deepika", contact: "1234566789", experience: "0yrs",email:'deepika@dhatvi.com',desgination:'Frontend Developer', location: "Hyderabad", expecteddoj: "2025-12-22" ,actualdoj:"2025-12-10",recuitername:'HR',offerletter:"/files/offer_letter_professional.pdf"},
      { id: "002", name: "Divya Sree", contact: "9898765432", experience: "2yrs",email:'divyasree@gmail.com',desgination:'Backend Developer', location: "Hyderabad", expecteddoj: "2025-11-15",actualdoj:'2025-11-05',recuitername:'HR',offerletter:"/files/offer_letter_professional.pdf" },
      { id: "003", name: "Sravya", contact: "4567897653", experience: "1yr",email:'sravya@gmail.com',desgination:'UI/UX Design', location: "Chennai", expecteddoj: "2025-12-05",actualdoj:'2025-12-01',recuitername:'HR',offerletter:"/files/offer_letter_professional.pdf"},
      { id: "004", name: "Kumar", contact: "2345678988", experience: "1.5yrs",email:'kumar@gmail.com',desgination:'Frontend Developer', location: "Bangalore", expecteddoj: "2025-12-22" ,actualdoj:'2025-12-19',recuitername:'HR',offerletter:"/files/offer_letter_professional.pdf"},
      { id: "005", name: "Phani", contact: "8765435798", experience: "0yrs",email:'phani@gmail.com',desgination:'Backend Developer', location: "Hyderabad", expecteddoj: "2025-12-10",actualdoj:'2025-12-05',recuitername:'HR',offerletter:"/files/offer_letter_professional.pdf" },
      { id: "006", name: "Naveen", contact: "7652345654", experience: "2yrs",email:'naveen@gmail.com',desgination:'Backend Developer', location: "Mumbai", expecteddoj: "2025-05-30",actualdoj:'2025-05-25',recuitername:'HR',offerletter:"/files/offer_letter_professional.pdf" },
    ],
    []
  );

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      return (
        a.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        a.contact.toLowerCase().includes(filters.contact.toLowerCase()) &&
        a.email.toLowerCase().includes(filters.email.toLowerCase())&&
        a.desgination.toLowerCase().includes(filters.desgination.toLowerCase())&&
        a.experience.toLowerCase().includes(filters.experience.toLowerCase()) &&
        a.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        a.recuitername.toLowerCase().includes(filters.recuitername.toLowerCase())&&
        (filters.expecteddoj === "" || a.expecteddoj === filters.expecteddoj)
      );
    });
  }, [applicants, filters]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplicants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hired");
    XLSX.writeFile(workbook, "Hired_List.xlsx");
  };

  return (
    <div className="onhold-container">
      {/* Header */}
      <div className="onhold-header">
        <h2>Hired Applicants</h2>
        <div className="onhold-header-actions">
          <div className="filter-dropdown-wrapper">
            <FiFilter
              className={`filter-icon ${showFilterBox ? "active" : ""}`}
              title="Filter"
              onClick={() => setShowFilterBox(!showFilterBox)}
            />
            {showFilterBox && (
              <div className="filter-box">
                <h4>Advanced Filters</h4>
                {["name", "contact", "experience", "location"].map((key) => (
                  <div className="filter-field" key={key}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      type="text"
                      placeholder={`Search ${key}`}
                      value={filters[key]}
                      onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="filter-field">
                  <label>Excepted DOJ</label>
                  <input
                    type="date"
                    value={filters.expecteddoj}
                    onChange={(e) => setFilters({ ...filters, expecteddoj: e.target.value })}
                  />
                </div>
                <div className="ilter-feild">
                <label>Actual DOJ</label>
                <input
                    type="date"
                    value={filters.actualdoj}
                    onChange={(e)=> setFilters({...filters,actualdoj:e.target.value})}
                    />

                </div>
                  

                <div className="filter-actions">
                  <button
                    onClick={() =>
                      setFilters({ name: "", contact: "", experience: "", location: "", expecteddoj: "" })
                    }
                  >
                    Clear
                  </button>
                  <button onClick={() => setShowFilterBox(false)}>Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="onhold-table-wrapper">
        <table className="onhold-table">
          {/* <thead>
            <tr className="filter-row">
              <th>Application ID</th>
              <th>
                <input
                  type="text"
                  placeholder="Applicate Name"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Contact"
                  value={filters.contact}
                  onChange={(e) => setFilters({ ...filters, contact: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="email"
                  placeholder="Email"
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                />
              </th>
              <th>
                <select>
                    <option></option>
                </select>
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Desgination"
                  value={filters.desgination}
                  onChange={(e) => setFilters({ ...filters, desgination: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Experience"
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Expected DOJ"
                  value={filters.expecteddoj}
                  onChange={(e) => setFilters({ ...filters, expecteddoj: e.target.value })}
                />
              </th>
            </tr>
          </thead> */}
          <thead>
  <tr className="filter-row">
     <th>
      
      <select
        value={filters.ApplicantId}
        className="ID"
        onChange={(e) => setFilters({ ...filters, desgination: e.target.value })}
      >
        <option value="">ID</option>
        {[...new Set(applicants.map((a) => a.id))].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </th>

    {/* Applicant Name Dropdown */}
   <th>Applicant Name</th>

    {/* Contact (still input – contact usually not dropdown) */}
    <th>Contact</th>

    {/* Email (input field stays) */}
    <th>Email</th>

    {/* Designation Dropdown */}
    <th>
      
      <select
        value={filters.desgination}
        className="designation"
        onChange={(e) => setFilters({ ...filters, desgination: e.target.value })}
      >
        <option value="">Designation</option>
        {[...new Set(applicants.map((a) => a.desgination))].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </th>

    {/* Experience Dropdown */}
    <th>
      <select
        value={filters.experience}
         className="Experience"
        onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
      >
        <option value="">Experience</option>
        {[...new Set(applicants.map((a) => a.experience))].map((exp) => (
          <option key={exp} value={exp}>
            {exp}
          </option>
        ))}
      </select>
    </th>

    {/* Location Dropdown */}
    <th>
      <select
        value={filters.location}
         className="location"
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      >
        <option value="">Location</option>
        {[...new Set(applicants.map((a) => a.location))].map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </th>

    {/* Expected DOJ input stays */}
    <th>Expected DOJ</th>
    <th>Actual DOJ</th>
    <th>RecuiterName</th>
    <th>Offer Letter</th>
  </tr>
</thead>

          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((a, index) => (
                <tr key={a.id}>
                  <td>{index + 1}</td>
                  <td>{a.name}</td>
                  <td>{a.contact}</td>
                  <td>{a.email}</td>
                  <td>{a.desgination}</td>
                  <td>{a.experience}</td>
                  <td>{a.location}</td>
                  <td>{a.expecteddoj}</td>
                  <td>{a.actualdoj}</td>
                  <td>{a.recuitername}</td>
                  <td>
  {a.offerletter ? (
    <a
      href={a.offerletter}
      download
      className="download-offer-btn"
    >
      Download
    </a>
  ) : (
    "No File"
  )}
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No hired applicants match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="onhold-footer">
        <p>Total Applicants: {filteredApplicants.length}</p>
        <button className="onhold-export-btn" onClick={exportToExcel}>
          <FiDownload /> Export
        </button>
      </div>
    </div>
  );
};

export default Hired;



