import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import FeedCard from "./FeedCard";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { RefreshCw, Plus, Compass, AlertCircle } from "lucide-react";

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
      dispatch(addFeed(response.data.posts || response.data));
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

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    getFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-300">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading your feed...</p>
      </div>
    );
  }

  if (error && !feed?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Unable to load feed</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => getFeed()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
            Your Feed
          </h1>
          <p className="text-slate-500 text-sm mt-1">Latest updates from your network</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/user/createpost")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50 shadow-sm"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Feed Content */}
      {feed && feed.length > 0 ? (
        <div className="space-y-6">
          {feed.map((post) => (
            <FeedCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No posts yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Your feed is quiet. Start following people or create your first post to see content here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/user/createpost")}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </button>
            <button
              onClick={() => navigate("/search")}
              className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Explore Users
            </button>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => navigate("/user/createpost")}
        className="fixed sm:hidden bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Error banner for partial failures */}
      {error && feed?.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-xl border-l-4 border-rose-500 flex items-center gap-3 shadow-xl animate-in slide-in-from-bottom-5 z-50">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          <span className="text-slate-700 text-sm font-medium">{error}</span>
          <button
            onClick={() => getFeed()}
            className="text-indigo-600 hover:underline text-sm font-semibold ml-2"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;