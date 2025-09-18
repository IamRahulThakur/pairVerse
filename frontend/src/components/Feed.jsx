import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import FeedCard from "./FeedCard";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const getFeed = async () => {
    if(!user) return Navigate("/login");
    try {
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
