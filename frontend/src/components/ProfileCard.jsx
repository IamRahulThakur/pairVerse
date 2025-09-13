import React from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({ user }) => {
  // Loading skeleton
  if (!user)
    return (
      <div className="flex flex-col gap-4 w-72 sm:w-80 md:w-96 mx-auto animate-pulse">
        <div className="bg-base-300 rounded-lg h-40 w-full"></div>
        <div className="bg-base-300 rounded h-5 w-36"></div>
        <div className="bg-base-300 rounded h-5 w-full"></div>
        <div className="bg-base-300 rounded h-5 w-full"></div>
      </div>
    );

  return (
    <div className="w-72 sm:w-80 md:w-96 lg:w-[28rem] mx-auto bg-base-100 shadow-2xl rounded-2xl overflow-hidden border border-base-300 transition-transform transform hover:scale-105 duration-300">
      <div className="relative flex flex-col items-center p-6">
        {/* Edit Button */}
        <Link
          to="/profile/edit"
          className="absolute top-3 right-3 btn btn-sm btn-primary gap-1"
        >
          ✎ Edit
        </Link>

        <div className="avatar">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
            <img
              src={user.photourl || "/default-avatar.png"}
              alt={`${user.firstName} ${user.lastName}`}
            />
          </div>
        </div>

        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-center text-base-content">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-center text-sm md:text-base text-base-content/70 mt-1">
          {user.domain}
        </p>
        <p className="mt-2 text-center text-sm md:text-base text-base-content/60">
          {user.bio}
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {user.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 badge badge-outline badge-primary text-sm md:text-base"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-6">
          {user.Github.trim() && (<a
            href={user.Github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-content/70 hover:text-primary transition"
          >
            GitHub
          </a>)}
          {user.linkedIn.trim() && (<a
            href={user.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-content/70 hover:text-primary transition"
          >
            LinkedIn
          </a>)}
        </div>

        <div className="mt-4 text-center text-sm md:text-base text-base-content/60">
          Age: {user.age} | Experience: {user.experienceLevel}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
