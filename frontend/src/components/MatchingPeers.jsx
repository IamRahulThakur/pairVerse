import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Sparkles, UserPlus, Search } from "lucide-react";

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
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4 border border-indigo-100">
          <Sparkles className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-3 tracking-tight">
          Discover Peers
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Connect with developers who share your interests and tech stack
        </p>
      </div>

      {peers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No new peers found</h3>
          <p className="text-slate-500">
            We couldn't find any new matches right now. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center group hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
            >
              <div
                className="relative mb-5 cursor-pointer"
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <div className="w-24 h-24 rounded-full p-1 bg-white border border-slate-100 group-hover:border-indigo-200 transition-colors">
                  <img
                    src={user.photourl || "https://placeimg.com/100/100/people"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full rounded-full object-cover bg-slate-50"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border-2 border-white shadow-sm whitespace-nowrap tracking-wide uppercase">
                  {user.matchCount} {user.matchCount === 1 ? 'Match' : 'Matches'}
                </div>
              </div>

              <h3
                className="font-bold text-lg text-slate-900 mb-1 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                {user.firstName} {user.lastName}
              </h3>

              <p className="text-slate-500 text-sm mb-4 line-clamp-1 font-medium">
                {user.domain || "Developer"}
              </p>

              {/* Common Tech Stack */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-6 min-h-[32px]">
                {user.commonTechs?.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100"
                  >
                    {tech}
                  </span>
                ))}
                {user.commonTechs?.length > 3 && (
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-medium border border-slate-100">
                    +{user.commonTechs.length - 3}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleConnect(user._id)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"
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