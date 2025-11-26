import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Sparkles, UserPlus, Code, Search } from "lucide-react";

const MatchingPeers = () => {
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPeers = async () => {
    try {
      const res = await api.get("/user/matchingpeers");
      setPeers(res.data);
    } catch (err) {
      console.error("Error fetching peers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (id) => {
    try {
      await api.post(`/request/send/interested/${id}`);
      setPeers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPeers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
          Discover Peers
        </h1>
        <p className="text-base-content/60 text-lg">
          Connect with developers who share your interests and tech stack
        </p>
      </div>

      {peers.length === 0 ? (
        <div className="glass-card p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-base-content/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-base-content/40" />
          </div>
          <h3 className="text-xl font-bold text-base-content mb-2">No new peers found</h3>
          <p className="text-base-content/60">
            We couldn't find any new matches right now. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peers.map((user) => (
            <div
              key={user._id}
              className="glass-card p-6 flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-300"
            >
              <div
                className="relative mb-4 cursor-pointer"
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <div className="w-24 h-24 rounded-full p-1 glass group-hover:bg-primary/10 transition-colors">
                  <img
                    src={user.photourl || "https://placeimg.com/100/100/people"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-base-100 shadow-sm whitespace-nowrap">
                  {user.matchCount} {user.matchCount === 1 ? 'Match' : 'Matches'}
                </div>
              </div>

              <h3
                className="font-bold text-lg text-base-content mb-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                {user.firstName} {user.lastName}
              </h3>

              <p className="text-base-content/60 text-sm mb-4 line-clamp-1">
                {user.domain || "Developer"}
              </p>

              {/* Common Tech Stack */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-6 min-h-[32px]">
                {user.commonTechs?.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-base-content/5 text-base-content/70 rounded-md text-xs font-medium border border-base-content/5"
                  >
                    {tech}
                  </span>
                ))}
                {user.commonTechs?.length > 3 && (
                  <span className="px-2 py-1 bg-base-content/5 text-base-content/50 rounded-md text-xs font-medium">
                    +{user.commonTechs.length - 3}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleConnect(user._id)}
                className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
              >
                <UserPlus className="w-4 h-4" />
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchingPeers;