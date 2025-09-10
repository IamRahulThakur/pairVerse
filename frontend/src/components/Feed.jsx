import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import FeedCard from "./FeedCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      if (feed) return;
      const response = await api.get("/user/posts/feed");
      dispatch(addFeed(response.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    feed && (
      < div className="flex flex-col items-center mt-6">
        {feed.map((post) => (
          <FeedCard key={post._id} feed={post} />
        ))}
      </div>
    )
  );
};

export default Feed;
