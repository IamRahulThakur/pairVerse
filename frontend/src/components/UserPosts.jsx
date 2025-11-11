import React from "react";

const UserPostCard = ({ post, onDelete }) => {
  return (
    <div className="bg-white w-full max-w-2xl mx-auto rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-6 border border-gray-200">
      <div className="p-6 flex flex-col gap-4">

        {/* Post Header with Title and Delete Button */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={() => onDelete(post._id)}
            className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            Delete
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed">
          {post.content}
        </p>

        {/* Tech Stack Badges */}
        {post.techStack && post.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
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