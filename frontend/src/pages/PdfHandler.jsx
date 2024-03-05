import React, { useState, useEffect } from "react";
import axios from "axios";

const PdfHandler = () => {
  const [fileName, setFileName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pagesInput, setPagesInput] = useState("");
  const [selectedPages, setSelectedPages] = useState("");
  const [newFile, setNewFile] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

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
    setSelectedPages(pagesArray.join(","));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state to true

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("name", fileName);
    formData.append("pdfFile", pdfFile);
    formData.append("selectedPages", selectedPages);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/file/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewFile(response.data.data.modified);
    } catch (error) {
      console.error("Error:", error);
    }

    setIsLoading(false); // Set loading state to false after submission
    setFileName("");
    setPdfFile(null);
    setPagesInput("");
    setSelectedPages("");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-gradient-to-b from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg mb-4">
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
            className={`${
              isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-white"
            } text-blue-600 rounded-md px-4 py-2 font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-300 w-full md:w-auto`}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      {newFile && (
        <div className="text-center">
          <a
            href={newFile}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white rounded-md px-4 py-2 font-semibold hover:bg-green-600 hover:text-white transition-colors duration-300 inline-block"
          >
            Download New File
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfHandler;
