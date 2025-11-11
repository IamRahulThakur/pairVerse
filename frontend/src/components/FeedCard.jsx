// FeedCard.jsx
import React from "react";

const FeedCard = ({ feed }) => {
  const { userId } = feed;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={userId.photourl || "/default-avatar.png"}
          alt={`${userId.firstName} ${userId.lastName}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {userId.firstName} {userId.lastName}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(feed.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-3">
        {feed.title}
      </h2>
      <p className="text-gray-700 leading-relaxed">{feed.content}</p>
    </div>
  );
};

export default FeedCard;