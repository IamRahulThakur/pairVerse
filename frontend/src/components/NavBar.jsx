import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { removeUser } from "../utils/userSlice";
import SearchUsers from "./SearchUsers";
import {
  User,
  Bell,
  Users,
  Network,
  LogOut,
  Lock,
  Menu,
  X,
  Search,
  ChevronDown
} from "lucide-react";

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
    { path: "/profile", label: "Profile", icon: User },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/connection/requests", label: "Requests", icon: Users },
    { path: "/matchingpeers", label: "Peers", icon: Network },
    { path: "/connection", label: "Connections", icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/feed" className="flex items-center group">
            <div className="relative flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                PairVerse
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6 flex-1 justify-end">
            {user && (
              <>
                {/* Search Bar */}
                <div className="w-full max-w-sm mx-4">
                  <SearchUsers />
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActiveRoute(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative p-2.5 rounded-lg transition-all duration-200 group ${active
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                          }`}
                        title={item.label}
                      >
                        <Icon className={`w-5 h-5 ${active ? "fill-current/20" : ""}`} strokeWidth={2} />
                        {active && (
                          <span className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full left-1/2 -translate-x-1/2"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative ml-4 pl-4 border-l border-slate-200">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2.5 focus:outline-none group"
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors leading-tight">
                        {user.firstName}
                      </p>
                      <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wide">Online</p>
                    </div>
                    <div className="relative">
                      <img
                        alt="User"
                        src={user?.photourl || "https://placeimg.com/80/80/people"}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all"
                      />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 py-1 ring-1 ring-black/5">
                      <Link
                        to="/changepassword"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Lock className="w-4 h-4" />
                        Change Password
                      </Link>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-b-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          {user && (
            <div className="md:hidden flex items-center gap-3">
              <Link
                to="/search"
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <img
                alt="User"
                src={user?.photourl || "https://placeimg.com/80/80/people"}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
              />
              <div>
                <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-slate-500">{user.emailId}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActiveRoute(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active
                      ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Additional Options */}
            <div className="pt-4 border-t border-slate-100 space-y-1">
              <Link
                to="/changepassword"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Lock className="w-5 h-5 text-slate-400" />
                Change Password
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;