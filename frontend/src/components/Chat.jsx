import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addUser } from "../utils/userSlice";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();

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
        const istTime = new Date(msg?.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return {
          firstName: msg?.senderId.firstName,
          text: msg?.text,
          timestamp: istTime,
        };
      }) || []; // ✅ fallback to empty array

    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchUser();
    fetchChatMessages();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (!userId) return;
    // 1. Here we are creating socket connection with backend just like we used to make axois connection
    const socket = createSocketConnection();

    // 2. After making socket connection we are emiting event joinChat in backend we are listening to event name joinChat on listeing we are creating room with roomId to person can only and we are making this person join that room socket.join(roomId) in backend
    socket.emit("joinChat", { userId, targetUserId });

    // Here we are Listening event from backend whenever data is coming into this event them we are setting that data into setMessages
    socket.on("messageReceived", ({ firstName, text, senderId, timestamp }) => {
      // UTC time ko ist time m convert kar rahe hai
      const istTime = new Date(timestamp).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      console.log(firstName, text, istTime);

      setMessages((messages) => [
        ...messages,
        { firstName, text, senderId, istTime },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const handleSend = () => {
    const socket = createSocketConnection();
    // On clicking send button we are sending event name sendMessage and we are sending messang inside that event so in backend server must be listening to that event
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col h-screen bg-base-200">
      {/* Chat Header */}
      <div className="bg-base-100 border-b border-base-300 p-4 flex     justify-between items-center">
        <h2 className="text-lg font-bold">Chat with {targetUserId}</h2>
        <button className="btn btn-sm btn-outline btn-error">End Chat</button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-scroll p-5">
        {messages?.map((msg, index) => {
          return (
            <div
              key={index}
              className={`chat ${
                user?.firstName === msg?.firstName ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-header">
                {msg.firstName}
                <time className="text-xs opacity-50">{msg.istTime} </time>
              </div>
              <div className="chat-bubble">{msg.text} </div>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-base-300 bg-base-100 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="input input-bordered flex-1"
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
