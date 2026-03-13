import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Search, UserPlus, Users } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";
import { getInitials } from "../utils/formatters";

const SearchUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/search/${searchQuery.trim()}`);
        setResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleConnect = async (userId) => {
    try {
      setSendingId(userId);
      await api.post(`/request/send/interested/${userId}`);
      setResults((current) => current.filter((user) => user._id !== userId));
      toast.success("Connection request sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send request");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-3xl">
          <span className="section-kicker">
            <Compass className="h-3.5 w-3.5" />
            Discover collaborators
          </span>
          <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            Search the network by username and move straight into connection requests.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Today this is powered by profile data. As your upcoming product features land, this
            same surface can absorb availability, projects, and GitHub-backed skills.
          </p>
        </div>
      </section>

      <section className="glass-panel-strong rounded-[36px] px-5 py-5 sm:px-6">
        <div className="field-shell flex items-center gap-3 px-5 py-4">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Try a username like rahul, alex, or sarah"
            className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
          />
        </div>
      </section>

      {!searchQuery.trim() ? (
        <section className="glass-panel-strong rounded-[36px] px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">Start with a username search</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Search is intentionally simple today. It already gives you a clean path to view
            collaborator profiles and send real requests.
          </p>
        </section>
      ) : isLoading ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="glass-panel-strong animate-pulse rounded-[30px] px-5 py-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-200" />
              <div className="mt-4 h-4 w-2/3 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded-full bg-slate-200" />
              <div className="mt-2 h-3 w-4/5 rounded-full bg-slate-200" />
            </div>
          ))}
        </section>
      ) : results.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((user) => (
            <article
              key={user._id}
              className="glass-panel-strong rounded-[32px] px-5 py-6 transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(28,22,14,0.12)]"
            >
              <Link to={`/profile/${user._id}`} className="flex items-start gap-4">
                {user.photourl ? (
                  <img
                    src={user.photourl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-16 w-16 rounded-[22px] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#d7ebe6] text-lg font-bold text-[#18474f]">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    @{user.username || "username pending"}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {user.domain || "Completing their collaborator profile"}
                  </p>
                </div>
              </Link>

              {user.techStack?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {user.techStack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#1f6f78]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/profile/${user._id}`}
                  className="flex-1 rounded-full border border-[#e6d7c3] px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
                >
                  View profile
                </Link>
                <button
                  type="button"
                  onClick={() => handleConnect(user._id)}
                  disabled={sendingId === user._id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#245b76] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4f66] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendingId === user._id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#d6ece8] border-t-transparent" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="glass-panel-strong rounded-[36px] px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e7] text-[#b7652c]">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">No matches for that search</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Try a shorter username or ask collaborators to complete their profile details.
          </p>
        </section>
      )}
    </div>
  );
};

export default SearchUsers;
