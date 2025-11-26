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
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-base-content/60 font-medium animate-pulse">Loading your feed...</p>
      </div>
    );
  }

  if (error && !feed?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-xl font-bold text-base-content mb-2">Unable to load feed</h3>
          <p className="text-base-content/60 mb-6">{error}</p>
          <button
            onClick={() => getFeed()}
            className="btn-primary w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Feed
          </h1>
          <p className="text-base-content/60 mt-1">Latest updates from your network</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-xl hover:bg-base-content/5 text-base-content/60 hover:text-primary transition-all disabled:opacity-50"
          title="Refresh Feed"
        >
          <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
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
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-base-content mb-2">No posts yet</h3>
          <p className="text-base-content/60 mb-8 max-w-md mx-auto">
            Your feed is quiet. Start following people or create your first post to see content here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/user/createpost")}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Post
            </button>
            <button
              onClick={() => navigate("/search")}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5" />
              Explore Users
            </button>
          </div>
        </div>
      )}

      {/* Error banner for partial failures */}
      {error && feed?.length > 0 && (
        <div className="fixed bottom-4 right-4 glass p-4 rounded-xl border-l-4 border-error flex items-center gap-3 shadow-lg animate-in slide-in-from-bottom-5">
          <AlertCircle className="w-5 h-5 text-error" />
          <span className="text-base-content/80 text-sm">{error}</span>
          <button
            onClick={() => getFeed()}
            className="text-primary hover:underline text-sm font-medium ml-2"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;