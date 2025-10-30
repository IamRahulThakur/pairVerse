import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const limit = 5;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(
        `/user/notifications?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (typeof res.data === "string") {
        setMessage(res.data);
        setNotifications([]);
      } else {
        setNotifications(res.data);
        setMessage("");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/user/notification/${id}/mark-read`);
      toast.success("Marked as Read");
      fetchNotifications();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error fetching notifications");
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/user/notifications/mark-all-read");
      toast.success("All marked Read");
      fetchNotifications();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error fetching notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col items-center py-10 px-4">
      <Toaster /> {/* toast center unchanged */}
      <div className="w-full max-w-3xl card bg-base-200 shadow-2xl border border-base-300">
        <div className="card-body space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-base-300 pb-4">
            <h2 className="text-2xl font-bold tracking-wide text-primary">
              Notifications
            </h2>
            <button
              onClick={markAllRead}
              className="btn btn-sm btn-primary mt-3 sm:mt-0 cursor-pointer"
            >
              Mark All Read
            </button>
          </div>

          {/* Loader */}
          {loading && (
            <div className="" >
             <div className="skeleton h-20 w-full"></div>
             <div className="skeleton mt-3 h-22 w-full"></div>
             <div className="skeleton mt-3 h-22 w-full"></div>
            </div>
          )}

          {/* Message */}
          {message && !loading && (
            <p className="text-center text-sm text-gray-400 italic">
              {message}
            </p>
          )}

          {/* Notification List */}
          <ul className="space-y-3">
            {notifications.map((notification, i) => (
              <li
                key={i}
                className={`p-4 rounded-lg border border-base-300 transition-colors duration-200 ${
                  notification.status === "unread"
                    ? "bg-base-300/60 hover:bg-base-300"
                    : "bg-base-100 hover:bg-base-200/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium">{notification.title}</p>
                    <span
                      className={`text-xs mt-1 uppercase tracking-wide ${
                        notification.status === "unread"
                          ? "text-primary font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {notification.status}
                    </span>
                  </div>
                  {notification.status === "unread" && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="btn btn-xs btn-outline btn-success cursor-pointer"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 pt-4 border-t border-base-300">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
              className="btn btn-sm btn-outline btn-secondary cursor-pointer"
            >
              Prev
            </button>
            <span className="text-sm font-semibold">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={loading}
              className="btn btn-sm btn-outline btn-secondary cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
