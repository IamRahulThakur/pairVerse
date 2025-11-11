// MatchingPeers.jsx
import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

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
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Peers</h1>
          <p className="text-gray-600">Connect with developers who share your interests and tech stack</p>
        </div>

        {peers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No peers found</h3>
            <p className="text-gray-500">Check back later for new peer suggestions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center"
                    onClick={() => navigate(`/profile/${user._id}`)} >
                
                  {/* Profile Image */}
                  <img
                    src={user.photourl || "/default-avatar.png"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-20 h-20 rounded-full border-4 border-blue-100 mb-4 object-cover"
                  />
                  
                  {/* User Info */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium mb-3">
                    {user.matchCount} common {user.matchCount === 1 ? 'skill' : 'skills'}
                  </p>

                  {/* Common Tech Stack */}
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {user.commonTechs?.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {user.commonTechs?.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                        +{user.commonTechs.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Connect Button */}
                  <button
                    onClick={() => handleConnect(user._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors duration-200"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingPeers;