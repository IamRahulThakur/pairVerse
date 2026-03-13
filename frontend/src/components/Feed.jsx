import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Compass,
  MessageSquareMore,
  RefreshCw,
  Sparkles,
  Users,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";
import { addFeed } from "../utils/feedSlice";
import { addUser } from "../utils/userSlice";
import FeedCard from "./FeedCard";
import { formatRelativeTime } from "../utils/formatters";

const Feed = () => {
  const feed = useSelector((store) => store.feed) || [];
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sendingRequestId, setSendingRequestId] = useState(null);
  const userRef = useRef(user);
  const hasFetchedInitialDashboard = useRef(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const collaboratorReadiness = useMemo(() => {
    if (!user) return 0;

    const fields = [
      user.firstName,
      user.lastName,
      user.username,
      user.bio,
      user.domain,
      user.experienceLevel,
      user.techStack?.length,
      user.linkedIn || user.Github,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    const currentUser = userRef.current;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const [profileRes, feedRes, matchRes, requestRes, notificationRes, connectionRes] =
        await Promise.all([
          currentUser && !isRefresh ? Promise.resolve(null) : api.get("/profile"),
          api.get("/user/posts/feed"),
          api.get("/user/matchingpeers"),
          api.get("/user/requests/received"),
          api.get("/user/notifications?page=1&limit=4"),
          api.get("/user/connections"),
        ]);

      if (profileRes?.data) {
        dispatch(addUser(profileRes.data));
      }
      dispatch(addFeed(feedRes.data.posts || feedRes.data || []));
      setMatches(matchRes.data || []);
      setRequests(requestRes.data || []);
      setNotifications(notificationRes.data || []);
      setConnections(connectionRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.response?.data?.message || "We couldn't load your workspace.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (hasFetchedInitialDashboard.current) {
      return;
    }

    hasFetchedInitialDashboard.current = true;
    fetchDashboard();
  }, [fetchDashboard]);

  const handleConnect = async (userId) => {
    try {
      setSendingRequestId(userId);
      await api.post(`/request/send/interested/${userId}`);
      setMatches((current) => current.filter((candidate) => candidate._id !== userId));
      toast.success("Connection request sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send request");
    } finally {
      setSendingRequestId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-5">
          <div className="glass-panel-strong h-56 animate-pulse rounded-[36px]" />
          <div className="glass-panel-strong h-80 animate-pulse rounded-[32px]" />
          <div className="glass-panel-strong h-80 animate-pulse rounded-[32px]" />
        </div>
        <div className="space-y-5">
          <div className="glass-panel-strong h-64 animate-pulse rounded-[32px]" />
          <div className="glass-panel-strong h-64 animate-pulse rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <section className="space-y-6">
        <div className="glass-panel mesh-card rounded-[36px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="section-kicker">
                  <Sparkles className="h-3.5 w-3.5" />
                  Collaborator workspace
                </span>
                <h1 className="display-font mt-5 text-4xl font-bold leading-tight text-[#16353b] sm:text-[3.25rem]">
                  {user?.firstName ? `Welcome back, ${user.firstName}.` : "Welcome back."}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  PairVerse still supports feed posts, connection requests, messaging, and skill
                  matches today. This workspace now frames them around collaborator discovery.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fetchDashboard(true)}
                  disabled={refreshing}
                  className="rounded-full border border-[#e8dccb] bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </span>
                </button>
                <Link
                  to="/matchingpeers"
                  className="rounded-full bg-[#245b76] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4f66]"
                >
                  <span className="flex items-center gap-2">
                    Find matches
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Skill matches"
                value={matches.length}
                note="People with overlapping stack"
                icon={<Compass className="h-5 w-5" />}
              />
              <StatCard
                label="Pending requests"
                value={requests.length}
                note="Need your response"
                icon={<UserPlus className="h-5 w-5" />}
              />
              <StatCard
                label="Unread alerts"
                value={notifications.filter((item) => item.status === "unread").length}
                note="New activity in your network"
                icon={<Bell className="h-5 w-5" />}
              />
              <StatCard
                label="Connections"
                value={connections.length}
                note="Accepted collaborators"
                icon={<Users className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel-strong rounded-[32px] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                Collaboration feed
              </p>
              <h2 className="display-font mt-2 text-2xl font-bold text-slate-900">
                Updates from your accepted network
              </h2>
            </div>
            <Link
              to="/user/createpost"
              className="rounded-full bg-[#ff8a3d] px-4 py-3 text-sm font-semibold text-[#fffaf2] transition hover:bg-[#f07b2e]"
            >
              Share an update
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {feed.length > 0 ? (
          <div className="space-y-5">
            {feed.map((post) => (
              <FeedCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="glass-panel-strong rounded-[34px] px-8 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
              <MessageSquareMore className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Your network feed is still quiet
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Connect with more builders or publish a progress update so your workspace starts
              feeling alive.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/matchingpeers"
                className="rounded-full bg-[#245b76] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4f66]"
              >
                Explore matches
              </Link>
              <Link
                to="/user/createpost"
                className="rounded-full border border-[#e8dccb] px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
              >
                Share update
              </Link>
            </div>
          </div>
        )}
      </section>

      <aside className="space-y-6">
        <SidebarCard
          title="Top skill matches"
          subtitle="Send requests to people who already overlap with your stack."
          actionLabel="See all"
          actionTo="/matchingpeers"
        >
          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.slice(0, 3).map((match) => (
                <div
                  key={match._id}
                  className="rounded-[28px] border border-[#efe5d6] bg-white/70 p-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={match.photourl || "https://placehold.co/80x80/f4ede2/1f2937?text=PV"}
                      alt={match.firstName}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">
                        {match.firstName} {match.lastName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {match.matchCount} shared skill{match.matchCount === 1 ? "" : "s"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(match.commonTechs || []).slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-[#eef6f4] px-2.5 py-1 text-xs font-semibold text-[#1f6f78]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Link
                      to={`/profile/${match._id}`}
                      className="flex-1 rounded-full border border-[#e8dccb] px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleConnect(match._id)}
                      disabled={sendingRequestId === match._id}
                      className="flex-1 rounded-full bg-[#245b76] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4f66] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sendingRequestId === match._id ? "Sending..." : "Connect"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptySidebarState message="Add more technologies to your profile to improve matching." />
          )}
        </SidebarCard>

        <SidebarCard
          title="Requests waiting on you"
          subtitle="Accept the right people and move straight into chat."
          actionLabel="Open requests"
          actionTo="/connection/requests"
        >
          {requests.length > 0 ? (
            <div className="space-y-3">
              {requests.slice(0, 3).map((request) => (
                <Link
                  key={request._id}
                  to="/connection/requests"
                  className="block rounded-[26px] border border-[#efe5d6] bg-white/70 px-4 py-4 transition hover:bg-white"
                >
                  <p className="font-semibold text-slate-900">
                    {request.fromUserId?.firstName} {request.fromUserId?.lastName}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {request.fromUserId?.domain || "Wants to connect and collaborate"}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptySidebarState message="No pending requests right now." />
          )}
        </SidebarCard>

        <SidebarCard
          title="Profile strength"
          subtitle="Fill the key fields now so future matching upgrades slot in naturally."
        >
          <div className="rounded-[28px] border border-[#efe5d6] bg-white/75 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Ready for matching
                </p>
                <p className="display-font mt-2 text-4xl font-bold text-[#16353b]">
                  {collaboratorReadiness}%
                </p>
              </div>
              <Link
                to="/profile/edit"
                className="rounded-full bg-[#ff8a3d] px-4 py-2.5 text-sm font-semibold text-[#fffaf2] transition hover:bg-[#f07b2e]"
              >
                Improve
              </Link>
            </div>
            <div className="mt-5 h-3 rounded-full bg-[#efe8da]">
              <div
                className="h-full rounded-full bg-[#1f6f78]"
                style={{ width: `${collaboratorReadiness}%` }}
              />
            </div>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              <li>Profile basics complete: {user?.firstName && user?.username ? "Yes" : "Not yet"}</li>
              <li>Skill tags added: {user?.techStack?.length ? `${user.techStack.length} listed` : "Add your stack"}</li>
              <li>Professional context: {user?.domain && user?.experienceLevel ? "Strong" : "Needs work"}</li>
            </ul>
          </div>
        </SidebarCard>

        <SidebarCard
          title="Unread alerts"
          subtitle="Recent activity from your collaborator network."
          actionLabel="Open alerts"
          actionTo="/notifications"
        >
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <Link
                  key={notification._id}
                  to="/notifications"
                  className="block rounded-[24px] border border-[#efe5d6] bg-white/70 px-4 py-4 transition hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold leading-6 text-slate-800">
                      {notification.title}
                    </p>
                    {notification.status === "unread" && (
                      <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#1f6f78]" />
                    )}
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptySidebarState message="No new alerts yet." />
          )}
        </SidebarCard>
      </aside>
    </div>
  );
};

const StatCard = ({ label, value, note, icon }) => (
  <div className="rounded-[28px] bg-white/78 px-4 py-4 shadow-sm ring-1 ring-black/5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <p className="display-font mt-2 text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="rounded-2xl bg-[#eef6f4] p-3 text-[#1f6f78]">{icon}</div>
    </div>
    <p className="mt-3 text-sm text-slate-500">{note}</p>
  </div>
);

const SidebarCard = ({ title, subtitle, actionLabel, actionTo, children }) => (
  <section className="glass-panel-strong rounded-[32px] px-5 py-5">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="display-font text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">{subtitle}</p>
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="text-sm font-semibold text-[#1f6f78] transition hover:text-[#16353b]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
    {children}
  </section>
);

const EmptySidebarState = ({ message }) => (
  <div className="rounded-[26px] border border-dashed border-[#e1d5c5] bg-[#faf6ee] px-4 py-6 text-sm text-slate-500">
    {message}
  </div>
);

export default Feed;
