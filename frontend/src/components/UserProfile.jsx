import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, MessageSquareMore, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";
import { getInitials, humanizeExperience } from "../utils/formatters";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/profile/${userId}`);
        setUser(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleConnect = async () => {
    try {
      setIsSending(true);
      await api.post(`/request/send/interested/${userId}`);
      setRequestSent(true);
      toast.success("Connection request sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send request");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-panel-strong flex items-center gap-4 rounded-[28px] px-6 py-5 text-sm font-semibold text-slate-600">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c8dad6] border-t-[#1f6f78]" />
          Loading collaborator profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-panel-strong mx-auto max-w-xl rounded-[36px] px-8 py-12 text-center">
        <h1 className="display-font text-3xl font-bold text-slate-900">Profile unavailable</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This collaborator profile could not be loaded.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 rounded-full bg-[#18474f] px-5 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-full border border-[#e8dccb] bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <section className="glass-panel mesh-card rounded-[38px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b4b19]">
                Collaborator profile
              </p>
              <h1 className="display-font mt-4 text-4xl font-bold text-[#16353b] sm:text-5xl">
                {user.firstName} {user.lastName}
              </h1>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                {user.username && (
                  <span className="rounded-full bg-white/70 px-3 py-1 font-semibold text-slate-700">
                    @{user.username}
                  </span>
                )}
                {user.domain && (
                  <span className="rounded-full bg-white/70 px-3 py-1">{user.domain}</span>
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
            <button
              type="button"
              onClick={handleConnect}
              disabled={isSending || requestSent}
              className="rounded-full bg-[#18474f] px-4 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                {requestSent ? "Request sent" : isSending ? "Sending..." : "Connect"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/chat/${userId}`)}
              className="rounded-full border border-[#e8dccb] bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              <span className="flex items-center gap-2">
                <MessageSquareMore className="h-4 w-4" />
                Open chat
              </span>
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel-strong rounded-[32px] px-5 py-6 sm:px-6">
          <h2 className="display-font text-2xl font-bold text-slate-900">Signals for collaboration</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            This is what you can use today to evaluate fit before your future project features
            arrive.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoBlock title="Timezone" content={user.timezone || "Not added yet"} />
            <InfoBlock title="Gender" content={user.gender || "Not added yet"} />
            <InfoBlock title="Domain" content={user.domain || "Not added yet"} />
            <InfoBlock
              title="Experience"
              content={user.experienceLevel ? humanizeExperience(user.experienceLevel) : "Not added yet"}
            />
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tech stack
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.techStack?.length ? (
                user.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#1f6f78]"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No tech stack added yet.</p>
              )}
            </div>
          </div>
        </section>

        <aside className="glass-panel-strong rounded-[32px] px-5 py-6 sm:px-6">
          <h2 className="display-font text-2xl font-bold text-slate-900">External links</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Shared profiles are a lightweight trust layer until deeper verification arrives.
          </p>

          <div className="mt-6 space-y-3">
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
              <p className="rounded-[24px] border border-dashed border-[#e1d5c5] bg-[#faf6ee] px-4 py-4 text-sm text-slate-500">
                No external links shared yet.
              </p>
            )}
          </div>

          <Link
            to="/matchingpeers"
            className="mt-6 inline-flex rounded-full border border-[#e8dccb] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
          >
            Back to matches
          </Link>
        </aside>
      </div>
    </div>
  );
};

const InfoBlock = ({ title, content }) => (
  <div className="rounded-[24px] border border-[#efe5d6] bg-white/70 px-4 py-4">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
    <p className="mt-3 text-sm leading-7 text-slate-700">{content}</p>
  </div>
);

export default UserProfile;
