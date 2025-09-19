import { useDispatch, useSelector } from "react-redux";
import { api } from "../utils/api";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import FeedCard from "./FeedCard";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const fetchUser = async () => {
      try {
        const res = await api.get("/profile");
        dispatch(addUser(res.data));
      } catch (error) {
        if (error.status === 401) {
          Navigate("/login");
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    };

  const getFeed = async () => {
    try {
      const response = await api.get("/user/posts/feed");
      dispatch(addFeed(response.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  useEffect(() => {
    fetchUser();
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
