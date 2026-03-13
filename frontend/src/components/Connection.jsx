import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquareMore, Users } from "lucide-react";
import { api } from "../utils/api";
import ConnectionCard from "./ConnectionCard";

const Connection = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getConnections = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/connections");
        setConnections(response.data || []);
      } catch (error) {
        console.error("Connection error:", error);
      } finally {
        setLoading(false);
      }
    };

    getConnections();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-3xl">
          <span className="section-kicker">
            <Users className="h-3.5 w-3.5" />
            Accepted network
          </span>
          <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            The people you can already build with.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            These are your accepted connections today. PairVerse is now positioning them as active
            collaborators, not just a social graph.
          </p>
        </div>
      </section>

      <section className="glass-panel-strong rounded-[32px] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Collaborator network
            </p>
            <h2 className="display-font mt-2 text-2xl font-bold text-slate-900">
              {connections.length} accepted {connections.length === 1 ? "connection" : "connections"}
            </h2>
          </div>
          <Link
            to="/chat"
            className="rounded-full bg-[#18474f] px-4 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
          >
            <span className="flex items-center gap-2">
              <MessageSquareMore className="h-4 w-4" />
              Open chat inbox
            </span>
          </Link>
        </div>
      </section>

      {loading ? (
        <section className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="glass-panel-strong animate-pulse rounded-[30px] px-5 py-6"
            >
              <div className="h-16 w-16 rounded-[22px] bg-slate-200" />
              <div className="mt-4 h-4 w-2/3 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded-full bg-slate-200" />
            </div>
          ))}
        </section>
      ) : connections.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2">
          {connections.map((connection) => (
            <ConnectionCard key={connection._id} user={connection} />
          ))}
        </section>
      ) : (
        <section className="glass-panel-strong rounded-[36px] px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">No accepted collaborators yet</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Start from matches or search to build your first serious network.
          </p>
          <Link
            to="/matchingpeers"
            className="mt-6 inline-flex rounded-full bg-[#18474f] px-5 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
          >
            Find collaborators
          </Link>
        </section>
      )}
    </div>
  );
};

export default Connection;
