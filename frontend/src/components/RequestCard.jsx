import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

const RequestCard = ({ user, onAccept, onReject }) => {
  const fromUserId = user?.fromUserId;
  const navigate = useNavigate();

  if (user?.status !== "interested" || !fromUserId) return null;

  return (
    <article className="glass-panel-strong rounded-[30px] px-5 py-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={() => navigate(`/profile/${fromUserId._id}`)}
          className="flex items-start gap-4 text-left"
        >
          <img
            src={fromUserId.photourl || "https://placehold.co/96x96/f4ede2/1f2937?text=PV"}
            alt={`${fromUserId.firstName} ${fromUserId.lastName}`}
            className="h-16 w-16 rounded-[22px] object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {fromUserId.firstName} {fromUserId.lastName}
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {fromUserId.domain || "Wants to connect and explore a potential collaboration"}
            </p>
          </div>
        </button>

        <div className="flex flex-1 items-center justify-end gap-3">
          <button
            type="button"
            onClick={onReject}
            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Pass
            </span>
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-full bg-[#18474f] px-4 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
          >
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Accept
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default RequestCard;
