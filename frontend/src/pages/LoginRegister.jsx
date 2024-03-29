import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successFlag, setSuccessFlag] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccessMessage("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data.data;
        setSuccessMessage("User logged in successfully");
        setError("");
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        console.log(response.data.data.user);
        setSuccessFlag(1);
      }
    } catch (error) {
      setError(error.response.data.message || "Login failed");
      setSuccessMessage("");
    }

    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }
      );

      if (response.status === 201) {
        setSuccessMessage("User registered successfully. You can now login.");
        setError("");
      }
    } catch (error) {
      setError(error.response.data.message || "Registration failed");
      setSuccessMessage("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-blue-500">
      <div className="container px-4 mx-auto">
        <div className="bg-white rounded shadow-md sm:w-96 mx-auto">
          <div className="flex border-b">
            <button
              className={`w-1/2 py-2 ${
                activeTab === "login"
                  ? "bg-blue-500 text-white"
                  : "text-blue-500"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 ${
                activeTab === "register"
                  ? "bg-blue-500 text-white"
                  : "text-blue-500"
              }`}
              onClick={() => handleTabChange("register")}
            >
              Register
            </button>
          </div>
          <div className="p-6">
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {successMessage && (
              <div className="text-green-600 mb-4">{successMessage}</div>
            )}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="loginEmail"
                    className="block text-gray-700 mb-2"
                  >
                    Email:
                  </label>
                  <input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="loginPassword"
                    className="block text-gray-700 mb-2"
                  >
                    Password:
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                {loading ? (
                  <button
                    className="w-full bg-blue-500 text-white py-2 rounded cursor-not-allowed opacity-50"
                    disabled
                  >
                    Loading...
                  </button>
                ) : successFlag ? (
                  <div>
                    <Link to="/tools">
                      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
                        Tools
                      </button>
                    </Link>
                    <Link to="/profile">
                      <button className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600 transition duration-300">
                        Profile
                      </button>
                    </Link>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Login
                  </button>
                )}
              </form>
            )}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="registerUsername"
                    className="block text-gray-700 mb-2"
                  >
                    Username:
                  </label>
                  <input
                    id="registerUsername"
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="registerEmail"
                    className="block text-gray-700 mb-2"
                  >
                    Email:
                  </label>
                  <input
                    id="registerEmail"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="registerPassword"
                    className="block text-gray-700 mb-2"
                  >
                    Password:
                  </label>
                  <input
                    id="registerPassword"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                {loading ? (
                  <button
                    className="w-full bg-blue-500 text-white py-2 rounded cursor-not-allowed opacity-50"
                    disabled
                  >
                    Registering...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Register
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
