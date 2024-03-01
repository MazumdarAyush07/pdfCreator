import React from "react";
import pdflogo from "../assets/pdf-logo.png";
const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 py-4">
      <div className="container mx-auto flex items-center justify-center">
        <img src={pdflogo} alt="Logo" className="w-10 h-10 mr-2" />
        <h1 className="text-white text-3xl font-bold">pdfCreator</h1>
      </div>
    </nav>
  );
};

export default Navbar;
