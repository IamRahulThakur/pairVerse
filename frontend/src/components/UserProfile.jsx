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
  AlertCircle
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
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-xl font-bold text-base-content mb-2">Profile Not Found</h3>
          <p className="text-base-content/60 mb-6">{error || "The user you are looking for does not exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary w-full"
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
        className="flex items-center text-base-content/60 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Profile Header */}
      <div className="glass-card overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-secondary/20 via-accent/20 to-primary/20 relative">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl p-1 glass">
                <img
                  src={user.photourl || "https://placeimg.com/150/150/people"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                {user.firstName} {user.lastName}
                <span className="text-sm font-normal px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  @{user.username}
                </span>
              </h1>
              <p className="text-base-content/60 mt-1 flex items-center gap-4">
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

            {/* Connect Actions (Placeholder for now) */}
            <div className="flex gap-3 mb-2">
              <button className="btn-primary">
                Connect
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-base-content/5 pt-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              {user.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-base-content mb-2">About</h3>
                  <p className="text-base-content/70 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Tech Stack */}
              {user.techStack && user.techStack.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-base-content mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-secondary" />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-base-content/5 text-base-content/80 text-sm font-medium border border-base-content/5"
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
              <div className="glass p-6 rounded-xl space-y-6">
                <h3 className="font-semibold text-base-content border-b border-base-content/5 pb-2">Details</h3>

                <div className="space-y-4">
                  {user.age && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-base-content/60">Age</span>
                      <span className="font-medium text-base-content">{user.age}</span>
                    </div>
                  )}
                  {user.gender && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-base-content/60">Gender</span>
                      <span className="font-medium text-base-content capitalize">{user.gender}</span>
                    </div>
                  )}
                  {user.timezone && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-base-content/60">Timezone</span>
                      <span className="font-medium text-base-content">{user.timezone}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(user.linkedIn || user.Github) && (
                  <div className="pt-4 border-t border-base-content/5 space-y-3">
                    {user.linkedIn && (
                      <a
                        href={user.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-base-content/5 hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium text-base-content/80"
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
                        className="flex items-center gap-3 p-3 rounded-lg bg-base-content/5 hover:bg-base-content/10 transition-colors text-sm font-medium text-base-content/80"
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