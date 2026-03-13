import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, X } from "lucide-react";
import { api } from "../utils/api";
import { getInitials } from "../utils/formatters";

const UserSearchInput = ({
  className = "",
  placeholder = "Search by username",
  compact = false,
  onResultClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/search/${searchQuery.trim()}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 220);

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

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className={`field-shell flex items-center gap-3 ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}>
        <Search className="h-4 w-4 flex-shrink-0 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 ${
            compact ? "text-sm" : "text-base"
          }`}
        />
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        ) : searchQuery ? (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Sparkles className="h-4 w-4 text-slate-300" />
        )}
      </div>

      {showDropdown && (searchQuery.trim() || searchResults.length > 0) && (
        <div
          className={`absolute top-[calc(100%+0.65rem)] z-50 overflow-hidden rounded-3xl border border-white/70 bg-[#fffdf8]/98 shadow-[0_28px_60px_rgba(22,20,14,0.16)] backdrop-blur-xl ${
            compact
              ? "right-0 w-[min(22rem,calc(100vw-1.5rem))]"
              : "inset-x-0"
          }`}
        >
          {isLoading ? (
            <div className="px-4 py-5 text-sm text-slate-500">Searching collaborators...</div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-72 overflow-y-auto p-2">
              {searchResults.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  onClick={() => {
                    clearSearch();
                    onResultClick?.();
                  }}
                  className="flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-[#f6f2e8]"
                >
                  {user.photourl ? (
                    <img
                      src={user.photourl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d7ebe6] font-semibold text-[#18474f]">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </p>
                      {user.username && (
                        <span className="truncate text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          @{user.username}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {user.domain || "Building their collaborator profile"}
                    </p>
                    {!compact && user.techStack?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-[#edf5f3] px-2.5 py-1 text-xs font-semibold text-[#1f6f78]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-sm text-slate-500">
              No collaborators found for "{searchQuery}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;
