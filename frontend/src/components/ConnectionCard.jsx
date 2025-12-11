import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, User } from "lucide-react";

const ConnectionCard = ({ user }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200/60 p-4 flex items-center gap-4 hover:bg-slate-50/80 transition-all duration-300 cursor-pointer" onClick={() => navigate(`/chat/${user._id}`)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-indigo-500 to-violet-500">
          <img
            src={user.photourl || "https://geographyandyou.com/images/user-profile.png"} // Fallback image
            alt="user"
            className="w-full h-full rounded-full object-cover border-2 border-white"
          />
        </div>
        {/* Online indicator placeholder if needed */}
        {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div> */}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-base font-semibold text-slate-800 truncate">
            {user.firstName} {user.lastName}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500 truncate">
          <p className="truncate w-full">{user.domain || "Hey there! I am using PairVerse."}</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;