import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/";
    }
  }, []);
  const [userData, setUserData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  let mail, name;
  if (user) {
    name = user.username;
    mail = user.email;
  } else {
    name = "";
    mail = "";
  }

  const fetchUserData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Not authenticated");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/users/get-currentuser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data.data);
    } catch (error) {
      alert(`Error! ${error}`);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleDelete = async (fileId, index) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `http://localhost:8000/api/v1/file/delete/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      setUserData((prevUserData) => ({
        ...prevUserData,
        files: prevUserData.files.filter((_, i) => i !== index),
      }));
    } catch (error) {
      alert(`Error! ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-700 min-h-screen flex justify-center items-center">
      <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-6 rounded-lg text-white max-w-md mx-auto">
        <div className="text-2xl font-bold mb-6">Profile</div>
        <div className="mb-4">
          <p className="font-bold">Username:</p>
          <p>{name}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Email:</p>
          <p>{mail}</p>
        </div>
        <div className="text-center mb-4">
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300"
            onClick={fetchUserData}
            disabled={loading}
          >
            View Details
          </button>
        </div>
        {userData && userData.files && (
          <div className="mt-6">
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Original</th>
                  <th className="px-4 py-2">Modified</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.files.map((file, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      <a
                        href={file.orginal}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.name}
                      </a>
                    </td>
                    <td className="border px-4 py-2">
                      <a
                        href={file.modified}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Modified Link
                      </a>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className={`${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        } bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300`}
                        onClick={() => handleDelete(file._id, index)}
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="text-center mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
