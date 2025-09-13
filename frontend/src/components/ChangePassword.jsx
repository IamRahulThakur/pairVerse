import React, { useState } from 'react'
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast , { Toaster }  from "react-hot-toast";
import { Link } from 'react-router-dom';

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // clear previous error

    // 🔹 Frontend validation before API call
    if (!password || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match");
      return;
    }

    try {
      const res = await api.patch("/profile/updatePassword", {
        password,
        newPassword,
        confirmPassword,
      });

      toast.success(res.data.message || "Password changed successfully");
      navigate("/profile");
    } catch (error) {
      // 🔹 Backend error message
      const backendError = error.response?.data?.error || "Something went wrong";
      setErrorMessage(backendError);
      toast.error(backendError);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card card-bordered bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Change Password</h2>
          <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Current Password"
              className="input input-bordered w-full"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="input input-bordered w-full"
            />

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <button type="submit" className="btn btn-primary w-full">
              Change Password
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


export default ChangePassword
