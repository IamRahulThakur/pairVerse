import React from "react";

const UserPostCard = ({ post, onDelete }) => {
  return (
    <div className="bg-base-100 w-full max-w-lg mx-auto rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 mb-6 border border-base-300">
      <div className="p-5 flex flex-col gap-3">

        {/* Post Info */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-base-content">
              {post.title}
            </h2>
            <p className="text-xs text-base-content/60 mt-1">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => onDelete(post._id)}
            className="btn btn-xs btn-error"
          >
            Delete
          </button>
        </div>

        {/* Content */}
        <p className="text-sm sm:text-base text-base-content/80">
          {post.content}
        </p>

        {/* Tech Stack Badges */}
        {post.techStack && post.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="badge badge-outline badge-primary text-xs sm:text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPostCard;
