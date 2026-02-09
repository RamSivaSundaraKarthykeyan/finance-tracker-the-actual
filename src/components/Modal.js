import React from "react";

const Modal = ({ open, onClose, children }) => {
  return (
    <div
      // Z-INDEX FIX: The backdrop MUST have a high z-index (e.g., z-40 or z-50)
      // and must be fixed position to properly overlap everything.
      className={`fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300 z-40 ${open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      {/* The child (modal content) itself also has z-50 in AddIncome/AddExpense */}
      {/* This inner div provides the modal's content styling and width constraints */}
      <div
        className={`bg-white rounded-2xl shadow-2xl relative z-60 w-full max-w-[500px] px-4 transition-all duration-300 transform ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on modal content from closing the modal
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
