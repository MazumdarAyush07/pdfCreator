import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import pdflogo from "../assets/pdf-logo.png";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 py-4 px-4 lg:px-10">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="flex items-center mb-4 lg:mb-0">
          <img src={pdflogo} alt="Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-white text-2xl lg:text-3xl font-bold">
            pdfCreator
          </h1>
        </div>
        <div className="flex items-center">
          <Link
            to="/tools"
            className="text-white font-semibold mr-4 lg:mr-6 hover:text-blue-200"
          >
            PDF Modifier
          </Link>
          <Link
            to="/profile"
            className="text-white font-semibold hover:text-blue-200"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
