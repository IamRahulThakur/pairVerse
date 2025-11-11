// UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.user);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/profile/${userId}`);
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load user profile");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="animate-pulse">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="text-gray-600 text-lg mb-4">User not found</div>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto p-6">
        {/* Simple Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <img
                src={user.photourl || "/default-avatar.png"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
              />
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500 text-sm mb-3">@{user.username}</p>
              
              {user.domain && (
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  {user.domain}
                </div>
              )}

              {/* Stats */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                {user.experienceLevel && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Experience</span>
                    <span className="font-semibold text-gray-900 text-sm capitalize">{user.experienceLevel}</span>
                  </div>
                )}
                {user.age && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Age</span>
                    <span className="font-semibold text-gray-900 text-sm">{user.age}</span>
                  </div>
                )}
                {user.techStack && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Technologies</span>
                    <span className="font-semibold text-gray-900 text-sm">{user.techStack.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(user.linkedIn || user.Github) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
                <div className="space-y-3">
                  {user.linkedIn && (
                    <a
                      href={user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="font-medium">LinkedIn</span>
                    </a>
                  )}
                  {user.Github && (
                    <a
                      href={user.Github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="font-medium">GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Bio Section */}
            {user.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Tech Stack */}
            {user.techStack && user.techStack.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {user.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Personal Details</h3>
                    <div className="space-y-3">
                      {user.age && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Age</span>
                          <span className="font-medium text-gray-900">{user.age}</span>
                        </div>
                      )}
                      {user.experienceLevel && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Experience</span>
                          <span className="font-medium text-gray-900 capitalize">{user.experienceLevel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {user.domain && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Professional</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Domain</span>
                          <span className="font-medium text-gray-900">{user.domain}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;