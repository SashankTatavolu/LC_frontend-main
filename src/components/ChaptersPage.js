/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import CircularProgress from "@mui/material/CircularProgress";
import searchIcon from "../images/Search.png";
import dropdown from "../images/dropdown.png";
import leftArrow from "../images/leftArrow.png";
import rightArrow from "../images/rightArrow.png";
import "../styles/ChaptersPage.css";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import PeoplePage from "./PeoplePage";

function ChaptersPage() {
  const { projectName } = useParams();

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [chapterId, setChapterId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [repoData, setRepoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://10.2.8.12:3006/chapters");
        console.log("response data is : ", response.data);
        setRepoData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleTypeDropdown = () => {
    setIsTypeDropdownOpen(!isTypeDropdownOpen);
    setIsLanguageDropdownOpen(false);
    setIsSortDropdownOpen(false);
  };

  const toggleRoleDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    setIsTypeDropdownOpen(false);
    setIsSortDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsTypeDropdownOpen(false);
    setIsLanguageDropdownOpen(false);
  };

  const reposPerPage = 5;

  const totalPages = Math.ceil(repoData.length / reposPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedRowIndex(-1);
  };

  const startIndex = (currentPage - 1) * reposPerPage;
  const endIndex = startIndex + reposPerPage;
  const currentRepoData = repoData.slice(startIndex, endIndex);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRepoData, setFilteredRepoData] = useState([]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // useEffect(() => {
  //   // Filter repositories based on the search query
  //   const filteredRepositories = repoData.filter(
  //     (repo) =>
  //       // repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  //       repo &&
  //       repo.name &&
  //       repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredRepoData(filteredRepositories);
  // }, [searchQuery, repoData]);

  useEffect(() => {
    console.log("repo pro name: ", repoData);
    // Filter repositories based on the project name
    const filteredRepositories = repoData.filter(
      (repo) => repo.projectName === projectName
    );
    setFilteredRepoData(filteredRepositories);
  }, [projectName, repoData]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setChapterName("");
    setSelectedFile(null);
  };

  const handleChapterNameChange = (e) => {
    setChapterName(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("projectName", projectName);

      const response = await axios.post(
        "http://10.2.8.12:3006/chapters/uploadtxt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data.message);

      if (response.data.chapterText) {
        console.log("Chapter Text:", response.data.chapterText);

        // After successfully uploading the chapter, call the createSentence API
      }

      closeModal();

      // Update the repoData state to include the new chapter
      setRepoData((prevRepoData) => [
        {
          id: prevRepoData.length + 1,
          name: response.data.chapterName,
          description: response.data.chapterDescription,
          main_chapter_id: response.data.main_chapter_id,
        },
        ...prevRepoData,
      ]);

      // Update filteredRepoData based on the search query
      const filteredRepositories = repoData.filter(
        (repo) =>
          repo.projectName === projectName &&
          repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRepoData(filteredRepositories);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // const handleChapterClick = async (chapterId, chapterName) => {
  //   setChapterId(chapterId);
  //   setIsLoading(true);

  //   try {
  //     console.log("chapter id is: ", chapterId);
  //     // Call the create sentence API
  //     await createSentence(chapterId);

  //     // Set loading state to false when API call is complete
  //     setIsLoading(false);

  //     // Navigate to the TextViewContent component with the selected chapter
  //     navigate(`/chapters/${chapterId}/${chapterName}`);
  //   } catch (error) {
  //     // Handle error, e.g., show an error message to the user
  //     console.error("Error creating sentences:", error);

  //     // Set loading state to false in case of an error
  //     setIsLoading(false);
  //   }
  // };

  const handleChapterClick = async (chapter) => {
    console.log(chapter);
    console.log(chapter.id);
    setChapterId(chapter.id);
    setIsLoading(true);

    try {
      console.log("main_chapter_id is:", chapter.main_chapter_id);

      // Fetch sentences for the given main_chapter_id
      const response = await fetch(
        `http://10.2.8.12:5040/sentences?main_chapter_id=${chapter.main_chapter_id}`
      );
      const data = await response.json();
      console.log("data is: ", data);

      // Check if sentences already exist for the chapter
      const sentencesExist = data.chapters.some(
        (chapter) => chapter.sentences.length > 0
      );

      if (!sentencesExist) {
        // Call the create sentence API only if sentences don't exist
        console.log("Sentences do not exist for:", chapter.main_chapter_id);
        await createSentence(chapter.main_chapter_id);
      }

      // Set loading state to false when API call is complete
      setIsLoading(false);

      // Navigate to the desired location
      navigate(`/chapters/${chapter.main_chapter_id}/${chapter.name}`);
    } catch (error) {
      // Handle error, e.g., show an error message to the user
      console.error("Error checking/sentence creation:", error);

      // Set loading state to false in case of an error
      setIsLoading(false);
    }
  };



  const createSentence = async (mainChapterId) => {
    try {
      // Check if sentences are already created for the chapter
      const checkResponse = await axios.get(
        `http://10.2.8.12:5040/sentences?chapter_id=${mainChapterId}`
      );

      if (
        checkResponse.data.sentences &&
        checkResponse.data.sentences.length > 0
      ) {
        console.log("Sentences are already created for this chapter.");
        return; // No need to create sentences again
      }

      // If sentences are not created, make the API call to create them
      const response = await axios.post(
        "http://10.2.8.12:5040/create/sentence",
        {
          main_chapter_id: mainChapterId,
        }
      );

      console.log("Create Sentence API Response:", response.data);
      // You can handle the response as needed
    } catch (error) {
      console.error("Error creating sentences:", error);
      // Handle error, e.g., show an error message to the user
    }
  };
  const numberOfPeople = 5;
  const numberOfChapters = 4;

  return (
    <div>
      {/* <TopNav /> */}
      <div>
        <Navbar />
        <div className="project-section">
          <h2 className="project-name">{decodeURIComponent(projectName)}</h2>
          <div className="project-nav">
            <a href="#">Overview</a>
            <a href="#" className="people-circle">
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
      <div className="chaptersSection">
        <div className="chapterTop">
          <div className="chapterSearch">
            <div className="chapterSearchBox">
              <div className="ChapterSearchContainer">
                <img
                  src={searchIcon}
                  alt="search"
                  className="ChapterSearchIcon"
                />
                <input
                  type="text"
                  placeholder="Find a repository..."
                  className="ChapterInputSearchBox"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            <div className="ChapterSelectDropdowns">
              <label>Type</label>
              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleTypeDropdown}>
                  <img src={dropdown} alt="dropdown" className="dropdownIcon" />
                </div>
                {isTypeDropdownOpen && (
                  <div className="dropdown-content">
                    <select className="roleDropdown">
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                    </select>
                  </div>
                )}
              </div>
              <label>Role</label>
              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleRoleDropdown}>
                  <img src={dropdown} alt="dropdown" className="dropdownIcon" />
                </div>
                {isLanguageDropdownOpen && (
                  <div className="dropdown-content">
                    <select className="roleDropdown">
                      <option value="role1">lang 1</option>
                      <option value="role2">lang 2</option>
                    </select>
                  </div>
                )}
              </div>
              <label>Sort</label>
              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleSortDropdown}>
                  <img src={dropdown} alt="dropdown" className="dropdownIcon" />
                </div>
                {isSortDropdownOpen && (
                  <div className="dropdown-content">
                    <select className="roleDropdown">
                      <option value="role1">asc</option>
                      <option value="role2">desc</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="repoButtons">
            <button className="repoButton" onClick={openModal}>
              New Repository
            </button>
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="loadingSpinner">
              <CircularProgress size={50} />
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="modalOverlay">
              <div className="modalContent">
                <h1
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    borderBottom: "2px solid #4E33BE",
                    background: "#4E33BE",
                    color: "#fff",
                    textAlign: "center",
                    padding: "10px",
                    margin: 0,
                  }}
                >
                  Add Project
                </h1>
                <span className="closeModal" onClick={closeModal}>
                  &times;
                </span>
                <form onSubmit={handleFormSubmit}>
                  <div>
                    <label>Chapter Name:</label>
                    <input
                      type="text"
                      value={chapterName}
                      onChange={handleChapterNameChange}
                    />
                  </div>
                  <div>
                    <label>Upload File:</label>
                    <input type="file" onChange={handleFileChange} />
                  </div>

                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="repoContainer">
          {filteredRepoData.map((repo, index) => (
            <div
              key={repo.id}
              className={`repoBox ${index === 0 ? "firstRow" : ""}`}
              onClick={() => {
                console.log("Repo ID clicked:", repo.main_chapter_id);
                handleChapterClick(repo);
              }}
            >
              <div className="repoName">{repo.name}</div>
              <div className="repodescription">{repo.description}</div>
              {index < filteredRepoData.length - 1 && (
                <div className="blackLine" />
              )}
            </div>
          ))}
        </div>

        <div className="chapterPagination">
          <img
            src={leftArrow}
            alt="left_arrow"
            onClick={() => handlePageChange(currentPage - 1)}
            style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "activePage" : ""}
            >
              {index + 1}
            </button>
          ))}
          <img
            src={rightArrow}
            alt="right_arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              pointerEvents: currentPage === totalPages ? "none" : "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChaptersPage;
