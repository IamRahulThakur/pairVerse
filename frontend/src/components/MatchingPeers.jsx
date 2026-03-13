import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Sparkles, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";

const MatchingPeers = () => {
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);

  const fetchPeers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/matchingpeers");
      setPeers(res.data || []);
    } catch (error) {
      console.error("Error fetching peers:", error);
      toast.error("Could not load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeers();
  }, []);

  const handleConnect = async (id) => {
    try {
      setSendingId(id);
      await api.post(`/request/send/interested/${id}`);
      setPeers((current) => current.filter((user) => user._id !== id));
      toast.success("Connection request sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send request");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-3xl">
          <span className="section-kicker">
            <Sparkles className="h-3.5 w-3.5" />
            Match by real overlap
          </span>
          <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            Collaborators ranked by shared stack, not follower count.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            These matches come from your current backend logic today. The UI is already designed
            to expand into availability, projects, and stronger scoring when you build them.
          </p>
        </div>
      </section>

      {loading ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="glass-panel-strong animate-pulse rounded-[32px] px-5 py-6"
            >
              <div className="h-16 w-16 rounded-[24px] bg-slate-200" />
              <div className="mt-4 h-4 w-2/3 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded-full bg-slate-200" />
              <div className="mt-2 h-3 w-5/6 rounded-full bg-slate-200" />
            </div>
          ))}
        </section>
      ) : peers.length === 0 ? (
        <section className="glass-panel-strong rounded-[36px] px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
            <Compass className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">No fresh matches right now</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Try updating your tech stack and domain so the current matcher has better signal to
            work with.
          </p>
          <Link
            to="/profile/edit"
            className="mt-6 inline-flex rounded-full bg-[#245b76] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4f66]"
          >
            Improve my profile
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {peers.map((user) => (
            <article
              key={user._id}
              className="glass-panel-strong rounded-[32px] px-5 py-6 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(30,24,14,0.12)]"
            >
              <div className="flex items-start gap-4">
                <img
                  src={user.photourl || "https://placehold.co/96x96/f4ede2/1f2937?text=PV"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-16 w-16 rounded-[24px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    <span className="rounded-full bg-[#eef6f4] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#1f6f78]">
                      {user.matchCount} match{user.matchCount === 1 ? "" : "es"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Shared stack makes this a promising collaborator lead.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Shared skills
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(user.commonTechs || []).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#1f6f78]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {user.techStack?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Full stack snapshot
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.techStack.slice(0, 6).map((tech) => (
                        <span
                          key={`${user._id}-${tech}`}
                          className="rounded-full bg-[#f7f2e7] px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/profile/${user._id}`}
                  className="flex-1 rounded-full border border-[#e8dccb] px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
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
      )}
    </div>
  );
};

export default MatchingPeers;
