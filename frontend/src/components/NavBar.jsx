// Updated NavBar.jsx (just the relevant part)
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import toast from "react-hot-toast";
import SearchUsers from "./SearchUsers"; // Import the search component

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/connection/requests", label: "Requests", icon: "🔔" },
    { path: "/matchingpeers", label: "Peers", icon: "🤝" },
    { path: "/connection", label: "Connections", icon: "👥" },
  ];

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/feed" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PairVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8 flex-1 justify-center">
            {user && (
              <>
                {/* Search Bar - Centered */}
                <div className="w-full max-w-md mx-8">
                  <SearchUsers />
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActiveRoute(item.path)
                          ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* User Profile Dropdown */}
                <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                  <div className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold text-gray-900">{user.firstName}</span>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-2 focus:outline-none"
                    >
                      <img
                        alt="User photo"
                        src={user?.photourl || "https://placeimg.com/80/80/people"}
                        className="w-10 h-10 rounded-full border-2 border-blue-500"
                      />
                      <svg 
                        className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                        <Link
                          to="/changepassword"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <span>🔒</span>
                          Change Password
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <span>🚪</span>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          {user && (
            <div className="md:hidden flex items-center gap-4">
              {/* Mobile Search Icon */}
              <Link
                to="/search"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              
              <div className="text-sm text-gray-600">
                Hi, <span className="font-semibold">{user.firstName}</span>
              </div>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 mb-2">
              <img
                alt="User photo"
                src={user?.photourl || "https://placeimg.com/80/80/people"}
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-600">{user.emailId}</p>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="px-3 py-2">
              <SearchUsers />
            </div>

            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.path)
                    ? "bg-blue-100 text-blue-700 border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Additional Options */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <Link
                to="/changepassword"
                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🔒</span>
                <span className="font-medium">Change Password</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span>🚪</span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;