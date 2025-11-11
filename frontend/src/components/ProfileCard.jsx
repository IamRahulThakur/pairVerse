// ProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({ user }) => {
  if (!user)
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
      <div className="flex flex-col items-center text-center">
        {/* Edit Button */}
        <div className="self-end mb-4">
          <Link
            to="/profile/edit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <span>✎</span>
            Edit Profile
          </Link>
        </div>

        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden mb-4">
          <img
            src={user.photourl || "/default-avatar.png"}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name and Domain */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-600 mb-3">{user.domain}</p>
        <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {user.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex gap-6 mb-4">
          {user.Github?.trim() && (
            <a
              href={user.Github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              GitHub
            </a>
          )}
          {user.linkedIn?.trim() && (
            <a
              href={user.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              LinkedIn
            </a>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-sm text-gray-500">
          Age: {user.age} | Experience: {user.experienceLevel}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;