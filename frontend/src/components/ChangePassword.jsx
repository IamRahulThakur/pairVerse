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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
          <p className="text-slate-500 mt-2">Ensure your account stays secure</p>
        </div>

        <form className="space-y-5" onSubmit={handleChangePassword}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Current Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</label>
            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 border border-rose-100 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 mt-4"
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