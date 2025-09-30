import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

const FindFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/findfriends");
      setFriends(res.data);
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (id) => {
    try {
      await api.post(`/request/send/interested/${id}`);
      setFriends((prev) => prev.filter((user) => user._id !== id));
      toast.success("Connection Request Sent Successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <div className="flex flex-col gap-6 w-full max-w-4xl p-6">
          <div className="skeleton h-8 w-64 mb-6"></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card bg-base-200 shadow-md">
                <div className="skeleton h-48 w-full rounded-t-2xl"></div>
                <div className="card-body p-4">
                  <div className="skeleton h-6 w-3/4 mb-2"></div>
                  <div className="skeleton h-4 w-1/2 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="skeleton h-6 w-16"></div>
                    <div className="skeleton h-6 w-20"></div>
                    <div className="skeleton h-6 w-14"></div>
                  </div>
                  <div className="skeleton h-10 w-full rounded-btn"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            People You May Know
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover amazing people who share similar skills and interests with you
          </p>
        </div>

        {friends.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-base-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-base-content mb-2">
                No suggestions found
              </h3>
              <p className="text-base-content/60 mb-6">
                We'll show you friend suggestions here when we find people with similar skills.
              </p>
              <button 
                onClick={fetchUsers}
                className="btn btn-primary btn-lg"
              >
                Refresh Suggestions
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {friends.map((user) => (
              <div
                key={user._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300/50 hover:border-primary/20 group"
              >
                <figure className="px-6 pt-6">
                  <div className="avatar group-hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                      <img
                        src={user.photourl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                    </div>
                  </div>
                </figure>
                
                <div className="card-body pt-4 text-center">
                  <h2 className="card-title justify-center text-lg font-bold text-base-content">
                    {user.firstName} {user.lastName}
                  </h2>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-base-content/60 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{user.matchCount} common skills</span>
                  </div>

                  {user.commonTechs && user.commonTechs.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {user.commonTechs.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="badge badge-primary badge-outline badge-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {user.commonTechs.length > 3 && (
                          <span className="badge badge-ghost badge-sm font-medium">
                            +{user.commonTechs.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="card-actions justify-center mt-2">
                    <button
                      className="btn btn-primary btn-sm w-full group/btn"
                      onClick={() => handleRequest(user._id)}
                    >
                      <span className="group-hover/btn:scale-105 transition-transform">
                        Connect
                      </span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindFriends;