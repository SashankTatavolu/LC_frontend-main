import React, { useState, useEffect } from "react";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import icon from "../images/white.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../styles/USRtable.css";

const contents = [
  "concept",
  "index",
  "semcat",
  "morphosementic",
  "dependency",
  "discourse",
  "speaker view",
  "scope_row",
  "sentence type",
  "construction",
];

const USRTable = ({
  selectedSentence = { simplifiedSentence: "simplified 3 single" },
  maxIndexValue = 0,
  usrData = [],
}) => {
  const [editableCells, setEditableCells] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [originalEditableCells, setOriginalEditableCells] = useState({});
  const [editedColumnIndex, setEditedColumnIndex] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [editedAttributeName, setEditedAttributeName] = useState("");
  const [editedNewValue, setEditedNewValue] = useState("");
  const [editedCellValue, setEditedCellValue] = useState("");
  const [currentCellAttribute, setCurrentCellAttribute] = useState("");
  const [activeCellKey, setActiveCellKey] = useState("");

  useEffect(() => {
    if (selectedSentence) {
      const selectedSentenceWords =
        selectedSentence.sentence.sentence.split(" ");
      const initialEditableCells = {};

      contents.forEach((content, contentIndex) => {
        const key = `concept-${contentIndex}`;
        initialEditableCells[key] = contentIndex === 0 ? "" : content;
      });

      selectedSentenceWords.forEach((word, wordIndex) => {
        contents.forEach((content) => {
          const key = `${content}-${wordIndex}`;
          initialEditableCells[key] = "";
        });
      });

      setEditableCells(initialEditableCells);
    }
  }, [selectedSentence]);

  useEffect(() => {
    if (usrData.length > 0) {
      const usrDataMap = usrData.reduce((acc, usrDataRow, usrIndex) => {
        contents.forEach((content) => {
          const key = `${content}-${usrIndex}`;
          acc[key] = usrDataRow[content.toLowerCase()] || "";
        });
        return acc;
      }, {});

      setEditableCells((prevEditableCells) => ({
        ...prevEditableCells,
        ...usrDataMap,
      }));
    }
  }, [usrData]);

  const handleInputChange = (key) => {
    const attributeName = key.split("-")[0];
    setActiveCellKey(key);
    setCurrentCellAttribute(attributeName); // Extract the attribute name from the key
    setEditedCellValue(editableCells[key]); // Initialize edited cell value with current value
    setOpenDialog(true); // Open the dialog
  };




  const handleSubmitRemarks = async () => {
    try {
      // Update cell with edited value
      const key = activeCellKey;
      setEditableCells((prevEditableCells) => ({
        ...prevEditableCells,
        [key]: editedCellValue,
      }));

      // Extracting cell ID from usrData
      const cellIdParts = key.split("-");
      const cellIndex = parseInt(cellIdParts[1], 10);
      const cellId = usrData[cellIndex].id;

      // Log cell ID
      console.log("Cell ID:", cellId);

      // Log attribute_name, new_value, and remarks
      console.log("attribute_name:", currentCellAttribute);
      console.log("new_value:", editedCellValue);
      console.log("remarks:", remarks);

      // Save remarks
      console.log("edited index: ", editedColumnIndex);
      console.log(`http://10.2.8.12:5010/usr/update/${cellId}`);

      const backendAttributeNameMapping = {
        concept: "concepts",
        construction: "construction",
        dependency: "dependency",
        discourse: "discourse",
        index: "index",
        morphosementic: "morpho_sementic",
        scope_row: "scope_row",
        semcat: "sementic_category",
        "sentence type": "sentence_type",
        "speaker view": "speaker_view",
      };
      const backendAttributeName =
        backendAttributeNameMapping[currentCellAttribute];
      const response = await fetch(
        `http://10.2.8.12:5010/usr/update/${cellId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attribute_name: backendAttributeName,
            new_value: editedCellValue,
            remark: remarks,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save remarks: ${response.statusText}`);
      }

      console.log("Remarks saved successfully");
    } catch (error) {
      console.error("Error submitting remarks:", error.message);
    }

    setOpenDialog(false);
  };


  const handleClose = () => {
    setOpenDialog(false);
  };

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode); // Toggle edit mode
  };


  return (
    <div>
      {selectedSentence && usrData.length > 0 ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
              onClick={toggleEditMode}
              style={{
                background: "#4e33be",
                color: "#ffffff",
              }}
            >
              {editMode ? "Save" : "Edit"}
            </button>
          </div>

          <table>
            <tbody>
              {contents.map((content, rowIndex) => (
                <tr key={rowIndex}>
                  <td
                    className="USRnew-top-box "
                    style={{
                      fontWeight: "bold",
                      width: "150px",
                    }}
                  >
                    {content}
                  </td>
                  {content === "sentence type" ? (
                    <td colSpan={maxIndexValue}>
                      <div
                        onClick={() => handleInputChange(`${content}-0`)}
                        className="editable-cell"
                      >
                        {editMode ? (
                          <input
                            type="text"
                            value={editableCells[`${content}-0`] || ""}
                            className="USRnew-top-box-edit"
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              setEditableCells({
                                ...editableCells,
                                [`${content}-0`]: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div>{editableCells[`${content}-0`]}</div>
                        )}
                      </div>
                    </td>
                  ) : (
                    Array.from({ length: maxIndexValue }, (_, wordIndex) => {
                      const key = `${content}-${wordIndex}`;
                      return (
                        <td key={key}>
                          <div
                            onClick={() => handleInputChange(key)}
                            className="editable-cell"
                          >
                            {editMode ? (
                              <input
                                type="text"
                                value={editableCells[key] || ""}
                                className="USRnew-top-box-edit"
                                style={{ width: "100px" }}
                                onChange={(e) =>
                                  setEditableCells({
                                    ...editableCells,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <div>{editableCells[key]}</div>
                            )}
                          </div>
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {/* Render a placeholder or loading message when data is not available */}
          Loading or Data Not Available
        </div>
      )}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Edit Cell and Enter Remarks</DialogTitle>
        <DialogContent>
          <DialogContentText>Current Cell Content:</DialogContentText>
          <TextField
            margin="dense"
            id="editedCellValue"
            label="Cell Content"
            fullWidth
            value={editedCellValue}
            onChange={(e) => setEditedCellValue(e.target.value)}
          />
          <DialogContentText>
            Previous Cell Content: {editableCells[activeCellKey]}
          </DialogContentText>
          <DialogContentText>
            Attribute Name: {currentCellAttribute}
          </DialogContentText>
          <DialogContentText>
            Please provide remarks for the change:
          </DialogContentText>
          <TextField
            margin="dense"
            id="remarks"
            label="Remarks"
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitRemarks}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default USRTable;
