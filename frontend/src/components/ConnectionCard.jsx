import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, User } from "lucide-react";

const ConnectionCard = ({ user }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="glass-card p-6 flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-300">
      <div className="relative mb-4 cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
        <div className="w-24 h-24 rounded-full p-1 glass group-hover:bg-primary/10 transition-colors">
          <img
            src={user.photourl || "https://placeimg.com/100/100/people"}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
      </div>

      <h3
        className="font-bold text-lg text-base-content mb-1 cursor-pointer hover:text-primary transition-colors"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        {user.firstName} {user.lastName}
      </h3>

      <p className="text-base-content/60 text-sm mb-6 line-clamp-1">
        {user.domain || "Developer"}
      </p>

      <div className="flex gap-2 w-full">
        <button
          onClick={() => navigate(`/profile/${user._id}`)}
          className="flex-1 btn-ghost text-sm py-2 px-3 border border-base-content/10"
        >
          Profile
        </button>
        <Link
          to={"/chat/" + user._id}
          className="flex-1 btn-primary text-sm py-2 px-3 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </Link>
      </div>
    </div>
  );
};

export default ConnectionCard;