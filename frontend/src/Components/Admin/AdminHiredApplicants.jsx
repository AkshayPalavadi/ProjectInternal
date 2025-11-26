
import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FiDownload, FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AdminHiredApplicants.css";

const Hired = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    id: "",
    name: "",
    contact: "",
    email: "",
    desgination: "",
    experience: "",
    location: "",
    recuitername: "",
    offerletter: "",
    expecteddoj: "",
    actualdoj: "",
  });

  const [showFilterBox, setShowFilterBox] = useState(false);
  // ⭐ Add this state
const [selectedApplicant, setSelectedApplicant] = useState(null);

  

  const applicants = useMemo(
    () => [
      {
        id: "001",
        name: "Deepika",
        contact: "1234566789",
        experience: "0yrs",
        email: "deepika@dhatvi.com",
        desgination: "Frontend Developer",
        location: "Hyderabad",
        expecteddoj: "2025-12-22",
        actualdoj: "2025-12-10",
        recuitername: "HR",
        offerletter: "/files/offer_letter_professional.pdf",
      },
      {
        id: "002",
        name: "Divya Sree",
        contact: "9898765432",
        experience: "2yrs",
        email: "divyasree@gmail.com",
        desgination: "Backend Developer",
        location: "Hyderabad",
        expecteddoj: "2025-11-15",
        actualdoj: "2025-11-05",
        recuitername: "HR",
        offerletter: "/files/offer_letter_professional.pdf",
      },
      {
        id: "003",
        name: "Sravya",
        contact: "4567897653",
        experience: "1yr",
        email: "sravya@gmail.com",
        desgination: "UI/UX Design",
        location: "Chennai",
        expecteddoj: "2025-12-05",
        actualdoj: "2025-12-01",
        recuitername: "HR",
        offerletter: "/files/offer_letter_professional.pdf",
      },
      {
        id: "004",
        name: "Kumar",
        contact: "2345678988",
        experience: "1.5yrs",
        email: "kumar@gmail.com",
        desgination: "Frontend Developer",
        location: "Bangalore",
        expecteddoj: "2025-12-22",
        actualdoj: "2025-12-19",
        recuitername: "HR",
        offerletter: "/files/offer_letter_professional.pdf",
      },
      {
        id: "005",
        name: "Phani",
        contact: "8765435798",
        experience: "0yrs",
        email: "phani@gmail.com",
        desgination: "Backend Developer",
        location: "Hyderabad",
        expecteddoj: "2025-12-10",
        actualdoj: "2025-12-05",
        recuitername: "HR",
        offerletter: "/files/offer_letter_professional.pdf",
      },
      {
        id: "006",
        name: "Naveen",
        contact: "7652345654",
        experience: "2yrs",
        email: "naveen@gmail.com",
        desgination: "Backend Developer",
        location: "Mumbai",
        expecteddoj: "2025-05-30",
        actualdoj: "2025-05-25",
        recuitername: "HR",
        offerletter: "/files/offer_letter_professional.pdf",
      },
    ],
    []
  );

  // ✅ FIXED — Added `id` filter
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      return (
        a.id.toLowerCase().includes(filters.id.toLowerCase()) &&
        a.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        a.contact.toLowerCase().includes(filters.contact.toLowerCase()) &&
        a.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        a.desgination.toLowerCase().includes(filters.desgination.toLowerCase()) &&
        a.experience.toLowerCase().includes(filters.experience.toLowerCase()) &&
        a.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        a.recuitername.toLowerCase().includes(filters.recuitername.toLowerCase()) &&
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
      {/* ⭐ DETAILS CARD WHEN NAME IS CLICKED */}
{selectedApplicant && (
  <div className="details-card">
    <button className="back-btn" onClick={() => setSelectedApplicant(null)}>
      ← Back
    </button>

    <h2>Applicant Details</h2>
    <p><strong>Name:</strong> {selectedApplicant.name}</p>
    <p><strong>Email:</strong> {selectedApplicant.email}</p>
    <p><strong>Contact:</strong> {selectedApplicant.contact}</p>
    {/* <p><strong>Designation:</strong> {selectedApplicant.desgination}</p> */}
    <p><strong>Experience:</strong> {selectedApplicant.experience}</p>
    {/* <p><strong>Location:</strong> {selectedApplicant.location}</p> */}
    {/* <p><strong>Expected DOJ:</strong> {selectedApplicant.expecteddoj}</p> */}
    {/* <p><strong>Actual DOJ:</strong> {selectedApplicant.actualdoj}</p> */}
    {/* <p><strong>Recruiter:</strong> {selectedApplicant.recuitername}</p> */}

    {/* <button
      className="offer-btn"
      onClick={() => window.open(selectedApplicant.offerletter, "_blank")}
    >
      View Offer Letter 📄
    </button> */}
  </div>
)}
{/* ⭐ HIDE TABLE WHEN CARD OPEN */}
{!selectedApplicant && (
  <>

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

                {["id", "name", "contact", "email", "experience", "location"].map(
                  (key) => (
                    <div className="filter-field" key={key}>
                      <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <input
                        type="text"
                        placeholder={`Search ${key}`}
                        value={filters[key]}
                        onChange={(e) =>
                          setFilters({ ...filters, [key]: e.target.value })
                        }
                      />
                    </div>
                  )
                )}

                <div className="filter-field">
                  <label>Expected DOJ</label>
                  <input
                    type="date"
                    value={filters.expecteddoj}
                    onChange={(e) =>
                      setFilters({ ...filters, expecteddoj: e.target.value })
                    }
                  />
                </div>

                <div className="filter-field">
                  <label>Actual DOJ</label>
                  <input
                    type="date"
                    value={filters.actualdoj}
                    onChange={(e) =>
                      setFilters({ ...filters, actualdoj: e.target.value })
                    }
                  />
                </div>

                <div className="filter-actions">
                  <button
                    onClick={() =>
                      setFilters({
                        id: "",
                        name: "",
                        contact: "",
                        email: "",
                        desgination: "",
                        experience: "",
                        location: "",
                        recuitername: "",
                        expecteddoj: "",
                        actualdoj: "",
                        offerletter: "",
                      })
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
          <thead>
            <tr className="filter-row">
              {/* ID Dropdown */}
              {/* <th className="header-row">
                <span>
                  <input
                    type="text"
                    className="column-filter-input"
                    id='idsinput'
                    placeholder="ID"
                    value={filters.id}
                    onChange={(e) =>
                      setFilters({ ...filters, id: e.target.value })
                    }
                  />

                </span>
              </th> */}
               <th className="header-row">
                     <input
  
  type="text"
  className="column-filter-input"
  placeholder="ID"
  value={filters.id}
  onChange={(e) => setFilters({ ...filters, id: e.target.value })}
/>
               </th>

              {/* Name Dropdown */}
              <th className="header-row">
                <input
                    type="text"
                    className="column-filter-input"
                    
                    placeholder="Applicant Name"
                    value={filters.name}
                    onChange={(e) =>
                      setFilters({ ...filters, name: e.target.value })
                    }
                  />
                {/* <select
                  value={filters.name}
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                >
                  <option value="">Applicant Name</option>
                  {[...new Set(applicants.map((a) => a.name))].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                // </select> */}
              </th>

              <th className="header-row">Contact</th>
              <th className="header-row">Email</th>

              {/* Designation */}
              <th className="header-row">
                <select
                  value={filters.desgination}
                  onChange={(e) =>
                    setFilters({ ...filters, desgination: e.target.value })
                  }
                >
                  <option value="">Designation</option>
                  {[...new Set(applicants.map((a) => a.desgination))].map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    )
                  )}
                </select>
              </th>

              {/* Experience */}
              <th className="header-row">
                <select
                  value={filters.experience}
                  onChange={(e) =>
                    setFilters({ ...filters, experience: e.target.value })
                  }
                >
                  <option value="">Experience</option>
                  {[...new Set(applicants.map((a) => a.experience))].map(
                    (exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    )
                  )}
                </select>
              </th>

              {/* Location */}
              <th className="header-row">
                <select
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                >
                  <option value="">Location</option>
                  {[...new Set(applicants.map((a) => a.location))].map(
                    (loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    )
                  )}
                </select>
              </th>

              <th className="header-row">Expected DOJ</th>
              <th className="header-row">Actual DOJ</th>

              {/* Recruiter */}
              <th className="header-row">
                <select
                  value={filters.recuitername}
                  onChange={(e) =>
                    setFilters({ ...filters, recuitername: e.target.value })
                  }
                >
                  <option value="">Recruiter Name</option>
                  {[...new Set(applicants.map((a) => a.recuitername))].map(
                    (r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    )
                  )}
                </select>
              </th>

              <th className="header-row">Offer Letter</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td
  className="clickable-name"
  onClick={() => setSelectedApplicant(a)}
>
  {a.name}
</td>

                  <td>{a.contact}</td>
                  <td>{a.email}</td>
                  <td>{a.desgination}</td>
                  <td>{a.experience}</td>
                  <td>{a.location}</td>
                  <td>{a.expecteddoj}</td>
                  <td>{a.actualdoj}</td>
                  <td>{a.recuitername}</td>

                  <td>
                    <button
                      className="offerletter-icon"
                      onClick={() => navigate(`OfferLetter/${a.name}`)}
                    >
                      📄
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="no-data">
                  No hired applicants match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        </>
)}

 
      {/* Footer */}
    
    {
!selectedApplicant &&

    <div className="onhold-footer">
        <p>Total Applicants: {filteredApplicants.length}</p>
        <button className="onhold-export-btn" onClick={exportToExcel}>
          <FiDownload /> Export
        </button>
      </div>
    }  
    </div>
  );
};

export default Hired;