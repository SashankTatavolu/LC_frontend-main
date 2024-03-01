import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PeoplePage from "./components/PeoplePage";
import ChaptersPage from "./components/ChaptersPage";
import RepoPage from "./components/RepoPage";
import ProjectsPage from "./components/ProjectsPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/chapters/:projectName" element={<ChaptersPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route
          path="/chapters/:main_chapter_id/:repoName"
          element={<RepoPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
