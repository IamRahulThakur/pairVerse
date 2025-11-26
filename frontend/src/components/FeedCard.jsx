import React, { useState } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Lock,
  Users,
  ChevronLeft,
  ChevronRight,
  Send
} from "lucide-react";

const FeedCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const navigate = useNavigate();

  const { userId } = post;

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.delete(`/user/posts/${post._id}/like`);
        setLikesCount(prev => prev - 1);
      } else {
        await api.post(`/user/posts/${post._id}/like`);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

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
    <div className="glass-card mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate(`/profile/${userId._id}`)}>
          <div className="relative">
            <img
              src={userId?.photourl || "https://placeimg.com/80/80/people"}
              alt={`${userId?.firstName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all shadow-sm"
            />
            <div className="absolute inset-0 rounded-full border border-black/5"></div>
          </div>
          <div>
            <h3 className="font-bold text-base-content text-lg group-hover:text-primary transition-colors">
              {userId?.firstName} {userId?.lastName}
            </h3>
            <div className="flex items-center gap-2 text-xs font-medium text-base-content/50">
              <span>{formatTime(post.createdAt)}</span>
              <span className="w-1 h-1 rounded-full bg-base-content/30"></span>
              <span className="flex items-center gap-1">
                {getVisibilityIcon(post.visibility)}
                <span className="capitalize">{post.visibility || "Public"}</span>
              </span>
            </div>
          </div>
        </div>

        <button className="p-2 text-base-content/40 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-5 pb-4">
          <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap text-[15px]">
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
                poster={post.media[currentMediaIndex].thumbnail}
              />
            ) : (
              <img
                src={post.media[currentMediaIndex].url}
                alt={`Post media`}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Navigation Controls */}
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

      {/* Actions */}
      <div className="p-4 border-t border-base-content/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm font-medium transition-all active:scale-95 ${isLiked ? 'text-error' : 'text-base-content/60 hover:text-error'
                }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} strokeWidth={2} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary transition-all active:scale-95"
            >
              <MessageCircle className="w-6 h-6" strokeWidth={2} />
              <span>{post.commentsCount || 0}</span>
            </button>

            <button className="flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-secondary transition-all active:scale-95">
              <Share2 className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-4 mt-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex gap-3">
              <img
                src={userId?.photourl || "https://placeimg.com/80/80/people"}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-base-content/10"
              />
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full pl-4 pr-12 py-2.5 rounded-2xl bg-base-content/5 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm placeholder:text-base-content/40"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary opacity-0 group-focus-within:opacity-100 hover:text-primary/80 p-1.5 rounded-full hover:bg-primary/10 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedCard;