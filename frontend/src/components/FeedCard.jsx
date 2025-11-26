// FeedCard.jsx
import React, { useState } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
        // Unlike post
        await api.delete(`/user/posts/${post._id}/like`);
        setLikesCount(prev => prev - 1);
      } else {
        // Like post
        await api.post(`/user/posts/${post._id}/like`);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const nextMedia = () => {
    if (post.media && currentMediaIndex < post.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return postDate.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-all duration-300">
      {/* User Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"
          onClick={() => navigate(`/profile/${userId._id}`)}>
          <img
            src={userId?.photourl || "/default-avatar.png"}
            alt={`${userId?.firstName} ${userId?.lastName}`}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {userId?.firstName} {userId?.lastName}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>{formatTime(post.createdAt)}</span>
              {post.visibility && post.visibility !== "public" && (
                <span className="flex items-center gap-1">
                  • 
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {post.visibility}
                </span>
              )}
            </p>
          </div>
        </div>
        
        {/* Options Menu */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* Media Gallery */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 relative">
          <div className="rounded-xl overflow-hidden bg-gray-100">
            {post.media[currentMediaIndex].type === 'video' ? (
              <video
                src={post.media[currentMediaIndex].url}
                className="w-full max-h-96 object-contain"
                controls
                poster={post.media[currentMediaIndex].thumbnail}
              />
            ) : (
              <img
                src={post.media[currentMediaIndex].url}
                alt={`Post media ${currentMediaIndex + 1}`}
                className="w-full max-h-96 object-contain"
              />
            )}
          </div>

          {/* Media Navigation */}
          {post.media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                disabled={currentMediaIndex === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextMedia}
                disabled={currentMediaIndex === post.media.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Media Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {post.media.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentMediaIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>

              {/* Media Counter */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-full">
                {currentMediaIndex + 1} / {post.media.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {likesCount} likes
          </span>
          <span 
            className="flex items-center gap-1 hover:text-blue-600 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.commentsCount || 0} comments
          </span>
        </div>
        
        {/* Repost Count */}
        {post.repostedFrom && (
          <span className="flex items-center gap-1 text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Reposted
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-gray-100 pt-3">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
            isLiked 
              ? 'text-red-600 hover:bg-red-50' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} 
               fill={isLiked ? "currentColor" : "none"} 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Like
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comment
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex gap-3 mb-4">
            <img
              src={userId?.photourl || "/default-avatar.png"}
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          
          {/* Sample Comments - You'll replace this with actual comments data */}
          <div className="text-center py-4 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedCard;