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
      console.error(error);
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate(`/profile/${userId._id}`)}>
          <div className="relative">
            <img
              src={userId?.photourl || "https://placeimg.com/80/80/people"}
              alt={`${userId?.firstName}`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-100 group-hover:border-indigo-100 ring-2 ring-transparent group-hover:ring-indigo-50 transition-all"
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
              {userId?.firstName} {userId?.lastName}
            </h3>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>{formatTime(post.createdAt)}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1">
                {getVisibilityIcon(post.visibility)}
                <span className="capitalize">{post.visibility || "Public"}</span>
              </span>
            </div>
          </div>
        </div>

        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 sm:px-5 pb-3">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
            {post.content}
          </p>
        </div>
      )}

      {/* Media Gallery */}
      {post.media && post.media.length > 0 && (
        <div className="relative bg-black">
          <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden bg-slate-900">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-0 transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMedia}
                disabled={currentMediaIndex === post.media.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-0 transition-all backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1 rounded-full bg-black/20 backdrop-blur-sm">
                {post.media.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${index === currentMediaIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`group flex items-center gap-2 text-sm font-medium transition-all active:scale-95 ${isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                }`}
            >
              <Heart className={`w-[22px] h-[22px] transition-transform group-hover:scale-110 ${isLiked ? 'fill-current' : ''}`} strokeWidth={isLiked ? 0 : 2} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all active:scale-95"
            >
              <MessageCircle className="w-[22px] h-[22px] transition-transform group-hover:scale-110" strokeWidth={2} />
              <span>{post.commentsCount || 0}</span>
            </button>

            <button className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all active:scale-95">
              <Share2 className="w-[22px] h-[22px] transition-transform group-hover:scale-110" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-4 mt-3 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
            <div className="flex gap-3">
              <img
                src={userId?.photourl || "https://placeimg.com/80/80/people"}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full pl-4 pr-12 py-2 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 group-focus-within:opacity-100 hover:text-indigo-700 p-1.5 rounded-full hover:bg-indigo-50 transition-all">
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