// Notifications.jsx
import React, { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";

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

      const newNotifications = response.data.map((title, index) => ({
        id: `notification-${pageNum}-${index}`,
        title,
        isRead: false
      }));

      if (isLoadMore) {
        setNotifications(prev => [...prev, ...newNotifications]);
      } else {
        setNotifications(newNotifications);
      }

      // Check if we have more notifications to load
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
      // Update local state
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
      // Update all notifications to read
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
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Mark All as Read
              </button>
            )}
          </div>
          
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! Check back later for new notifications.</p>
            </div>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  isLast={index === notifications.length - 1}
                />
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="p-4 border-t border-gray-100 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        Loading...
                      </div>
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
const NotificationItem = ({ notification, onMarkAsRead, isLast }) => {
  const [isRead, setIsRead] = useState(notification.isRead);

  const handleClick = () => {
    if (!isRead) {
      setIsRead(true);
      onMarkAsRead(notification.id);
    }
  };

  const getNotificationIcon = (title) => {
    if (title.toLowerCase().includes('connection') || title.toLowerCase().includes('request')) {
      return "🤝";
    } else if (title.toLowerCase().includes('message') || title.toLowerCase().includes('chat')) {
      return "💬";
    } else if (title.toLowerCase().includes('like') || title.toLowerCase().includes('reaction')) {
      return "❤️";
    } else if (title.toLowerCase().includes('post') || title.toLowerCase().includes('update')) {
      return "📝";
    } else {
      return "🔔";
    }
  };

  const getNotificationType = (title) => {
    if (title.toLowerCase().includes('accepted')) return 'success';
    if (title.toLowerCase().includes('rejected') || title.toLowerCase().includes('declined')) return 'error';
    return 'info';
  };

  const type = getNotificationType(notification.title);

  return (
    <div
      className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
        !isLast ? 'border-b border-gray-100' : ''
      } ${!isRead ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      {/* Notification Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
        type === 'success' ? 'bg-green-100 text-green-600' :
        type === 'error' ? 'bg-red-100 text-red-600' :
        'bg-blue-100 text-blue-600'
      }`}>
        {getNotificationIcon(notification.title)}
      </div>

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${!isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Unread Indicator */}
      {!isRead && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default Notifications;