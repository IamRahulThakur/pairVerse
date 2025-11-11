// RequestCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const RequestCard = ({ user, onAccept, onReject }) => {
  const fromUserId = user?.fromUserId;
  const navigate = useNavigate();

  return (
    user?.status === "interested" && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer flex items-center gap-4"
            onClick={() => navigate(`/profile/${fromUserId._id}`)}>
            
            <img
              src={fromUserId.photourl || "/default-avatar.png"}
              alt={`${fromUserId.firstName} ${fromUserId.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {fromUserId.firstName} {fromUserId.lastName}
              </h3>
              <p className="text-gray-600">{fromUserId.domain}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              onClick={onAccept}
            >
              Accept
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              onClick={onReject}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default RequestCard;