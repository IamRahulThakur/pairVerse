import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addUser } from "../utils/userSlice";
import { formatMessageTime } from "../utils/date";

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile");
      dispatch(addUser(res.data));
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchTargetUser = async () => {
    try {
      const res = await api.get(`/user/${targetUserId}`);
      setTargetUser(res.data);
    } catch (error) {
      console.log("Error fetching target user:", error.message);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const chat = await api.get(`/chat/${targetUserId}`);
      const chatMessages =
        chat?.data?.messages?.map((msg) => {
          return {
            firstName: msg?.senderId.firstName,
            text: msg?.text,
            istTime: formatMessageTime(msg?.createdAt),
            senderId: msg?.senderId._id,
          };
        }) || [];

      setMessages(chatMessages);
    } catch (error) {
      console.log("Error fetching messages:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTargetUser();
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;
    
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text, senderId, timestamp }) => {
      const istTime = formatMessageTime(timestamp);
      setMessages((prev) => [
        ...prev,
        { firstName, text, senderId, istTime },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage.trim(),
    });
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndChat = () => {
      navigate(-1);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="text-center">
          <div className="text-lg text-error mb-2">User not found</div>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base-100">
      {/* Chat Header */}
      <div className="bg-base-100 border-b border-base-300 px-4 py-3 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleGoBack}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="avatar">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold">
                {targetUser?.firstName?.charAt(0) || targetUserId?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            
            <div className="flex flex-col">
              <h2 className="font-semibold text-base-content">
                {targetUser?.firstName ? targetUser?.firstName : 'User'}
              </h2>
              <p className="text-xs text-base-content/60">
                {targetUser?.online ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    Online
                  </span>
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </div>

          <button 
            className="btn btn-sm btn-outline btn-error"
            onClick={handleEndChat}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End Chat
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto bg-base-200">
        <div className="max-w-4xl mx-auto p-4 space-y-4 min-h-full pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-base-content/60 mb-2">No messages yet</p>
              <p className="text-sm text-base-content/40">Start a conversation by sending a message!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = userId === msg.senderId;
              const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
              
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} group`}
                >
                  <div className={`flex gap-2 max-w-[70%] ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                    
                    
                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
                      {!isOwnMessage && showAvatar && (
                        <div className="text-xs font-medium text-base-content/70 mb-1 px-2">
                          {msg.firstName}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage 
                            ? "bg-primary text-primary-content rounded-br-md" 
                            : "bg-base-100 border border-base-300 rounded-bl-md"
                        } shadow-sm`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                      <div className={`text-xs text-base-content/50 mt-1 px-2 ${isOwnMessage ? "text-right" : "text-left"}`}>
                        {msg.istTime}
                      </div>
                    </div>
                    
                    {/* Spacer for own messages */}
                    {isOwnMessage && <div className="w-8 flex-shrink-0"></div>}
                  </div>
                </div>
              );
            })
          )}
          {/* Scroll marker */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-base-300 bg-base-100 p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="input input-bordered w-full pr-12 focus:outline-none focus:border-primary"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
            />
            {newMessage.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-base-content/40">
                {newMessage.length}/500
              </div>
            )}
          </div>
          <button 
            className="btn btn-primary px-6 disabled:btn-ghost"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;