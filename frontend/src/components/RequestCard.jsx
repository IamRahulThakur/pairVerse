import React from "react";

const RequestCard = ({ user , onAccept , onReject }) => {
  const fromUserId = user?.fromUserId;

  return (
    user?.status == "interested" && (
    <>
    <div className="card card-bordered bg-base-100 shadow-md hover:shadow-lg transition-all">
      <div className="card-body flex flex-row items-center gap-4">
        {/* Avatar */}
        <div className="avatar">
          <div className="w-16 h-16 rounded-full border">
            <img
              src={fromUserId.photourl || "/default-avatar.png"} 
              alt={`${fromUserId.firstName} ${fromUserId.lastName}`}
            />
          </div>
        </div>

        {/* User info */}
        <div className="flex-1">
          <h2 className="font-semibold text-lg">
            {fromUserId.firstName} {fromUserId.lastName}
          </h2>
          <p className="text-sm text-gray-500">{fromUserId.domain}</p>
          {/* <p className="text-sm text-gray-400 line-clamp-1">{user.bio}</p> */}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            className="btn btn-xs btn-success"
            onClick={() => onAccept(user._id)}
          >
            Accept
          </button>
          <button
            className="btn btn-xs btn-error"
            onClick={() => onReject(user._id)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
    
    </>)
  );
};

export default RequestCard;
