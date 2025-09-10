import React from "react";
import { Link } from "react-router-dom";
const ProfileCard = ({ user }) => {
  if (!user)
    return (
      <div className="flex flex-col gap-4 w-52 mx-auto animate-pulse">
        <div className="bg-gray-700 rounded-lg h-32 w-full"></div>
        <div className="bg-gray-600 rounded h-4 w-28"></div>
        <div className="bg-gray-600 rounded h-4 w-full"></div>
        <div className="bg-gray-600 rounded h-4 w-full"></div>
      </div>
    );

  return (
    <div className="max-w-sm mx-auto bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-700 transition-transform transform hover:scale-105">
      <Link
        to="/profile/edit"
        className="absolute top-4 right-4 px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors"
      >
        Edit
      </Link>
      <div className="flex flex-col items-center p-6">
        <img
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
          src={user.photourl || "/default-avatar.png"}
          alt={`${user.firstName} ${user.lastName}`}
        />
        <h2 className="mt-4 text-2xl font-semibold text-white text-center">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-400 text-sm mt-1 text-center">{user.domain}</p>
        <p className="mt-2 text-gray-300 text-center text-sm">{user.bio}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {user.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-700 text-gray-200 text-xs font-medium rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex space-x-6">
          <a
            href={user.Github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href={user.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>

        <div className="mt-4 text-gray-400 text-sm text-center">
          Age: {user.age} | Experience: {user.experienceLevel}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
