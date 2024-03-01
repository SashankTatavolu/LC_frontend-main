/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/ProjectsPageNew.css"; // Ensure that this file is imported

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleProjectClick = (projectName) => {
    navigate(`/chapters/${encodeURIComponent(projectName)}`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://10.2.8.12:5000/projects");
      const projectsData = await response.json();

      if (Array.isArray(projectsData)) {
        setProjects(projectsData);
      } else if (projectsData.projects) {
        setProjects(projectsData.projects);
      } else {
        console.error("Invalid projects data format:", projectsData);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const getProjectName = () => {
    if (location.pathname.includes("/projects")) {
      return "All Projects";
    } else {
      const projectRoute = location.pathname.split("/project/")[1];
      const selectedProject = projects.find(
        (project) => project.id === projectRoute
      );

      return selectedProject ? selectedProject.name : "All Projects";
    }
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProjectName("");
    setNewProjectDescription("");
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch("http://10.2.8.12:5000/create/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          total_chapters: 0, // Add default or placeholder values
          chapters_uploaded: 0,
          owner: 1, // Provide a default or placeholder owner value
          owner_role: "DefaultRole",

          // Add other project details as needed
        }),
      });

      if (response.ok) {
        fetchProjects();
        closeModal();
      } else {
        console.error("Error creating project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="project-section-new">
        <div>
          <h2 className="project-name-new">{getProjectName()}</h2>
          <div className="project-nav-new">
            <a href="#">Overview</a>
            <a href="/projects" className="people-circle-new">
              Projects
              <span className="circle">{projects.length}</span>
            </a>
            <Link to="/people" className="people-circle-new">
              People{" "}
              <span className="circle-new">{/* Number of People */}</span>
            </Link>
            <a href="#">Settings</a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-new">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ProjectInputSearchBox"
          />

          <button className="Add-project" onClick={openModal}>
            Add Project
          </button>
        </div>

        {/* New Project Modal */}
        {isModalOpen && (
          <div className="modalOverlayNew">
            <div className="modalContentNew">
              <span className="closeModalNew" onClick={closeModal}>
                &times;
              </span>
              <h1>Add Project</h1>
              <label htmlFor="projectName">Name:</label>
              <input
                type="text"
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <label htmlFor="projectDescription">Description:</label>
              <textarea
                id="projectDescription"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
              <button onClick={handleCreateProject}>Create Project</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        )}

        {/* Project List */}
        <div className="project-rows-container-new">
          {currentProjects.map((project, index) => (
            <div
              className="project-row"
              onClick={() => handleProjectClick(project.name)}
            >
              <div className="repoNameNew">{project.name}</div>
              <div className="repodescriptionNew">{project.description}</div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          {[...Array(Math.ceil(filteredProjects.length / projectsPerPage))].map(
            (_, index) => (
              <span
                key={index}
                onClick={() => paginate(index + 1)}
                className="page-number"
              >
                {index + 1}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
