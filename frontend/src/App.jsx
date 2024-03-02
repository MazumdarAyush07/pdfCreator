import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import PdfHandler from "./pages/PdfHandler";
function App() {
  return (
    <div>
      <Navbar />
      <PdfHandler />
    </div>
  );
}

export default App;
