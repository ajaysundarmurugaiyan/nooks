// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Importing the eye icons

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true); // State for toggling password visibility
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const db = getFirestore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "admin1", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().password === password) {
        // Save admin state to context or local storage
        localStorage.setItem("admin1", email);
        navigate("/admin");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Error logging in");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-y-10 h-[50vh]">
        <div className="border sm:p-16 px-3 py-14 rounded-lg bg-gray-600 mt-10">
        <h2 className="text-2xl font-bold text-white flex justify-center mb-10">Admin Login</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="flex flex-col space-y-8">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border w-[18em] px-5 py-1 rounded-lg"
              required
            />
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-[18em] px-5 py-1 rounded-lg pr-10"
                required
              />
              <div
                className="absolute right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // Toggle the showPassword state
              >
                {showPassword ? (
                  <AiFillEye className="text-gray-600" size={24} />
                ) : (
                <AiFillEyeInvisible className="text-gray-600" size={24} />
                )}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="w-fit border px-10 py-1 rounded-lg font-semibold text-white hover:bg-white hover:text-gray-700 duration-300 bg-gray-700"
              >
                Login
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
