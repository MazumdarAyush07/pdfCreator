import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import PdfHandler from "./pages/PdfHandler";
import LoginRegister from "./pages/LoginRegister";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/tools" element={<PdfHandler />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
