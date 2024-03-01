import React, { useRef, useEffect, useCallback } from "react";
// import { MdClose } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";

export const Modal = ({ showModal, setShowModal }) => {
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {showModal ? (
        <div className="Background" onClick={closeModal} ref={modalRef}>
          <div className="ModalWrapper">
            <div className="ModalContent">
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
                Add People
              </h1>

              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="username">
                    Username
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </label>
                  <input type="text" id="username" name="username" required />
                </div>
                <div className="form-group">
                  <label htmlFor="role">
                    Role
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </label>
                  <input type="text" id="role" name="role" required />
                </div>

                <button
                  type="submit"
                  style={{
                    background: "#4E33BE",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "10px 0",
                  }}
                >
                  Add People
                </button>
              </form>
            </div>
            {/* <MdClose
              className="CloseModalButton"
              aria-label="Close modal"
              onClick={() => setShowModal((prev) => !prev)}
            /> */}
            <CloseIcon
              onClick={() => setShowModal((prev) => !prev)}
              className="CloseModalButton"
              aria-label="Close modal"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
