import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { formatDateTime, formatRelativeTime } from "../utils/formatters";

const UserPostCard = ({ post, onDelete }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const media = post.media || [];

  return (
    <article className="glass-panel-strong overflow-hidden rounded-[30px]">
      <div className="flex items-start justify-between gap-4 px-5 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Build update
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900" title={formatDateTime(post.createdAt)}>
            {formatRelativeTime(post.createdAt)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Visibility: <span className="font-semibold capitalize">{post.visibility || "public"}</span>
          </p>
        </div>

        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDelete(post._id)}
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-full border border-[#e8dccb] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-full border border-[#f2d7d7] bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <span className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Remove
            </span>
          </button>
        )}
      </div>

      {post.content && (
        <div className="px-5 pb-5">
          <p className="text-sm leading-8 whitespace-pre-wrap text-slate-700">{post.content}</p>
        </div>
      )}

      {media.length > 0 && (
        <div className="relative border-y border-[#efe5d6] bg-[#201c18]">
          <div className="aspect-[4/3] overflow-hidden">
            {media[currentMediaIndex].type === "video" ? (
              <video src={media[currentMediaIndex].url} controls className="h-full w-full object-contain" />
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
                onClick={() => setCurrentMediaIndex((current) => Math.max(current - 1, 0))}
                disabled={currentMediaIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition hover:bg-black/55 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentMediaIndex((current) => Math.min(current + 1, media.length - 1))
                }
                disabled={currentMediaIndex === media.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition hover:bg-black/55 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      )}
    </article>
  );
};

export default UserPostCard;
