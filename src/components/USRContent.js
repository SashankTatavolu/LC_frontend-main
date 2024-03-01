import React, { useState, useEffect, useCallback } from "react";
import {
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import USRTable from "../components/USRTable";

function USRContent() {
  const { main_chapter_id } = useParams();
  const [simplifiedData, setSimplifiedData] = useState({
    chapters: [],
  });
  const [loading, setLoading] = useState(false);
  const [maxIndexValue, setMaxIndexValue] = useState(0);
  const [usrData, setUsrData] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);

  const fetchSimplifiedChapters = useCallback(async () => {
    try {
      setLoading(true);
      console.log("main chapter id in sentences: ", main_chapter_id);
      const response = await fetch(
        `http://10.2.8.12:5040/sentences?main_chapter_id=${main_chapter_id}`
      );
      const data = await response.json();
      console.log("data in sentence: ", data);
      setSimplifiedData(data);
    } catch (error) {
      console.error("Error fetching simplified sentences:", error);
    } finally {
      setLoading(false);
      setTableVisible(true); // Set to true once data is fetched
    }
  }, [main_chapter_id]);

  useEffect(() => {
    if (main_chapter_id) {
      fetchSimplifiedChapters();
    }
  }, [main_chapter_id, fetchSimplifiedChapters]);

  const [selectedSentence, setSelectedSentence] = useState(null);

  const handleSimplifiedSentenceClick = (
    chapterId,
    chapterContent,
    sentence
  ) => {
    const selectedSentence = { chapterId, chapterContent, sentence };
    setSelectedSentence(selectedSentence);

    // Check if selectedSentence and selectedSentence.sentence are not null or undefined
    if (selectedSentence && selectedSentence.sentence) {
      console.log(
        "Selected sentence is: ",
        selectedSentence.sentence.sentence_simplified
      );

      // Now you can use selectedSentence directly
      createOrFetchUsr();
    } else {
      console.error(
        "selectedSentence or selectedSentence.sentence is null or undefined"
      );
      // Handle the situation where selectedSentence or selectedSentence.sentence is null or undefined
    }
  };

  const createOrFetchUsr = async () => {
    try {
      setLoading(true); // Set loading to true before the request
      console.log(
        "sentence simplify id in fetch is : ",
        selectedSentence.sentence.sentence_simplified
      );

      // Check if USR already exists for the selected sentence
      const checkUsrResponse = await fetch(
        `http://10.2.8.12:5010/getUSR?sentence_simplify=${selectedSentence.sentence.sentence_simplified}`
      );

      if (checkUsrResponse.ok) {
        // If USR exists, fetch the existing USR using GET method
        const existingUsrResult = await checkUsrResponse.json();

        if (existingUsrResult.message === "USR not found") {
          // If USR doesn't exist, create a new USR using POST method
          const sentenceSimplifications = simplifiedData.chapters.flatMap(
            (chapter) =>
              chapter.sentences.map((sentence) => sentence.sentence_simplified)
          );

          console.log(
            "sentences sent to generate usr are: ",
            sentenceSimplifications
          );

          const createUsrResponse = await fetch("http://10.2.8.12:5010/usr", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sentence_simplify: sentenceSimplifications,
            }),
          });

          if (createUsrResponse.ok) {
            const newUsrResult = await createUsrResponse.json();
            console.log(
              "New USR created successfully. USR ID:",
              newUsrResult.usr_id
            );
            console.log(
              "New USR created successfully. USR DATA:",
              newUsrResult.usr_id.usr_data
            );
            const maxIndexValue =
              parseInt(newUsrResult.usr_id.max_index_value, 10) || 0;
            console.log("max index value is : ", maxIndexValue);
            setMaxIndexValue(maxIndexValue);
            setUsrData(newUsrResult.usr_id.usr_data || []);
          } else {
            console.error("Error creating USR:", createUsrResponse.statusText);
          }
        } else {
          // If USR exists, proceed with existing data
          console.log("Existing USR fetched successfully:", existingUsrResult);
          const maxIndexValue =
            parseInt(existingUsrResult.max_index_value, 10) || 0;
          console.log("max index value is : ", maxIndexValue);
          setMaxIndexValue(maxIndexValue);
          setUsrData(existingUsrResult.usr_data || []);
        }
      } else {
        console.error(
          "Error fetching/checking USR:",
          checkUsrResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error creating/fetching USR:", error.message);
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "65vh",
        border: "1px solid #c4c4c4",
        background: "#fff",
        marginTop: "3vh",
      }}
    >
      {/* Left Column (30%) */}
      <div
        style={{
          flex: "0 0 373px",
          padding: "10px",
          overflowY: "auto",
          display: simplifiedData.chapters.length === 0 ? "none" : "block",
        }}
      >
        {simplifiedData.chapters.map((chapter) => (
          <div key={chapter.id} style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold" }}>
              {chapter.id}.&nbsp;{chapter.chapter_content}
            </div>
            <ol>
              {chapter.sentences.map((sentence, index) => (
                <ol
                  key={sentence.id}
                  onClick={() =>
                    handleSimplifiedSentenceClick(
                      chapter.id,
                      chapter.chapter_content,
                      { ...sentence, index }
                    )
                  }
                  style={{
                    background:
                      selectedSentence &&
                      selectedSentence.chapterId === chapter.id &&
                      selectedSentence.sentence.id === sentence.id
                        ? "#0056b3"
                        : "transparent",
                    color:
                      selectedSentence &&
                      selectedSentence.chapterId === chapter.id &&
                      selectedSentence.sentence.id === sentence.id
                        ? "white"
                        : "#5F6377",
                    paddingLeft: 0,
                    marginBottom: "10px",
                    marginLeft: 0,
                  }}
                >
                  {sentence.sentence_simplified}.&nbsp;{sentence.sentence}
                </ol>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div style={{ width: "1px", background: "#c4c4c4" }}></div>

      <div style={{ flex: "0 0 70%", padding: "10px" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ display: "flex", alignItems: "center" }}>
              USR generating...{" "}
              <span
                role="img"
                aria-label="Running Emoji"
                style={{
                  animation: "run-animation 0.8s infinite linear",
                  marginLeft: "5px",
                }}
              >
                🏃
              </span>
            </p>
            <CircularProgress color="primary" />
          </div>
        ) : tableVisible ? (
          <div>
            {selectedSentence && (
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <p style={{ color: "#5F6377", marginLeft: "20px" }}>
                    {selectedSentence.sentence.sentence}
                  </p>
                  <USRTable
                    selectedSentence={selectedSentence}
                    maxIndexValue={maxIndexValue}
                    usrData={usrData}
                    usrId={usrData.id}
                  />
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default USRContent;
