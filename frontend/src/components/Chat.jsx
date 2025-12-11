import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addUser } from "../utils/userSlice";
import { addConnection } from "../utils/connectionSlice";
import { formatMessageTime } from "../utils/date";
import { Send, ArrowLeft, MoreVertical, Phone, Video, Search, MessageSquare } from "lucide-react";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connection);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const [toUser, setToUser] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch current user profile if not available
  const fetchUser = async () => {
    if (user) return;
    try {
      const res = await api.get("/profile");
      dispatch(addUser(res.data));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch connections for sidebar
  const fetchConnections = async () => {
    try {
      const res = await api.get("/user/connections");
      dispatch(addConnection(res.data));
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    }
  };

  const fetchChatMessages = async () => {
    if (!targetUserId) return;
    try {
      setChatLoading(true);
      const res = await api.get(`/chat/${targetUserId}`);

      const chatMessages = res.data.chat?.messages?.map((msg) => {
        return {
          firstName: msg?.senderId?.firstName || "Unknown",
          text: msg?.text,
          istTime: formatMessageTime(msg?.createdAt),
          senderId: msg?.senderId?._id || msg?.senderId,
          createdAt: msg?.createdAt
        };
      }) || [];

      // If the API returns the target user details, set it.
      // Otherwise, we might need to find it from connections or fetch it.
      // Assuming API returns { chat: ..., user: "FirstName" } based on previous code, 
      // but ideally we want the full user object. Let's try to find it in connections first.
      const foundUser = connections?.find(c => c._id === targetUserId);
      if (foundUser) {
        setToUser(foundUser);
      } else {
        // Fallback if not in connections (e.g. from a direct link)
        // You might want to fetch specifics here if standard API doesn't provide it object
        // For now using the name returned by API if string, or just placeholder
        if (typeof res.data.user === 'string') {
          setToUser({ firstName: res.data.user });
        } else {
          setToUser(res.data.user);
        }
      }

      setMessages(chatMessages);
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchConnections();
  }, []);

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId, connections]); // details might update once connections load

  useEffect(() => {
    if (!userId || !targetUserId) return;

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
    if (!newMessage.trim() || !targetUserId) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  const isSidebarVisible = !targetUserId; // On mobile, if no user selected, show sidebar
  const isChatVisible = !!targetUserId; // On mobile, if user selected, show chat

  return (
    <div className="fixed top-16 md:top-20 bottom-0 left-0 right-0 z-0 bg-base-200 flex justify-center p-0 md:p-4 md:mb-4">
      <div className="w-full max-w-7xl h-full bg-white/80 backdrop-blur-xl md:rounded-2xl shadow-xl flex overflow-hidden border border-white/40">

        {/* Sidebar - Connections List */}
        <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-slate-200/60 flex flex-col bg-white/50 ${isSidebarVisible ? 'flex' : 'hidden md:flex'}`}>
          {/* Sidebar Header */}
          <div className="p-4 bg-white/60 border-b border-slate-200/60 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Chats</h2>
              <div className="flex gap-2 text-slate-600">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MessageSquare className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search or start a new chat"
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Connections List */}
          <div className="flex-1 overflow-y-auto">
            {connections && connections.length > 0 ? (
              connections.map((connection) => (
                <div
                  key={connection._id}
                  onClick={() => navigate(`/chat/${connection._id}`)}
                  className={`p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100/50 ${targetUserId === connection._id ? 'bg-indigo-50/60 hover:bg-indigo-50/80' : ''}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 overflow-hidden">
                      <img src={connection.photourl || "https://geographyandyou.com/images/user-profile.png"} alt={connection.firstName} className="w-full h-full object-cover" />
                    </div>
                    {/* Online Status Dot - Mocked for now */}
                    {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`font-semibold md:text-base text-sm truncate ${targetUserId === connection._id ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {connection.firstName} {connection.lastName}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">10:30 AM</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{connection.domain || "Available"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p>No connections yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-slate-50/30 relative ${isChatVisible ? 'flex inset-0 z-20 md:static' : 'hidden md:flex'}`}>
          {targetUserId ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 bg-white/60 border-b border-slate-200/60 flex items-center justify-between backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/chat')} className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    <img src={toUser?.photourl || "https://geographyandyou.com/images/user-profile.png"} alt={toUser?.firstName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{toUser?.firstName || "User"} {toUser?.lastName}</h3>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-600">
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-20">
                {chatLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-10 h-10 text-indigo-300" />
                    </div>
                    <p>Say hello to start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isOwnMessage = user?._id === msg.senderId || user?.firstName === msg.firstName;
                    // Checking ID is safer, but fallback to name if ID logic in backend is weird as per existing code struggles
                    return (
                      <div key={index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2 rounded-2xl shadow-sm relative group ${isOwnMessage
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                            }`}>
                            <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <div className={`text-[10px] mt-1 flex items-center gap-1 ${isOwnMessage ? 'text-indigo-200 justify-end' : 'text-slate-400'}`}>
                              {msg.istTime}
                              {isOwnMessage && <span className="ml-1">✓✓</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-4 bg-white/60 border-t border-slate-200/60 backdrop-blur-md">
                <div className="flex items-center gap-2 md:gap-4 max-w-4xl mx-auto">
                  <div className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400 text-sm md:text-base"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50/50">
              <div className="w-64 h-64 opacity-20 mb-8 pointer-events-none select-none">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/online-chat-illustration-download-in-svg-png-gif-file-formats--chatting-application-app-communication-conversation-customer-service-pack-business-illustrations-3329683.png" alt="Select chat" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to PairVerse Chat</h2>
              <p className="text-slate-500 max-w-md">Select a conversation from the sidebar to start messaging. Connect with your peers and collaborate!</p>
              <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
                <MessageSquare className="w-4 h-4" /> End-to-end encrypted
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Chat;