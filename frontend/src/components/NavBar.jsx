import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import toast, { Toaster } from "react-hot-toast";
import ThemeSwitcher from "./ThemeSwitcher";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      dispatch(removeUser());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout");
    }
  };

  return (
    <nav className="bg-base-100 border-b border-base-300 shadow-sm">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/feed" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">PV</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                PairVerse
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/feed"
                  className="px-4 py-2 rounded-lg font-medium hover:bg-base-200 transition-colors"
                >
                  Feed
                </Link>
                <Link
                  to="/findfriends"
                  className="px-4 py-2 rounded-lg font-medium hover:bg-base-200 transition-colors"
                >
                  Find Friends
                </Link>
                <Link
                  to="/connection"
                  className="px-4 py-2 rounded-lg font-medium hover:bg-base-200 transition-colors"
                >
                  Connections
                </Link>
                <Link
                  to="/connection/requests"
                  className="px-4 py-2 rounded-lg font-medium hover:bg-base-200 transition-colors"
                >
                  Requests
                </Link>
              </div>
            )}
          </div>

          {/* Right Section - User Controls */}
          <div className="flex items-center gap-4">

            {user && (
              <>
                {/* Desktop User Info & Menu */}
                <div className="hidden md:flex items-center gap-4">
                  {/* Welcome Text */}
                  <div className="text-right">
                    <p className="font-medium text-sm">Hello {user.firstName}</p>
                  </div>


                  {/* User Avatar Dropdown */}
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      className="btn btn-ghost btn-circle avatar placeholder cursor-pointer"
                    >
                      <div className="w-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold border-2 border-base-300">
                        {user.photourl ? (
                          <img
                            src={user.photourl}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="object-cover"
                          />
                        ) : (
                          <span>
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-300"
                    >
                      <li>
                        <Link to="/profile" className="justify-between">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/changepassword">Change Password</Link>
                      </li>
                      
                      <li>
                        <button onClick={handleLogout} className="text-error font-medium">
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                  

                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="btn btn-square btn-ghost"
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isMobileMenuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden border-t border-base-300 pt-4 pb-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                {user.photourl ? (
                  <img
                    src={user.photourl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-base-content/60">Hello there! 👋</p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid gap-2">
              <Link
                to="/feed"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Feed
              </Link>
              
              <Link
                to="/findfriends"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Find Friends
              </Link>
              
              <Link
                to="/connection"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Connections
              </Link>
              
              <Link
                to="/connection/requests"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM8.5 14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                </svg>
                Requests
              </Link>
            </div>

            {/* Account Settings */}
            <div className="border-t border-base-300 pt-4">
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              
              <Link
                to="/changepassword"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </Link>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-error hover:text-error-content transition-colors w-full text-left text-error font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;