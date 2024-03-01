import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import TextViewContent from "./TextViewContent";
import SentenceViewContent from "./SentenceViewContent";
import USRContent from "./USRContent";
import "../styles/RepoPage.css";

function RepoPage() {
  const [selectedView, setSelectedView] = useState("text");
  const { main_chapter_id, repoName } = useParams();
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const response = await fetch(
          `http://10.2.8.12:5000/projects/${main_chapter_id}`
        );
        const projectData = await response.json();

        if (projectData && projectData.name) {
          setProjectName(projectData.name);
          console.log(projectData.name);
        } else {
          console.error("Invalid project data format:", projectData);
        }
      } catch (error) {
        console.error("Error fetching project name:", error);
      }
    };

    fetchProjectName();
  }, [main_chapter_id]);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const renderContentView = () => {
    switch (selectedView) {
      case "text":
        return <TextViewContent main_chapter_id={main_chapter_id} />;
      case "sentence":
        return (
          <SentenceViewContent
            main_chapter_id={main_chapter_id}
            updateView={handleViewChange}
          />
        );
      case "usr":
        return <USRContent main_chapter_id={main_chapter_id} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="repoSection">
        <p>
          <span className="parentRepo">{projectName}</span>
          <span className="childRepo">{` ${repoName}`}</span>
        </p>
        <div className="repoNavBar">
          <button
            className={`RepoButton ${
              selectedView === "text" ? "underlined" : ""
            }`}
            onClick={() => handleViewChange("text")}
          >
            Text View
          </button>
          <button
            className={`RepoButton ${
              selectedView === "sentence" ? "underlined" : ""
            }`}
            onClick={() => handleViewChange("sentence")}
          >
            Sentence View
          </button>
          <button
            className={`RepoButton ${
              selectedView === "usr" ? "underlined" : ""
            }`}
            onClick={() => handleViewChange("usr")}
          >
            Usr View
          </button>
          <button
            className={`RepoButton ${
              selectedView === "settings" ? "underlined" : ""
            }`}
            onClick={() => handleViewChange("settings")}
          >
            Settings
          </button>
        </div>
        {renderContentView()}
      </div>
    </div>
  );
}

export default RepoPage;
