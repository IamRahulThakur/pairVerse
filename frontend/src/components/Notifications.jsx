import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Inbox, Link2 } from "lucide-react";
import { api } from "../utils/api";
import { formatDateTime, formatRelativeTime } from "../utils/formatters";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.status === "unread").length,
    [notifications]
  );

  const fetchNotifications = useCallback(async (pageNumber = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError("");
      const response = await api.get(`/user/notifications?page=${pageNumber}&limit=10`);
      const incoming = response.data || [];

      setNotifications((current) => (isLoadMore ? [...current, ...incoming] : incoming));
      setHasMore(incoming.length === 10);
    } catch (error) {
      console.error("Notifications fetch error:", error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/user/notification/${notificationId}/mark-read`);
      setNotifications((current) =>
        current.map((item) =>
          item._id === notificationId ? { ...item, status: "read" } : item
        )
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/user/notifications/mark-all-read");
      setNotifications((current) => current.map((item) => ({ ...item, status: "read" })));
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-3xl">
          <span className="section-kicker">
            <Bell className="h-3.5 w-3.5" />
            Network activity
          </span>
          <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            Keep track of requests, accepts, and important moments.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Notifications are simple today, but this screen is already shaped for the richer
            real-time experience you plan to add later.
          </p>
        </div>
      </section>

      <section className="glass-panel-strong rounded-[32px] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Notification inbox
            </p>
            <h2 className="display-font mt-2 text-2xl font-bold text-slate-900">
              {unreadCount} unread
            </h2>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-full bg-[#18474f] px-4 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
            >
              <span className="flex items-center gap-2">
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </span>
            </button>
          )}
        </div>
      </section>

      {loading ? (
        <section className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="glass-panel-strong animate-pulse rounded-[28px] px-5 py-5"
            >
              <div className="h-4 w-2/3 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-200" />
            </div>
          ))}
        </section>
      ) : error ? (
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
          {error}
        </section>
      ) : notifications.length === 0 ? (
        <section className="glass-panel-strong rounded-[36px] px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
            <Inbox className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">No notifications yet</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            When requests or connection updates happen, they will show up here.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {notifications.map((notification) => (
            <button
              key={notification._id}
              type="button"
              onClick={() => {
                if (notification.status === "unread") {
                  markAsRead(notification._id);
                }
              }}
              className={`glass-panel-strong w-full rounded-[28px] px-5 py-5 text-left transition ${
                notification.status === "unread"
                  ? "border border-[#d8ebe7] shadow-[0_20px_45px_rgba(31,111,120,0.08)]"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-2xl bg-[#eef6f4] p-3 text-[#1f6f78]">
                  <Link2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-semibold leading-7 text-slate-900">
                      {notification.title}
                    </p>
                    {notification.status === "unread" && (
                      <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#1f6f78]" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span>{notification.type?.replaceAll("_", " ") || "activity"}</span>
                    <span>{formatRelativeTime(notification.createdAt)}</span>
                    <span title={formatDateTime(notification.createdAt)}>
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {hasMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-full border border-[#e8dccb] px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Notifications;
