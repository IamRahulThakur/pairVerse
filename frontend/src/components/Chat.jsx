import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addUser } from "../utils/userSlice";
import { formatMessageTime } from "../utils/date";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const [toUser, setToUser] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile");
      dispatch(addUser(res.data));
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      // FIX: Correct response structure
      const res = await api.get(`/chat/${targetUserId}`);
      console.log("Chat API Response:", res.data); // Debug log
      
      const chatMessages = res.data.chat?.messages?.map((msg) => {
        return {
          firstName: msg?.senderId?.firstName || "Unknown",
          text: msg?.text,
          istTime: formatMessageTime(msg?.createdAt),
        };
      }) || [];
      
      setToUser(res.data.user);
      setMessages(chatMessages);
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;
    
    const socket = createSocketConnection();
    
    // FIX: Add connection error handling
    socket.on("connect", () => {
      console.log("Connected to socket");
      socket.emit("joinChat", { userId, targetUserId });
    });

    socket.on("messageReceived", ({ firstName, text, senderId, timestamp }) => {
      const istTime = formatMessageTime(timestamp);
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, text, senderId, istTime },
      ]);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white pt-16">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
            {toUser?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Chat with <span className="text-blue-600">{toUser || "User"}</span>
            </h2>
          </div>
        </div>
        <button 
          className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          onClick={() => navigate("/connection")}
        >
          End Chat
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = user?.firstName === msg?.firstName;
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-xs lg:max-w-md ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {msg?.firstName?.[0] || "U"}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${isOwnMessage ? "bg-blue-600 text-white" : "bg-white border border-gray-200"}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                        {msg.istTime}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;