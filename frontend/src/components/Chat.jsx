import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const messagesEndRef = useRef(null); 

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile");
      dispatch(addUser(res.data));
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchChatMessages = async () => {
    const chat = await api.get(`/chat/${targetUserId}`);

    const chatMessages =
      chat?.data?.messages?.map((msg) => {
        return {
          firstName: msg?.senderId.firstName,
          text: msg?.text,
          istTime: formatMessageTime(msg?.createdAt),
        };
      }) || [];

    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchUser();
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();

    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text, senderId, timestamp }) => {
      const istTime = formatMessageTime(timestamp);
    
      setMessages((messages) => [
        ...messages,
        { firstName, text, senderId, istTime },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // 👇 Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
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
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-base-200">
      {/* Chat Header */}
      <div className="bg-base-100 border-b border-base-300 p-4 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
              <span>{targetUserId?.charAt(0)?.toUpperCase()}</span>
            </div>
          </div>
          Chat with <span className="text-primary">{messages[0]?.firstName}</span>
        </h2>
        <button className="btn btn-sm btn-outline btn-error">End Chat</button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-base-200">
        {messages?.map((msg, index) => {
          const isOwnMessage = user?.firstName === msg?.firstName;
          return (
            <div
              key={index}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-8 rounded-full bg-neutral-focus text-neutral-content flex items-center justify-center">
                  <span className="text-xs">{msg?.firstName?.[0]}</span>
                </div>
              </div>
              <div className="chat-header flex items-center gap-2">
                <span className="font-medium">{msg.firstName}</span>
                <time className="text-xs opacity-50">{msg.istTime}</time>
              </div>
              <div
                className={`chat-bubble ${
                  isOwnMessage ? "chat-bubble-primary" : "chat-bubble-secondary"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {/* 👇 invisible marker for scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-base-300 bg-base-100 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="input input-bordered flex-1 focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
