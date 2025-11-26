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
    <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-base-content/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/feed" className="flex items-center group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <span className="relative text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight">
                PairVerse
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8 flex-1 justify-end">
            {user && (
              <>
                {/* Search Bar */}
                <div className="w-full max-w-sm mx-4">
                  <SearchUsers />
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActiveRoute(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative group p-3 rounded-xl transition-all duration-300 ${active
                            ? "bg-primary/10 text-primary"
                            : "text-base-content/60 hover:text-primary hover:bg-base-content/5"
                          }`}
                        title={item.label}
                      >
                        <Icon className={`w-6 h-6 ${active ? "fill-current" : ""}`} strokeWidth={active ? 2.5 : 2} />
                        {active && (
                          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative ml-4 pl-4 border-l border-base-content/10">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-3 focus:outline-none group"
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">
                        {user.firstName}
                      </p>
                      <p className="text-xs text-base-content/50">Online</p>
                    </div>
                    <div className="relative">
                      <img
                        alt="User"
                        src={user?.photourl || "https://placeimg.com/80/80/people"}
                        className="w-10 h-10 rounded-full border-2 border-base-content/10 group-hover:border-primary transition-colors object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-base-content/50 transition-transform duration-300 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-4 w-56 glass rounded-2xl shadow-2xl border border-base-content/5 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200">
                      <div className="p-2 space-y-1">
                        <Link
                          to="/changepassword"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-base-content/80 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Lock className="w-4 h-4" />
                          Change Password
                        </Link>
                        <div className="h-px bg-base-content/5 my-1"></div>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-error hover:bg-error/10 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          {user && (
            <div className="md:hidden flex items-center gap-4">
              <Link
                to="/search"
                className="p-2 text-base-content/60 hover:text-primary transition-colors"
              >
                <Search className="w-6 h-6" />
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-base-content/60 hover:bg-base-content/5 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden glass border-t border-base-content/5 animate-in slide-in-from-top-5 duration-300">
          <div className="p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-base-content/5 rounded-2xl">
              <img
                alt="User"
                src={user?.photourl || "https://placeimg.com/80/80/people"}
                className="w-12 h-12 rounded-full border-2 border-primary/20"
              />
              <div>
                <p className="font-bold text-base-content">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-base-content/50">{user.emailId}</p>
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
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-base-content/70 hover:bg-base-content/5"
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
            <div className="pt-4 border-t border-base-content/5 space-y-1">
              <Link
                to="/changepassword"
                className="flex items-center gap-4 px-4 py-3 text-base-content/70 hover:bg-base-content/5 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Lock className="w-5 h-5" />
                Change Password
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-4 w-full text-left px-4 py-3 text-error hover:bg-error/10 rounded-xl transition-colors"
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