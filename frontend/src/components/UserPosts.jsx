import React, { useState } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const UserPostCard = ({ post, onDelete }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(post._id);
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
      return postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getPostStats = () => {
    return {
      likes: post.likes?.length || 0,
      comments: post.commentsCount || 0,
    };
  };

  const stats = getPostStats();

  return (
    <div className="bg-white w-full max-w-2xl mx-auto rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 mb-6 border border-gray-200 overflow-hidden">
      
      {/* Post Header with User Info */}
      <div className="p-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={post.userId?.photourl || "/default-avatar.png"}
              alt={`${post.userId?.firstName} ${post.userId?.lastName}`}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.userId?.firstName} {post.userId?.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                @{post.userId?.username}
              </p>
            </div>
          </div>

          {/* Delete Button */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Date and Visibility */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{formatTime(post.createdAt)}</span>
          {post.visibility && post.visibility !== "public" && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 capitalize">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                {post.visibility}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="p-6 pb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* Media Gallery */}
      {post.media && post.media.length > 0 && (
        <div className="relative bg-gray-100">
          <div className="max-h-96 overflow-hidden">
            {post.media[currentMediaIndex].type === 'video' ? (
              <video
                src={post.media[currentMediaIndex].url}
                className="w-full h-auto max-h-96 object-contain"
                controls
              />
            ) : (
              <img
                src={post.media[currentMediaIndex].url}
                alt={`Post media ${currentMediaIndex + 1}`}
                className="w-full h-auto max-h-96 object-contain"
              />
            )}
          </div>

          {/* Media Navigation */}
          {post.media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                disabled={currentMediaIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextMedia}
                disabled={currentMediaIndex === post.media.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all disabled:opacity-30"
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
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {stats.likes} likes
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {stats.comments} comments
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-2 justify-end border-t border-gray-100">
        {/* Like Button */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>

        {/* Comment Button */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comment
        </button>

        {/* Share Button */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPostCard;