import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import {
  ChevronLeft,
  Briefcase,
  Code,
  Globe,
  Linkedin,
  Github,
  Layers,
  Calendar,
  AlertCircle,
  Clock,
  UserPlus
} from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Profile Not Found</h3>
          <p className="text-slate-500 mb-6">{error || "The user you are looking for does not exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-6 group text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 group">
        <div className="h-56 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-slate-900/40"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl p-1 bg-white shadow-lg">
                <img
                  src={user.photourl || "https://placeimg.com/150/150/people"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full rounded-xl object-cover bg-slate-100"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                {user.firstName} {user.lastName}
                <span className="text-sm font-normal px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  @{user.username}
                </span>
              </h1>
              <p className="text-slate-500 mt-2 flex flex-wrap items-center gap-4 text-sm font-medium">
                {user.domain && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {user.domain}
                  </span>
                )}
                {user.experienceLevel && (
                  <span className="flex items-center gap-1.5 capitalize">
                    <Layers className="w-4 h-4" />
                    {user.experienceLevel}
                  </span>
                )}
              </p>
            </div>

            {/* Connect Actions */}
            <div className="flex gap-3 mb-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Connect
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-100 pt-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              {user.bio && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">About</h3>
                  <p className="text-slate-600 leading-relaxed max-w-2xl">{user.bio}</p>
                </div>
              )}

              {/* Tech Stack */}
              {user.techStack && user.techStack.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium border border-slate-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-3">Details</h3>

                <div className="space-y-4">
                  {user.age && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Age</span>
                      <span className="font-semibold text-slate-900">{user.age}</span>
                    </div>
                  )}
                  {user.gender && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Gender</span>
                      <span className="font-semibold text-slate-900 capitalize">{user.gender}</span>
                    </div>
                  )}
                  {user.timezone && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Timezone</span>
                      <span className="font-semibold text-slate-900">{user.timezone}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(user.linkedIn || user.Github) && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    {user.linkedIn && (
                      <a
                        href={user.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-all text-sm font-medium text-slate-600 shadow-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn Profile
                      </a>
                    )}
                    {user.Github && (
                      <a
                        href={user.Github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-all text-sm font-medium text-slate-600 shadow-sm"
                      >
                        <Github className="w-4 h-4" />
                        GitHub Profile
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;