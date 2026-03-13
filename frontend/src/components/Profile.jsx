import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Briefcase,
  Github,
  Linkedin,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";
import { addUser } from "../utils/userSlice";
import { setPosts } from "../utils/PostSlice";
import UserPostCard from "./UserPosts";
import { formatMemberSince, getInitials, humanizeExperience } from "../utils/formatters";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const posts = useSelector((store) => store.post) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [connectionsCount, setConnectionsCount] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileRes, postsRes, connectionsRes] = await Promise.all([
          api.get("/profile"),
          api.get("/user/posts"),
          api.get("/user/connections"),
        ]);

        dispatch(addUser(profileRes.data));
        dispatch(setPosts(postsRes.data || []));
        setConnectionsCount((connectionsRes.data || []).length);
      } catch (error) {
        console.error("Profile error:", error);
        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [dispatch, navigate]);

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/user/posts/delete/${postId}`);
      dispatch(setPosts(posts.filter((post) => post._id !== postId)));
      toast.success("Update removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove update");
    }
  };

  const readiness = useMemo(() => {
    if (!user) return 0;

    const points = [
      user.firstName,
      user.lastName,
      user.username,
      user.bio,
      user.domain,
      user.experienceLevel,
      user.techStack?.length,
      user.linkedIn,
      user.Github,
      user.photourl,
    ];

    return Math.round((points.filter(Boolean).length / points.length) * 100);
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-panel-strong flex items-center gap-4 rounded-[28px] px-6 py-5 text-sm font-semibold text-slate-600">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c8dad6] border-t-[#1f6f78]" />
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="glass-panel mesh-card rounded-[38px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {user.photourl ? (
                <img
                  src={user.photourl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-28 w-28 rounded-[32px] object-cover shadow-[0_20px_50px_rgba(24,71,79,0.14)]"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-[#d7ebe6] text-3xl font-bold text-[#18474f] shadow-[0_20px_50px_rgba(24,71,79,0.14)]">
                  {getInitials(user.firstName, user.lastName)}
                </div>
              )}

              <div>
                <span className="section-kicker">
                  <Sparkles className="h-3.5 w-3.5" />
                  Collaborator profile
                </span>
                <h1 className="display-font mt-5 text-4xl font-bold text-[#16353b] sm:text-5xl">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  {user.username && (
                    <span className="rounded-full bg-white/70 px-3 py-1 font-semibold text-slate-700">
                      @{user.username}
                    </span>
                  )}
                  {user.domain && (
                    <span className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
                      <Briefcase className="h-4 w-4 text-[#1f6f78]" />
                      {user.domain}
                    </span>
                  )}
                  {user.experienceLevel && (
                    <span className="rounded-full bg-white/70 px-3 py-1 font-semibold">
                      {humanizeExperience(user.experienceLevel)}
                    </span>
                  )}
                </div>
                {user.bio && (
                  <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600">{user.bio}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/profile/edit"
                className="rounded-full border border-[#e8dccb] bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Edit profile
                </span>
              </Link>
              <Link
                to="/user/createpost"
                className="rounded-full bg-[#18474f] px-4 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
              >
                Share build update
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Profile strength" value={`${readiness}%`} note="Ready for better matching" />
            <StatCard label="Connections" value={connectionsCount} note="Accepted collaborators" />
            <StatCard label="Build updates" value={posts.length} note="Posts shared with your network" />
            <StatCard label="Member since" value={formatMemberSince(user.createdAt)} note="Visible to your network" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="glass-panel-strong rounded-[32px] px-5 py-5 sm:px-6">
            <h2 className="display-font text-2xl font-bold text-slate-900">Skills and context</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              This is the information your current matcher relies on and your future pivot will
              build on even more heavily.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <InfoBlock
                title="Tech stack"
                content={
                  user.techStack?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {user.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#1f6f78]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Add your stack to improve matching"
                  )
                }
              />
              <InfoBlock title="Timezone" content={user.timezone || "Not added yet"} />
              <InfoBlock title="LinkedIn" content={user.linkedIn || "Not connected yet"} />
              <InfoBlock title="GitHub" content={user.Github || "Not connected yet"} />
            </div>
          </div>

          <div className="glass-panel-strong rounded-[32px] px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="display-font text-2xl font-bold text-slate-900">Build updates</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Share what you are building so the current social layer serves collaboration.
                </p>
              </div>
              <Link
                to="/user/createpost"
                className="rounded-full bg-[#ff8a3d] px-4 py-3 text-sm font-semibold text-[#fffaf2] transition hover:bg-[#f07b2e]"
              >
                New update
              </Link>
            </div>

            <div className="mt-6 space-y-5">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <UserPostCard key={post._id} post={post} onDelete={handleDelete} />
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-[#e1d5c5] bg-[#faf6ee] px-6 py-10 text-center">
                  <p className="text-lg font-bold text-slate-900">No build updates yet</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Your future collaborator brand will feel stronger if you start sharing progress
                    now.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-panel-strong rounded-[32px] px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#eef6f4] p-3 text-[#1f6f78]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="display-font text-xl font-bold text-slate-900">
                  Profile checklist
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Keep this sharp so future project matching lands naturally.
                </p>
              </div>
            </div>

            <div className="mt-6 h-3 rounded-full bg-[#efe8da]">
              <div
                className="h-full rounded-full bg-[#1f6f78]"
                style={{ width: `${readiness}%` }}
              />
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <ChecklistItem label="Identity basics" done={Boolean(user.firstName && user.username)} />
              <ChecklistItem label="Bio and role" done={Boolean(user.bio && user.domain)} />
              <ChecklistItem label="Tech stack" done={Boolean(user.techStack?.length)} />
              <ChecklistItem label="Professional links" done={Boolean(user.linkedIn || user.Github)} />
            </ul>
          </div>

          <div className="glass-panel-strong rounded-[32px] px-5 py-5">
            <h2 className="display-font text-xl font-bold text-slate-900">External signals</h2>
            <div className="mt-5 space-y-3">
              {user.linkedIn && (
                <a
                  href={user.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-[22px] border border-[#e8dccb] bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  <Linkedin className="h-4 w-4 text-[#1f6f78]" />
                  LinkedIn profile
                </a>
              )}
              {user.Github && (
                <a
                  href={user.Github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-[22px] border border-[#e8dccb] bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  <Github className="h-4 w-4 text-[#1f6f78]" />
                  GitHub profile
                </a>
              )}
              {!user.linkedIn && !user.Github && (
                <p className="rounded-[22px] border border-dashed border-[#e1d5c5] bg-[#faf6ee] px-4 py-4 text-sm text-slate-500">
                  Add external links to strengthen trust and future matching quality.
                </p>
              )}
            </div>
          </div>

          <div className="glass-panel-strong rounded-[32px] px-5 py-5">
            <h2 className="display-font text-xl font-bold text-slate-900">Security</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Password management lives here so your account stays production-safe.
            </p>
            <Link
              to="/changepassword"
              className="mt-5 inline-flex rounded-full border border-[#e8dccb] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
            >
              Change password
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, note }) => (
  <div className="rounded-[28px] bg-white/78 px-4 py-4 shadow-sm ring-1 ring-black/5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
    <p className="display-font mt-3 text-3xl font-bold text-slate-900">{value}</p>
    <p className="mt-2 text-sm text-slate-500">{note}</p>
  </div>
);

const InfoBlock = ({ title, content }) => (
  <div className="rounded-[24px] border border-[#efe5d6] bg-white/70 px-4 py-4">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
    <div className="mt-3 text-sm leading-7 text-slate-700">{content}</div>
  </div>
);

const ChecklistItem = ({ label, done }) => (
  <li className="flex items-center justify-between gap-4 rounded-[22px] bg-white/70 px-4 py-3">
    <span>{label}</span>
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
        done ? "bg-[#eef6f4] text-[#1f6f78]" : "bg-[#f7f2e7] text-slate-500"
      }`}
    >
      {done ? "Done" : "Needs work"}
    </span>
  </li>
);

export default Profile;
