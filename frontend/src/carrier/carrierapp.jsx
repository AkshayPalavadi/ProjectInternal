import React, { useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Homepage/Navbar";
import HeroSection from "./Homepage/HeroSection";
import SearchSection from "./Homepage/SearchSection";
import AboutSection from "./Homepage/AboutSection";
import Latestjobs from "./Homepage/Latestjobs";
import Login from "./Login/CarrierLogin";
// import Register from "./Login/Register";
import QuickDetails from "./Pages/QuickDetails";
import PersonIndex from "./carriercomponents/PersonIndex";
import "./App.css";
import Job from "./Jobs/Job.jsx";
import JobDetail from "./Jobs/JobDetail";
import Contact from "./Jobs/Contact";
// import JobList2 from "./components/JobList2";
import SavedJobList from "./Profile/SavedJobList";
import AppliedJobList from "./Profile/AppliedJobList";
import PersonApp from "./carriercomponents/PersonApp";

// Layout component to conditionally show Navbar
function Layout({ children, aboutRef, jobsRef, subscribeRef }) {
  const location = useLocation();

  // Paths where Navbar should NOT appear
  const hideNavbarPaths = ["/login", "/register"];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && (
        <Navbar
          scrollToAbout={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
          scrollToJobs={() => jobsRef.current?.scrollIntoView({ behavior: "smooth" })}
          scrollToSubscribe={() => subscribeRef.current?.scrollIntoView({ behavior: "smooth" })}
        />
      )}
      {children}
    </>
  );
}

function CarrierApp() {
  const aboutRef = useRef(null);
  const jobsRef = useRef(null);
  const subscribeRef = useRef(null);

  return (
    <Routes>
      {/* Homepage */}
      <Route
        path="/"
        element={
          <Layout aboutRef={aboutRef} jobsRef={jobsRef} subscribeRef={subscribeRef}>
            <>
              <HeroSection />
              <SearchSection />
              <div ref={aboutRef}>
                <AboutSection />
              </div>
              <div ref={jobsRef}>
                <Latestjobs subscribeRef={subscribeRef} />
              </div>
            </>
          </Layout>
        }
      />

      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/quickdetails" element={<QuickDetails />} />
      <Route path="/apply" element={<PersonApp />} />
       <Route path="/jobs" element={<Job />} />
        <Route path="/job/:id" element={<JobDetail />} />  {/* ✅ must match */}


      <Route path="/contact" element={<Contact />} />
      {/* <Route path="/joblist2"element={<JobList2/>} /> */}
      <Route path="/savedjoblist" element={<SavedJobList />} />
      <Route path="/appliedjoblist" element={<AppliedJobList />} />
      
        {/* fallback for unknown carrier routes */}
        {/* <Route path="*" element={<Homepage />} /> */}
    </Routes>
  );
}

export default CarrierApp;
