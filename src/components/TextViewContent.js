import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TextViewContent.css";
import { useParams } from "react-router-dom";

function TextViewContent() {
  const { main_chapter_id } = useParams();
  const [chapterContent, setChapterContent] = useState([]);

  useEffect(() => {
    const fetchChapterContent = async () => {
      try {
        const response = await axios.get(
          `http://10.2.8.12:3006/chapters/${main_chapter_id}`
        );
        console.log(response.data);
        setChapterContent(response.data);
      } catch (error) {
        console.error("Error fetching chapter content:", error);
      }
    };

    fetchChapterContent();
  }, [main_chapter_id]);

  return (
    <div>
      <div
        style={{
          width: "90vw",
          height: "65vh",
          border: "1px solid #c4c4c4",
          background: "#fff",
          overflow: "auto",
          padding: "10px",
          color: "#5F6377",
          fontSize: "20px",
          paddingLeft: "2vw",
          paddingTop: "2vh",
          marginTop: "3vh",
        }}
      >
        {chapterContent.map((item) => (
          <div key={item.id}>
            {/* {item.id}&nbsp;&nbsp; */}
            {item.parent_content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TextViewContent;
