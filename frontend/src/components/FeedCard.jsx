import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessageSquareMore, UserRound } from "lucide-react";
import { formatDateTime, formatRelativeTime, humanizeExperience } from "../utils/formatters";

const FeedCard = ({ post }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const navigate = useNavigate();
  const author = post?.userId;
  const media = post?.media || [];

  const nextMedia = () => {
    setCurrentMediaIndex((current) => Math.min(current + 1, media.length - 1));
  };

  const previousMedia = () => {
    setCurrentMediaIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <article className="glass-panel-strong overflow-hidden rounded-[32px]">
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(`/profile/${author?._id}`)}
            className="flex items-start gap-3 text-left"
          >
            <img
              src={author?.photourl || "https://placehold.co/96x96/f4ede2/1f2937?text=PV"}
              alt={`${author?.firstName || "PairVerse"} ${author?.lastName || ""}`}
              className="h-14 w-14 rounded-[20px] object-cover"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {author?.firstName} {author?.lastName}
                </h3>
                {author?.experienceLevel && (
                  <span className="rounded-full bg-[#f4ede2] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    {humanizeExperience(author.experienceLevel)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {author?.domain || "Sharing a build update"}
              </p>
              <p
                className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                title={formatDateTime(post.createdAt)}
              >
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </button>

          <div className="rounded-full bg-[#f5efe4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {post.visibility || "public"}
          </div>
        </div>

        {post.content && (
          <p className="text-[15px] leading-8 text-slate-700 whitespace-pre-wrap">{post.content}</p>
        )}

        {author?.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {author.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#1f6f78]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {media.length > 0 && (
        <div className="relative border-y border-[#efe5d6] bg-[#201c18]">
          <div className="aspect-[4/3] w-full overflow-hidden">
            {media[currentMediaIndex].type === "video" ? (
              <video
                src={media[currentMediaIndex].url}
                className="h-full w-full object-contain"
                controls
              />
            ) : (
              <img
                src={media[currentMediaIndex].url}
                alt="Post media"
                className="h-full w-full object-contain"
              />
            )}
          </div>

          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousMedia}
                disabled={currentMediaIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition hover:bg-black/55 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextMedia}
                disabled={currentMediaIndex === media.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition hover:bg-black/55 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur">
                {media.map((item, index) => (
                  <span
                    key={`${item.url}-${index}`}
                    className={`h-2 rounded-full transition-all ${
                      currentMediaIndex === index ? "w-5 bg-white" : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <div className="text-sm text-slate-500">
          Visible inside your accepted collaborator network.
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/profile/${author?._id}`)}
            className="rounded-full border border-[#e8dccb] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
          >
            <span className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              View profile
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/chat/${author?._id}`)}
            className="rounded-full bg-[#245b76] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4f66]"
          >
            <span className="flex items-center gap-2">
              <MessageSquareMore className="h-4 w-4" />
              Message
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default FeedCard;
