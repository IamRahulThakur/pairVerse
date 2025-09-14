import React from "react";
import { Link } from "react-router-dom";

const ConnectionCard = ({ user }) => {
  if (!user) {return null};

  return (
    <div className="card card-bordered bg-base-100 shadow-md w-full max-w-sm transition-transform m-3 transform hover:scale-105">
      <div className="card-body items-center text-center">
        {/* Profile Image */}
        <img
          src={user.photourl || "/default-avatar.png"}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
        />

        {/* Name */}
        <h2 className="card-title mt-3 text-lg font-semibold">
          {user.firstName} {user.lastName}
        </h2>
        {/*Chat Button */}

        <Link to={"/chat/" + user._id}>
        <button className="btn btn-active">Chat</button>
        </Link>
      </div>
    </div>
  );
};

export default ConnectionCard;
