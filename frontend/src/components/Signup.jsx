import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";

const Signup = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/signup", { emailId, password });
      toast.success("Account created successfully!");
      dispatch(addUser(response.data));
      navigate("/profile/edit");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent mb-2">
            Join PairVerse
          </h1>
          <p className="text-base-content/60">
            Start your journey with us today
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-2xl border border-base-content/10 relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>

          <form className="space-y-6 relative z-10" onSubmit={handleSignup}>
            {error && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 ml-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="input-field pl-12 pr-12"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="cursor-pointer btn-secondary w-full flex items-center justify-center gap-2 group"
            >
              Create Account
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-secondary font-semibold hover:text-secondary/80 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;