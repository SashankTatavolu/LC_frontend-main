/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Navbar from "./Navbar";
import "../styles/TopNav.css";
import { Routes, Route, Link } from "react-router-dom";
import PeoplePage from "./PeoplePage";
import ChaptersPage from "./ChaptersPage";

const TopNav = () => {
  const numberOfPeople = 5;
  const numberOfChapters = 4;
  return (
    <div>
      <Navbar />
      <div className="project-section">
        <h2 className="project-name">Project Hindi</h2>
        <div className="project-nav">
          <a href="#">Overview</a>
          <a href="/chapters" className="people-circle">
            Chapter Repository
            <span className="circle">{numberOfChapters}</span>
          </a>
          <Link to="/people" className="people-circle">
            People <span className="circle">{numberOfPeople}</span>
          </Link>
          <a href="#">Settings</a>
        </div>
      </div>
      <Routes>
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
      </Routes>
    </div>
  );
};

export default TopNav;
