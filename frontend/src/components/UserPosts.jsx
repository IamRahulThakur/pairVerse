import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  Users
} from "lucide-react";

const UserPostCard = ({ post, onDelete }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const nextMedia = (e) => {
    e.stopPropagation();
    if (post.media && currentMediaIndex < post.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = (e) => {
    e.stopPropagation();
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(post._id);
    } catch (error) {
      toast.error("Failed to delete post");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return postDate.toLocaleDateString();
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "public": return <Globe className="w-3 h-3" />;
      case "private": return <Lock className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  return (
    <div className="glass-card p-0 mb-6 overflow-hidden border border-base-content/5 group">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.userId?.photourl || "https://placeimg.com/80/80/people"}
            alt={`${post.userId?.firstName}`}
            className="w-10 h-10 rounded-full object-cover border-2 border-base-content/10"
          />
          <div>
            <h3 className="font-semibold text-base-content">
              {post.userId?.firstName} {post.userId?.lastName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <span>{formatTime(post.createdAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {getVisibilityIcon(post.visibility)}
                <span className="capitalize">{post.visibility || "Public"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Delete Action */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-base-content/40 hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Post"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in slide-in-from-right-5 fade-in duration-200">
            <span className="text-xs font-medium text-base-content/60 mr-1">Confirm?</span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
            >
              {isDeleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="p-1.5 bg-base-content/10 text-base-content rounded-lg hover:bg-base-content/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-base-content/90 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* Media Gallery */}
      {post.media && post.media.length > 0 && (
        <div className="relative bg-black/5">
          <div className="aspect-video w-full flex items-center justify-center overflow-hidden">
            {post.media[currentMediaIndex].type === 'video' ? (
              <video
                src={post.media[currentMediaIndex].url}
                className="w-full h-full object-contain"
                controls
              />
            ) : (
              <img
                src={post.media[currentMediaIndex].url}
                alt={`Post media`}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Navigation */}
          {post.media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                disabled={currentMediaIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-0 transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMedia}
                disabled={currentMediaIndex === post.media.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-0 transition-all backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.media.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentMediaIndex ? 'bg-white w-3' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Stats & Actions */}
      <div className="p-4 border-t border-base-content/5">
        <div className="flex items-center justify-between text-sm text-base-content/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              {post.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              {post.commentsCount || 0}
            </span>
          </div>
          <button className="hover:text-primary transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for X icon since it wasn't imported in the original
const X = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default UserPostCard;