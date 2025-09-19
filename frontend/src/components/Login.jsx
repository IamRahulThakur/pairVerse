import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {

  const [emailId , setEmailId] = useState("sunny@gmail.com");
  const [password , setPassword] = useState("Sunny@123");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { emailId, password });
      dispatch(addUser(response.data));
      toast.success("logged in successfully");
      return navigate("/feed");
    } catch (error) {
      setErrorMessage(
        error?.response?.data.message || "Login failed. Please try again"
      );
      return;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card card-bordered bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login </h2>
          <p className="text-red-500">{errorMessage}</p>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Email"
              className="input input-bordered w-full"
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input input-bordered w-full pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button className="btn btn-primary w-full" onClick={handleLogin}>
              Login
            </button>
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
