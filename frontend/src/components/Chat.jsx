import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, MessageSquareMore, Search, Send } from "lucide-react";
import { api } from "../utils/api";
import { createSocketConnection } from "../utils/socket";
import { addUser } from "../utils/userSlice";
import { addConnection } from "../utils/connectionSlice";
import { formatDateTime } from "../utils/formatters";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const connectionsState = useSelector((store) => store.connection);
  const connections = useMemo(() => connectionsState || [], [connectionsState]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = user?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [connectionSearch, setConnectionSearch] = useState("");
  const [targetProfile, setTargetProfile] = useState(null);

  const filteredConnections = useMemo(() => {
    const query = connectionSearch.trim().toLowerCase();
    if (!query) return connections;

    return connections.filter((connection) => {
      const haystack = [
        connection.firstName,
        connection.lastName,
        connection.domain,
        ...(connection.techStack || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [connectionSearch, connections]);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;

      try {
        const response = await api.get("/profile");
        dispatch(addUser(response.data));
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchUser();
  }, [dispatch, user]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setConnectionsLoading(true);
        const response = await api.get("/user/connections");
        dispatch(addConnection(response.data || []));
      } catch (error) {
        console.error("Connections fetch error:", error);
      } finally {
        setConnectionsLoading(false);
      }
    };

    fetchConnections();
  }, [dispatch]);

  useEffect(() => {
    if (!targetUserId) {
      setMessages([]);
      setTargetProfile(null);
      return;
    }

    const fetchChat = async () => {
      try {
        setChatLoading(true);
        const response = await api.get(`/chat/${targetUserId}`);
        const rawMessages = response.data.chat?.messages || [];
        const selectedConnection = connections.find((connection) => connection._id === targetUserId);

        setMessages(
          rawMessages.map((message) => ({
            _id: message._id || `${message.senderId}-${message.createdAt}`,
            text: message.text,
            senderId: message.senderId?._id || message.senderId,
            senderName:
              message.senderId?.firstName ||
              (String(message.senderId?._id || message.senderId) === String(userId)
                ? user?.firstName
                : response.data.user),
            createdAt: message.createdAt,
          }))
        );

        setTargetProfile(
          selectedConnection || {
            _id: targetUserId,
            firstName: response.data.user || "Collaborator",
          }
        );
      } catch (error) {
        console.error("Chat fetch error:", error);
      } finally {
        setChatLoading(false);
      }
    };

    fetchChat();
  }, [connections, targetUserId, user?.firstName, userId]);

  useEffect(() => {
    if (!userId) return undefined;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on("messageReceived", ({ firstName, text, senderId, _id, timestamp }) => {
      setMessages((current) => [
        ...current,
        {
          _id: _id || `${senderId}-${timestamp}`,
          text,
          senderId,
          senderName: firstName,
          createdAt: timestamp,
        },
      ]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  useEffect(() => {
    if (socketRef.current && targetUserId) {
      socketRef.current.emit("joinChat", { targetUserId });
    }
  }, [targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!socketRef.current || !targetUserId || !newMessage.trim() || !user) return;

    socketRef.current.emit("sendMessage", {
      targetUserId,
      text: newMessage.trim(),
      firstName: user.firstName,
    });
    setNewMessage("");
  };

  const activeProfile =
    targetProfile || connections.find((connection) => connection._id === targetUserId) || null;
  const showSidebar = !targetUserId;

  return (
    <div className="h-[calc(100vh-7.8rem)] lg:h-[calc(100vh-8.4rem)]">
      <div className="grid h-full gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside
        className={`glass-panel-strong h-full min-h-0 rounded-[32px] p-4 ${
          showSidebar ? "flex flex-col" : "hidden xl:flex xl:flex-col"
        }`}
      >
        <div className="rounded-[28px] bg-[#fffdf8] px-4 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Inbox
          </p>
          <h1 className="display-font mt-2 text-2xl font-bold text-slate-900">Messages</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Continue conversations with accepted collaborators.
          </p>
        </div>

        <div className="field-shell mt-4 flex items-center gap-3 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={connectionSearch}
            onChange={(event) => setConnectionSearch(event.target.value)}
            placeholder="Search collaborators"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {connectionsLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[24px] bg-white/70 px-4 py-4"
              >
                <div className="h-4 w-1/2 rounded-full bg-slate-200" />
                <div className="mt-3 h-3 w-4/5 rounded-full bg-slate-200" />
              </div>
            ))
          ) : filteredConnections.length > 0 ? (
            filteredConnections.map((connection) => {
              const active = targetUserId === connection._id;

              return (
                <button
                  key={connection._id}
                  type="button"
                  onClick={() => navigate(`/chat/${connection._id}`)}
                  className={`w-full rounded-[24px] px-4 py-4 text-left transition ${
                    active
                      ? "bg-[#245b76] text-white"
                      : "bg-white/70 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={connection.photourl || "https://placehold.co/80x80/f4ede2/1f2937?text=PV"}
                      alt={connection.firstName}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {connection.firstName} {connection.lastName}
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          active ? "text-[#d8ebe7]" : "text-slate-500"
                        }`}
                      >
                        {connection.domain || "Ready to collaborate"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#e1d5c5] bg-[#faf6ee] px-4 py-6 text-sm text-slate-500">
              No collaborators match that search.
            </div>
          )}
        </div>
      </aside>

      <section
        className={`glass-panel-strong h-full min-h-0 flex-col overflow-hidden rounded-[32px] ${
          targetUserId ? "flex" : "hidden xl:flex"
        }`}
      >
        {targetUserId ? (
          <>
            <header className="border-b border-[#efe5d6] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-[#f5efe4] xl:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <img
                  src={
                    activeProfile?.photourl ||
                    "https://placehold.co/80x80/f4ede2/1f2937?text=PV"
                  }
                  alt={activeProfile?.firstName || "Collaborator"}
                  className="h-12 w-12 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {activeProfile?.firstName} {activeProfile?.lastName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeProfile?.domain || "Accepted collaborator"}
                  </p>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-[#fbf7ef] px-4 py-5 sm:px-6">
              {chatLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#c8dad6] border-t-[#1f6f78]" />
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = String(message.senderId) === String(userId);

                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-[24px] px-4 py-3 ${
                            isOwnMessage
                              ? "bg-[#245b76] text-white"
                              : "bg-white text-slate-800 ring-1 ring-black/5"
                          }`}
                        >
                          {!isOwnMessage && (
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                              {message.senderName || activeProfile?.firstName}
                            </p>
                          )}
                          <p className="text-sm leading-7 whitespace-pre-wrap">{message.text}</p>
                          <p
                            className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                              isOwnMessage ? "text-[#d9edf6]" : "text-slate-400"
                            }`}
                            title={formatDateTime(message.createdAt)}
                          >
                            {formatDateTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
                    <MessageSquareMore className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    Start the conversation
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">
                    You are connected now. Use this chat to move from discovery into real
                    collaboration.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-[#efe5d6] px-4 py-4 sm:px-6">
              <div className="field-shell flex items-end gap-3 px-4 py-3">
                <textarea
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Share context, ask for help, or kick off a build plan..."
                  className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="rounded-full bg-[#245b76] p-3 text-white transition hover:bg-[#1d4f66] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-8 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
              <MessageSquareMore className="h-8 w-8" />
            </div>
            <h2 className="display-font mt-5 text-3xl font-bold text-slate-900">
              Pick a collaborator to start chatting
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
              The inbox is now framed around collaborators you have already accepted. This will
              carry forward cleanly when your project-based workflows arrive.
            </p>
          </div>
        )}
      </section>
      </div>
    </div>
  );
};

export default Chat;
