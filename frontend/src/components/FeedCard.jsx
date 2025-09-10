const FeedCard = ({ feed }) => {
  const { userId } = feed;

  return (
    <div className="card bg-base-100 w-96 shadow-sm mb-4">
      <div className="card-body">

        <div className="flex items-center gap-3 mb-2">
          <img
            src={userId.photourl}
            alt={userId.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">
              {userId.firstName} {userId.lastName}
            </h3>
            <p className="text-xs text-gray-500">
              {new Date(feed.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h2 className="card-title">{feed.title}</h2>
        <p>{feed.content}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {userId.techStack.map((tech, idx) => (
            <span key={idx} className="badge badge-outline">
              {tech}
            </span>
          ))}
        </div>

        <div className="card-actions justify-between mt-3">
          <a
            href={userId.Github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
          >
            GitHub
          </a>
          <a
            href={userId.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-info"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
