import { Link, useNavigate } from "react-router-dom";
import { MessageSquareMore, UserRound } from "lucide-react";
import { humanizeExperience } from "../utils/formatters";

const ConnectionCard = ({ user }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <article className="glass-panel-strong rounded-[30px] px-5 py-5">
      <div className="flex items-start gap-4">
        <img
          src={user.photourl || "https://placehold.co/96x96/f4ede2/1f2937?text=PV"}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-16 w-16 rounded-[22px] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold text-slate-900">
              {user.firstName} {user.lastName}
            </h3>
            {user.experienceLevel && (
              <span className="rounded-full bg-[#f7f2e7] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {humanizeExperience(user.experienceLevel)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {user.domain || "Open to building something interesting"}
          </p>
          {user.techStack?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {user.techStack.slice(0, 5).map((tech) => (
                <span
                  key={`${user._id}-${tech}`}
                  className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#1f6f78]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Link
          to={`/profile/${user._id}`}
          className="flex-1 rounded-full border border-[#e8dccb] px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
        >
          <span className="inline-flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            Profile
          </span>
        </Link>
        <button
          type="button"
          onClick={() => navigate(`/chat/${user._id}`)}
          className="flex-1 rounded-full bg-[#18474f] px-4 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
        >
          <span className="inline-flex items-center gap-2">
            <MessageSquareMore className="h-4 w-4" />
            Message
          </span>
        </button>
      </div>
    </article>
  );
};

export default ConnectionCard;
