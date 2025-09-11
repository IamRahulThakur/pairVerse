import React from "react";

const FeedCard = ({ feed }) => {
  const { userId } = feed;

  return (
    <div className="bg-base-100 w-full max-w-lg mx-auto rounded-2xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 duration-300 mb-6 border border-base-300">
      <div className="p-5 flex flex-col gap-3">

        {/* User Info */}
        <div className="flex items-center gap-3">
          <img
            src={userId.photourl || "/default-avatar.png"}
            alt={`${userId.firstName} ${userId.lastName}`}
            className="w-12 h-12 rounded-full object-cover ring ring-primary ring-offset-base-100 ring-offset-2"
          />
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-base-content">
              {userId.firstName} {userId.lastName}
            </h3>
            <p className="text-xs text-base-content/60">
              {new Date(feed.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Feed Title & Content */}
        <h2 className="text-lg sm:text-xl font-bold text-base-content mt-2">
          {feed.title}
        </h2>
        <p className="text-sm sm:text-base text-base-content/80">{feed.content}</p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {userId.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="badge badge-outline badge-primary text-xs sm:text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href={userId.Github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline w-full sm:w-auto"
          >
            GitHub
          </a>
          <a
            href={userId.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-info w-full sm:w-auto"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
