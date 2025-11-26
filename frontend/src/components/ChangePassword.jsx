import React, { useState } from 'react'
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { Link } from 'react-router-dom';
import { Lock, Key, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.patch("/profile/updatePassword", {
        password,
        newPassword,
        confirmPassword,
      });

      toast.success(res.data.message || "Password changed successfully");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      const backendError = error.response?.data?.error || "Something went wrong";
      setErrorMessage(backendError);
      toast.error(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Toaster />
      <div className="glass-card p-8 max-w-md w-full">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center text-sm text-base-content/60 hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">Change Password</h2>
          <p className="text-base-content/60 mt-2">Ensure your account stays secure</p>
        </div>

        <form className="space-y-4" onSubmit={handleChangePassword}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-base-content/80 ml-1">Current Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-base-content/80 ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-base-content/80 ml-1">Confirm New Password</label>
            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="input-field pl-10"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-error text-sm bg-error/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;