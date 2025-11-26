import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Briefcase } from "lucide-react";

const RequestCard = ({ user, onAccept, onReject }) => {
  const fromUserId = user?.fromUserId;
  const navigate = useNavigate();

  if (user?.status !== "interested") return null;

  return (
    <div className="glass-card p-4 flex items-center justify-between group hover:border-primary/20 transition-all duration-300">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => navigate(`/profile/${fromUserId._id}`)}
      >
        <div className="relative">
          <img
            src={fromUserId.photourl || "https://placeimg.com/80/80/people"}
            alt={`${fromUserId.firstName} ${fromUserId.lastName}`}
            className="w-14 h-14 rounded-full object-cover border-2 border-base-content/10 group-hover:border-primary transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs border-2 border-base-100">
            <Briefcase className="w-3 h-3" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-base-content group-hover:text-primary transition-colors">
            {fromUserId.firstName} {fromUserId.lastName}
          </h3>
          <p className="text-base-content/60 text-sm flex items-center gap-1">
            {fromUserId.domain || "Developer"}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="p-2 rounded-xl bg-success/10 text-success hover:bg-success hover:text-white transition-all duration-200"
          onClick={onAccept}
          title="Accept Request"
        >
          <Check className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all duration-200"
          onClick={onReject}
          title="Reject Request"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RequestCard;