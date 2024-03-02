import React, { useState } from "react";

const PdfHandler = () => {
  const [fileName, setFileName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pagesInput, setPagesInput] = useState("");
  const [selectedPages, setSelectedPages] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handlePagesChange = (event) => {
    const input = event.target.value;
    setPagesInput(input);
    const pagesArray = input
      .split(",")
      .map((page) => parseInt(page.trim(), 10))
      .filter((page) => !isNaN(page));
    setSelectedPages(pagesArray);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle the submission of the PDF file, its associated file name,
    // and the selected pages array
    console.log("File Name:", fileName);
    console.log("PDF File:", pdfFile);
    console.log("Selected Pages:", selectedPages);
    // Reset the form after submission
    setFileName("");
    setPdfFile(null);
    setPagesInput("");
    setSelectedPages([]);
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">PDF Handler</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fileName" className="text-white">
            File Name:
          </label>
          <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={handleFileNameChange}
            className="bg-white text-gray-900 rounded-md px-4 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="pdfFile" className="text-white">
            PDF File:
          </label>
          <input
            type="file"
            id="pdfFile"
            accept=".pdf"
            onChange={handleFileChange}
            className="bg-white text-gray-900 rounded-md px-4 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="pages" className="text-white">
            Pages (comma-separated integers):
          </label>
          <input
            type="text"
            id="pages"
            value={pagesInput}
            onChange={handlePagesChange}
            className="bg-white text-gray-900 rounded-md px-4 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-white text-blue-600 rounded-md px-4 py-2 font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PdfHandler;
