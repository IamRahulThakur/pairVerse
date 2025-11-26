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
          className="w-full bg-base-content/5 border border-base-content/10 rounded-full py-2.5 pl-11 pr-10 text-base-content placeholder:text-base-content/40 focus:outline-none focus:bg-base-100 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        />

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors">
          <Search className="w-4 h-4" />
        </div>

        {isLoading ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-base-content/10 rounded-full text-base-content/40 hover:text-base-content transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (searchQuery.trim() || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="p-4 text-center text-base-content/50 text-sm">Searching...</div>
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
            <div className="p-4 text-center text-base-content/50 text-sm">
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
      className="flex items-center gap-3 p-3 hover:bg-primary/5 border-b border-base-content/5 last:border-b-0 transition-colors group"
    >
      <img
        src={user.photourl || "https://placeimg.com/80/80/people"}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-10 h-10 rounded-full object-cover border border-base-content/10 group-hover:border-primary/30 transition-colors"
      />
      <div>
        <div className="font-medium text-base-content group-hover:text-primary transition-colors">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-base-content/50 text-xs">@{user.username}</div>
      </div>
    </Link>
  );
};

export default SearchUsers;