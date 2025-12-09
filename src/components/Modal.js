import React from "react";

const Modal = ({ open, onClose, children }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {children}
    </div>
  );
};

export default Modal;
