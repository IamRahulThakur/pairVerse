import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, UserPlus2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";
import RequestCard from "./RequestCard";

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/requests/received");
      setRequests(response.data || []);
    } catch (error) {
      console.error("Request error:", error);
      toast.error("Could not load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const reviewRequest = async (requestId, status) => {
    try {
      await api.post(`/request/review/${status}/${requestId}`);
      setRequests((current) => current.filter((request) => request._id !== requestId));
      toast.success(`Request ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update request");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-3xl">
          <span className="section-kicker">
            <UserPlus2 className="h-3.5 w-3.5" />
            Warm inbound interest
          </span>
          <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            Decide who you want to collaborate with next.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            These requests come from people who have already asked to connect. Accepting one turns
            them into an active connection and opens the door to chat.
          </p>
        </div>
      </section>

      <section className="glass-panel-strong rounded-[32px] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Request queue
            </p>
            <h2 className="display-font mt-2 text-2xl font-bold text-slate-900">
              {requests.length} pending {requests.length === 1 ? "request" : "requests"}
            </h2>
          </div>
          <Link
            to="/connection"
            className="rounded-full border border-[#e8dccb] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
          >
            View accepted network
          </Link>
        </div>
      </section>

      {loading ? (
        <section className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="glass-panel-strong animate-pulse rounded-[30px] px-5 py-6"
            >
              <div className="h-16 w-16 rounded-[22px] bg-slate-200" />
              <div className="mt-4 h-4 w-1/2 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded-full bg-slate-200" />
            </div>
          ))}
        </section>
      ) : requests.length > 0 ? (
        <section className="space-y-4">
          {requests.map((request) => (
            <RequestCard
              key={request._id}
              user={request}
              onAccept={() => reviewRequest(request._id, "accepted")}
              onReject={() => reviewRequest(request._id, "rejected")}
            />
          ))}
        </section>
      ) : (
        <section className="glass-panel-strong rounded-[36px] px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">You are all caught up</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            No pending requests right now. Keep your profile sharp and new matches will come.
          </p>
          <Link
            to="/matchingpeers"
            className="mt-6 inline-flex rounded-full bg-[#18474f] px-5 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
          >
            Explore matches
          </Link>
        </section>
      )}
    </div>
  );
};

export default ConnectionRequests;
