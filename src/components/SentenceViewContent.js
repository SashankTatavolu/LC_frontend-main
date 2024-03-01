import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

function SentenceViewPage({ updateView }) {
  const { main_chapter_id } = useParams();
  const [simplifiedData, setSimplifiedData] = useState({
    chapters: [],
  });
  const [editMode, setEditMode] = useState(false);

  const handleFinalize = () => {
    updateView("usr");
  };

  const fetchSimplifiedChapters = useCallback(async () => {
    try {
      console.log("main chapter id in sentences: ", main_chapter_id);
      const response = await fetch(
        `http://10.2.8.12:5040/sentences?main_chapter_id=${main_chapter_id}`
      );
      const data = await response.json();
      console.log("data in sentence: ", data);
      setSimplifiedData(data);
    } catch (error) {
      console.error("Error fetching simplified sentences:", error);
    }
  }, [main_chapter_id]);

  useEffect(() => {
    if (main_chapter_id) {
      fetchSimplifiedChapters();
    }
  }, [main_chapter_id, fetchSimplifiedChapters]);


  const handleSentenceChange = (chapterIndex, sentenceIndex, newValue) => {
    setSimplifiedData((prevData) => {
      const newChapters = [...prevData.chapters];
      newChapters[chapterIndex].sentences[sentenceIndex].sentence = newValue;
      return { ...prevData, chapters: newChapters };
    });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      // Send a PUT request to save changes to the server
      await fetch(`http://10.2.8.12:5040/editSentence`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(simplifiedData),
      });

      // Exit edit mode after saving
      setEditMode(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  console.log("simplified data: ", simplifiedData);

  return (
    <div>
      <div
        style={{
          width: "90vw",
          height: "65vh",
          border: "1px solid #c4c4c4",
          background: "#fff",
          padding: "10px",
          position: "relative",
          marginTop: "3vh",
        }}
      >
        {simplifiedData.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex}>
            <div
              style={{
                marginBottom: "20px",
                marginLeft: "2.8vw",
                marginTop: "3vh",
              }}
            >
              <div style={{ color: "#5F6377", lineHeight: "normal" }}>
                <div style={{ color: "#5f6377", fontSize: "20px" }}>
                  <div>
                    {chapter.id}&nbsp;&nbsp;{chapter.chapter_content}
                  </div>
                </div>
                <ul>
                  {chapter.sentences &&
                    chapter.sentences.map((data, sentenceIndex) => (
                      <li
                        key={sentenceIndex}
                        style={{ display: "flex", alignItems: "flex-start" }}
                      >
                        <div
                          style={{
                            flex: "0 0 50px",
                            marginRight: "10px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              border: "1px solid #BCB7B7",
                              color: "#5F6377",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {data.sentence_simplified}
                          </div>
                        </div>
                        <div
                          style={{
                            flex: "1",
                            color: "#5F6377",
                            lineHeight: "normal",
                            fontSize: "20px",
                            marginBottom: "20px",
                          }}
                        >
                          {editMode ? (
                            <input
                              type="text"
                              value={data.sentence}
                              onChange={(e) =>
                                handleSentenceChange(
                                  chapterIndex,
                                  sentenceIndex,
                                  e.target.value
                                )
                              }
                              style={{ width: "100%" }}
                            />
                          ) : (
                            data.sentence
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => (editMode ? handleSave() : toggleEditMode())}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#4e33be",
            color: "#ffffff",
          }}
        >
          {editMode ? "Save" : "Edit"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleFinalize}
          style={{
            background: "#4e33be",
            color: "#ffffff",
            height: "30px",
            borderRadius: "2px",
            border: "none",
            width: "120px",
            fontSize: "16px",
          }}
        >
          Finalize
        </button>
      </div>
    </div>
  );
}

export default SentenceViewPage;
