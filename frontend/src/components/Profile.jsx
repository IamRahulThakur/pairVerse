import { useSelector, useDispatch } from "react-redux";
import ProfileCard from "./ProfileCard";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setPosts } from "../utils/PostSlice";
import UserPostCard from "./UserPosts";
import toast , { Toaster }  from "react-hot-toast";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const posts = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile");
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchPost = async () => {
    try {
      const res = await api.get("/user/posts");
      dispatch(setPosts(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`user/posts/delete/${id}`);
      toast.success("Post Deleted Successfully");
      dispatch(setPosts(posts.filter((p) => p._id !== id)));
      navigate('/profile');
    }
    catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchPost();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar (Profile Info) */}
      <div className="lg:col-span-1 mt-16">
        <ProfileCard user={user} />
      </div>

      {/* Right Section (Tabs / Feed) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Tabs like LinkedIn */}
        <div role="tablist" className="tabs tabs-bordered">
          <Link to="/user/createpost" role="tab" className="tab tab-active">
            Post
          </Link>
          <a role="tab" className="tab">
            Projects
          </a>
          <a role="tab" className="tab">
            Connections
          </a>
          <a role="tab" className="tab">
            About
          </a>
        </div>
        {/* Example posts section */}
        {posts.length > 0 && (
          <div className="flex flex-col items-center mt-6">
            {posts.map((post) => (
              <UserPostCard 
              key={post._id} 
              post={post} 
              onDelete={() => handleDelete(post._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
