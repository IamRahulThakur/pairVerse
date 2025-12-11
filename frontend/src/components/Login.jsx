import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { emailId, password });
      dispatch(addUser(response.data));
      toast.success("Welcome back!");
      return navigate("/feed");
    } catch (error) {
      const status = error.response?.status;
      let userFriendlyMessage = "Login failed. Please try again.";

      if (status === 401) {
        userFriendlyMessage = "Invalid email or password. Check your details.";
      } else if (status === 400) {
        userFriendlyMessage = error.response.data.error || "Missing required fields.";
      } else if (status >= 500) {
        userFriendlyMessage = "Server unavailable. Please try again later.";
      } else if (error.response?.data?.error) {
        userFriendlyMessage = error.response.data.error;
      }
      setErrorMessage(userFriendlyMessage);
    }
  };

  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-lg">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 relative overflow-hidden">
          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-1">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center relative z-10 pt-6 border-t border-slate-100">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
