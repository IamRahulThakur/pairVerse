import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Briefcase } from "lucide-react";

const RequestCard = ({ user, onAccept, onReject }) => {
  const fromUserId = user?.fromUserId;
  const navigate = useNavigate();

  if (user?.status !== "interested") return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between group hover:border-indigo-200 transition-all duration-300">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => navigate(`/profile/${fromUserId._id}`)}
      >
        <div className="relative">
          <img
            src={fromUserId.photourl || "https://placeimg.com/80/80/people"}
            alt={`${fromUserId.firstName} ${fromUserId.lastName}`}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 group-hover:border-indigo-100 transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
            <Briefcase className="w-3 h-3" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
            {fromUserId.firstName} {fromUserId.lastName}
          </h3>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            {fromUserId.domain || "Developer"}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-200 border border-emerald-100 shadow-sm"
          onClick={onAccept}
          title="Accept Request"
        >
          <Check className="w-5 h-5" />
        </button>
        <button
          className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200 border border-rose-100 shadow-sm"
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