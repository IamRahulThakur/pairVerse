import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState(null);
  const navigate = useNavigate();


  

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
        if (password !== confirmPassword) {
        setInvalidPasswordMessage("Passwords do not match");
        return;
      }
      const response = await api.post("/signup", { emailId, password });
      console.log("Signup successful:", response.data);
      return navigate("/profile");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card card-bordered bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Sign Up</h2>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Email"
              className="input input-bordered w-full"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input input-bordered w-full"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="input input-bordered w-full"
            />
            {invalidPasswordMessage && (
              <p className="text-red-500 text-sm">{invalidPasswordMessage}</p>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full"
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
