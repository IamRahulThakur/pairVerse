const FeedCard = ({ feed }) => {
  const { userId } = feed;

  return (
    <div className="card bg-base-100 w-full max-w-md mx-auto shadow-sm mb-4 rounded-lg">
      <div className="card-body p-4">

        {/* User Info */}
        <div className="flex items-center gap-3 mb-2">
          <img
            src={userId.photourl}
            alt={userId.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-sm sm:text-base">
              {userId.firstName} {userId.lastName}
            </h3>
            <p className="text-xs text-gray-500">
              {new Date(feed.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Feed Title & Content */}
        <h2 className="card-title text-base sm:text-lg">{feed.title}</h2>
        <p className="text-sm sm:text-base">{feed.content}</p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {userId.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="badge badge-outline text-xs sm:text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="card-actions justify-between mt-3 flex-wrap gap-2">
          <a
            href={userId.Github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm w-full sm:w-auto"
          >
            GitHub
          </a>
          <a
            href={userId.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-info w-full sm:w-auto"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
