import React from 'react'
import JobApplicants from './JobAplicants'
// import JobApplicants from './AdminJobapplicants'

const MonthJobApplicants = () => {
    const data = [  { id: "001", name: "N.Gangadhar", skills: "HTML, React JS, Java", experience: "0yrs", salary: "20,000", location: "Hyderabad", contact: "9000000001", month:"sep" },
    { id: "002", name: "R.Jagadeesh", skills: "Python, React JS, Java", experience: "2yrs", salary: "35,000", location: "Hyderabad", contact: "9000000002" },
    { id: "003", name: "N.Tatajii", skills: "Python, React JS, Java, SQL", experience: "1yr", salary: "25,000", location: "Chennai", contact: "9000000003" },
    // { id: "004", name: "A.Likhith", skills: "React Native, JS, NodeJS", experience: "1.5yrs", salary: "30,000", location: "Bangalore", contact: "9000000004" },
    // { id: "005", name: "A.Sushma", skills: "MongoDB, NodeJS, React", experience: "0yrs", salary: "15,000", location: "Hyderabad", contact: "9000000005" },
//     
    ]
  return (
    <div>

        <JobApplicants data={data}/>
    </div>

  )
}

export default MonthJobApplicants