import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import {api} from "../utils/api";

const Login = () => {

  const [emailId , setEmailId] = useState("rahul@gmail.com");
  const [password , setPassword] = useState("Rahul@123");
  const dispatch = useDispatch();
  const  navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/login", 
        { emailId, password},
    );
    dispatch(addUser(response.data));
    return navigate("/feed");
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card card-bordered bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login </h2>
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
            <button className="btn btn-primary w-full"
            onClick={handleLogin}>Login</button>
          </form>
          <p className="mt-4 text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
