import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addUser } from "../utils/userSlice";
import { formatMessageTime } from "../utils/date";
import { Send, ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";

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
      const res = await api.get(`/chat/${targetUserId}`);

      const chatMessages = res.data.chat?.messages?.map((msg) => {
        return {
          firstName: msg?.senderId?.firstName || "Unknown",
          text: msg?.text,
          istTime: formatMessageTime(msg?.createdAt),
          senderId: msg?.senderId?._id || msg?.senderId // Handle both populated and unpopulated senderId
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

    socket.on("connect", () => {
      socket.emit("joinChat", { userId, targetUserId });
    });

    socket.on("messageReceived", ({ firstName, text, senderId, timestamp }) => {
      const istTime = formatMessageTime(timestamp);
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, text, senderId, istTime },
      ]);
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

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="fixed top-20 bottom-4 left-0 right-0 px-4 flex justify-center z-0">
      <div className="w-full max-w-5xl h-full glass-card flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-base-content/5 flex justify-between items-center bg-base-100/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-base-content/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-base-content/70" />
            </button>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center text-base-content font-bold">
                  {toUser?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
            </div>

            <div>
              <h2 className="font-bold text-base-content text-sm md:text-base">
                {toUser || "User"}
              </h2>
              <p className="text-xs text-success font-medium">Online</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-base-content/5 rounded-full text-base-content/60 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-base-content/5 rounded-full text-base-content/60 transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-base-content/5 rounded-full text-base-content/60 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-base-content/40">
              <div className="w-16 h-16 bg-base-content/5 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 opacity-50" />
              </div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = user?.firstName === msg?.firstName;
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[80%] md:max-w-[60%] ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                    {!isOwnMessage && (
                      <div className="w-8 h-8 rounded-full bg-base-content/10 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-auto">
                        {msg?.firstName?.[0] || "U"}
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm ${isOwnMessage
                        ? "bg-primary text-primary-content rounded-br-none"
                        : "bg-base-200 text-base-content rounded-bl-none"
                        }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right opacity-70`}>
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

        {/* Input Box */}
        <div className="p-4 border-t border-base-content/5 bg-base-100/50 backdrop-blur-md">
          <div className="flex gap-2 items-center bg-base-content/5 rounded-full px-2 py-2 border border-base-content/5 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-4 py-2 outline-none text-base-content placeholder:text-base-content/40 min-w-0"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="p-3 bg-primary text-primary-content rounded-full hover:bg-primary-focus transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20"
              onClick={handleSend}
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;