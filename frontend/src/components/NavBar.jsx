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
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="bg-base-200 shadow-sm">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="feed" className="btn btn-ghost text-xl">
              PairVerse
            </Link>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
            <div
              tabIndex={0}
              className="dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-56 max-h-64 overflow-y-auto"
            >
              <ThemeSwitcher />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {user && (
              <>
                <div> Welcome {user.firstName} </div>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="User photo"
                        src={
                          user?.photourl || "https://placeimg.com/80/80/people"
                        }
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link to="/profile" className="justify-between">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/connection/requests"
                        className="justify-between"
                      >
                        Requests
                      </Link>
                    </li>
                    <li>
                      <Link to="/connection" className="justify-between">
                        Connections
                      </Link>
                    </li>
                    <li>
                      <Link to="/changepassword" className="justify-between">
                        ChangePassword
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          {user && (
            <>
              <div className="md:hidden flex items-center">
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
        <div className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-300">
          <div className="flex flex-col gap-2 mt-2">
            <Link
              to="/profile"
              className="btn btn-ghost justify-start w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/connection/requests"
              className="btn btn-ghost justify-start w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Requests
            </Link>
            <Link
              to="/connection"
              className="btn btn-ghost justify-start w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Connections
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-ghost justify-start w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
