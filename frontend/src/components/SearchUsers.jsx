import React, { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";

const SearchUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const searchUsers = async (username) => {
    if (!username.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/search/${username}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleResultClick = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative group">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search users..."
          className="w-full bg-slate-100 border border-transparent rounded-xl py-2.5 pl-11 pr-10 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
        />

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          <Search className="w-4 h-4" />
        </div>

        {isLoading ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (searchQuery.trim() || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="p-4 text-center text-slate-500 text-sm">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {searchResults.map((user) => (
                <SearchResultItem
                  key={user._id}
                  user={user}
                  onClick={handleResultClick}
                />
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="p-4 text-center text-slate-500 text-sm">
              No users found matching "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const SearchResultItem = ({ user, onClick }) => {
  return (
    <Link
      to={`/profile/${user._id}`}
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-50 last:border-b-0 transition-colors group"
    >
      <img
        src={user.photourl || "https://placeimg.com/80/80/people"}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:border-indigo-200 transition-colors"
      />
      <div>
        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-slate-500 text-xs">@{user.username}</div>
      </div>
    </Link>
  );
};

export default SearchUsers;