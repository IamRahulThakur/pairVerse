// Feed.jsx
import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import FeedCard from "./FeedCard";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile");
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      }
    }
  };

  const getFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      const response = await api.get("/user/posts/feed");
      dispatch(addFeed(response.data.posts || response.data)); // Handle both response formats
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(
        err.response?.data?.message || 
        "Failed to load feed. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    getFeed(true);
  };

  const handleRetry = () => {
    getFeed();
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    getFeed();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-center text-gray-600 mt-4">Loading your feed...</p>
      </div>
    );
  }

  // Show error state
  if (error && !feed?.length) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load feed</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Feed</h1>
          <p className="text-gray-600 mt-1">Latest posts from your network</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg 
            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Feed Content */}
      {feed && feed.length > 0 ? (
        <div className="space-y-6">
          {feed.map((post) => (
            <FeedCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Your feed is empty. Start following people or create your first post to see content here.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/create-post")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Post
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Explore Users
            </button>
          </div>
        </div>
      )}

      {/* Refresh loading indicator */}
      {refreshing && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error banner for partial failures */}
      {error && feed?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 text-sm">{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="text-red-800 hover:text-red-900 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;