import React, { useState, useEffect } from "react";
import TopNav from "./TopNav";
import { Modal } from "./Modal";
import deleteIcon from "../images/delete.png";
import dropdown from "../images/dropdown.png";
import searchIcon from "../images/Search.png";
import ellipse from "../images/Ellipse.png";
import leftIcon from "../images/left.png";
import rightIcon from "../images/Expand_right.png";
import "../styles/PeoplePage.css";
import axios from "axios";
// import "../styles/updated.css";

const PeoplePage = () => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [peopleData, setPeopleData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://10.2.8.12:3002/users"); // Update the URL to your backend endpoint
        setPeopleData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const [peopleeData] = useState([
    { id: 1, name: "John", surname: "Doe", role: "admin" },
    { id: 2, name: "Jane", surname: "Smith", role: "annotator" },
    { id: 3, name: "John", surname: "Doe", role: "admin" },
    { id: 4, name: "Jane", surname: "Smith", role: "annotator" },
    { id: 5, name: "John", surname: "Doe", role: "admin" },
    { id: 6, name: "Jane", surname: "Smith", role: "annotator" },
    { id: 7, name: "John", surname: "Doe", role: "admin" },
    { id: 8, name: "Jane", surname: "Smith", role: "annotator" },
  ]);

  const toggleTypeDropdown = () => {
    setIsTypeDropdownOpen(!isTypeDropdownOpen);
    setIsRoleDropdownOpen(false);
  };

  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
    setIsTypeDropdownOpen(false);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    // Assuming 3 people per page for this example
    const totalPages = Math.ceil(peopleData.length / 3);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const filteredPeopleData = peopleData.filter(
    (person) =>
      (person.name &&
        person.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (person.surname &&
        person.surname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (person.role &&
        person.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * 3;
  const endIndex = startIndex + 3;
  const currentPeopleData = filteredPeopleData.slice(startIndex, endIndex);

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div>
      <TopNav />
      <div className="peopleSection">
        <div className="manageAccessContainer">
          <div className="peopleHeader">Manage Access</div>
          <div className="peopleButtons">
            <button className="peopleButton" onClick={openModal}>
              Add People
            </button>
            <Modal showModal={showModal} setShowModal={setShowModal} />
            <button className="peopleButton">Add Teams</button>
            <img src={deleteIcon} alt="delete" className="deleteIcon" />
          </div>
        </div>

        <div className="selectionBox">
          <div className="selectionBoxContentTop">
            <div className="selectionBoxContentTopLeft">
              <input type="checkbox" />
              <label>Select All</label>
            </div>
            <div className="selectDropdowns">
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
                {isRoleDropdownOpen && (
                  <div className="dropdown-content">
                    <select className="roleDropdown">
                      <option value="role1">Role 1</option>
                      <option value="role2">Role 2</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="additionalLine"></div>

          <div className="searchBox">
            <div className="searchContainer">
              <img src={searchIcon} alt="search" className="searchIcon" />
              <input
                type="text"
                placeholder="Find a team, organization member or outside collaborator..."
                className="inputSearchBox"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="additionalLine"></div>

          <div className="additionalRow">
            {currentPeopleData.map((person, index) => (
              <div key={person.id} className="peopleData">
                <input type="checkbox" />
                <img src={ellipse} alt="profile" className="profileIcon" />
                <div className="nameSurnameContainer">
                  <div className="name">{person.name}</div>
                  <div className="surname">{person.email}</div>
                </div>
                <div className="roleContainer">
                  <label>Role</label>
                  <select className="roleDropdown" value={person.role}>
                    <option value="admin">Admin</option>
                    <option value="annotator">Annotator</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                </div>
                {index < currentPeopleData.length - 1 && (
                  <div className="additionalLine"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pagination">
        <div className="pages" onClick={handlePrevious}>
          <img src={leftIcon} alt="left" className="pageButtons" />
          <span className="pageName">Previous</span>
        </div>
        {/* <span>Page {currentPage}</span> */}
        <div className="pages" onClick={handleNext}>
          <span className="pageName">Next</span>
          <img src={rightIcon} alt="right" className="pageButtons" />
        </div>
      </div>
    </div>
  );
};

export default PeoplePage;
