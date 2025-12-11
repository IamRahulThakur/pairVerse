import React, { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  MessageCircle,
  UserPlus,
  Heart,
  FileText,
  MoreHorizontal
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(async (pageNum = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError("");
      const response = await api.get(`/user/notifications?page=${pageNum}&limit=10`);

      if (response.data === "No unread notifications") {
        if (isLoadMore) {
          setHasMore(false);
        } else {
          setNotifications([]);
        }
        return;
      }

      const newNotifications = response.data.map(notification => ({
        id: notification._id,
        title: notification.title,
        isRead: notification.status === 'read',
        createdAt: notification.createdAt,
        type: notification.type
      }));

      if (isLoadMore) {
        setNotifications(prev => [...prev, ...newNotifications]);
      } else {
        setNotifications(newNotifications);
      }

      if (newNotifications.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Notifications fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/user/notification/${notificationId}/mark-read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/user/notifications/mark-all-read");
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage, true);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (loading && !loadingMore) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm border border-slate-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 mb-6 sticky top-24 z-10 border border-slate-200 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6 text-rose-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No notifications yet</h3>
              <p className="text-slate-500">When you get notifications, they'll show up here.</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}

              {hasMore && (
                <div className="pt-4 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {loadingMore ? (
                      <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Individual Notification Component
const NotificationItem = ({ notification, onMarkAsRead }) => {
  const [isRead, setIsRead] = useState(notification.isRead);

  const handleClick = () => {
    if (!isRead) {
      setIsRead(true);
      onMarkAsRead(notification.id);
    }
  };

  const getIconAndColor = (title) => {
    const t = title.toLowerCase();
    if (t.includes('connection') || t.includes('request')) {
      return { icon: UserPlus, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
    } else if (t.includes('message') || t.includes('chat')) {
      return { icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
    } else if (t.includes('like') || t.includes('reaction')) {
      return { icon: Heart, color: 'text-rose-500 bg-rose-50 border-rose-100' };
    } else if (t.includes('post') || t.includes('update')) {
      return { icon: FileText, color: 'text-violet-600 bg-violet-50 border-violet-100' };
    } else {
      return { icon: Bell, color: 'text-slate-500 bg-slate-50 border-slate-100' };
    }
  };

  const { icon: Icon, color } = getIconAndColor(notification.title);

  return (
    <div
      onClick={handleClick}
      className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer border ${!isRead
        ? 'bg-blue-50/50 border-blue-100 shadow-sm'
        : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
        }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border ${color}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <p className={`text-sm leading-snug ${!isRead ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Actions/Status */}
        <div className="flex flex-col items-end justify-center gap-2 pl-2">
          {!isRead && (
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white shadow-sm"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;