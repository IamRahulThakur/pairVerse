import { Link, useNavigate } from "react-router-dom";

const ConnectionCard = ({ user }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.photourl || "/default-avatar.png"}
          alt={`${user.firstName} ${user.lastName}`}
          className="cursor-pointer w-20 h-20 rounded-full object-cover border-2 border-gray-300 mb-4"
          onClick={() => navigate(`/profile/${user._id}`)}/>
        <h3 className="cursor-pointer font-semibold text-gray-900 text-lg mb-1"
          onClick={() => navigate(`/profile/${user._id}`)}>
          {user.firstName} {user.lastName}
        </h3>
        <Link 
          to={"/chat/" + user._id}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-200 text-center"
        >
          Chat
        </Link>
      </div>
    </div>
  );
};

export default ConnectionCard;