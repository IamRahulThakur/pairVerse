import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setPosts } from "../utils/PostSlice";
import UserPostCard from "./UserPosts";
import toast from "react-hot-toast";
import {
  MapPin,
  Briefcase,
  Code,
  Edit3,
  PlusSquare,
  Grid,
  Layers,
  Calendar
} from "lucide-react";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const posts = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/posts/delete/${id}`);
      toast.success("Post Deleted Successfully");
      const updatedPosts = posts.filter((p) => p._id !== id);
      dispatch(setPosts(updatedPosts));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete post");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPost();
  }, []);

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="glass-card overflow-hidden mb-8 group">
        {/* Cover Image */}
        <div className="h-56 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 animate-gradient-xy"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl p-1 glass">
                <img
                  src={user.photourl || "https://placeimg.com/150/150/people"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
            </div>

            {/* Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                {user.firstName} {user.lastName}
                <span className="text-sm font-normal px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  @{user.username}
                </span>
              </h1>
              <p className="text-base-content/60 mt-1 flex items-center gap-4">
                {user.domain && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {user.domain}
                  </span>
                )}
                {user.experienceLevel && (
                  <span className="flex items-center gap-1.5 capitalize">
                    <Layers className="w-4 h-4" />
                    {user.experienceLevel}
                  </span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-2">
              <Link
                to="/profile/edit"
                className="btn-ghost border border-base-content/10 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Link>
              <Link
                to="/user/createpost"
                className="btn-primary flex items-center gap-2"
              >
                <PlusSquare className="w-4 h-4" />
                Create Post
              </Link>
            </div>
          </div>

          {/* Bio & Tech Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-base-content/5 pt-8">
            <div className="lg:col-span-2 space-y-6">
              {user.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-base-content mb-2">About</h3>
                  <p className="text-base-content/70 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {user.techStack && user.techStack.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-base-content mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-secondary" />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-base-content/5 text-base-content/80 text-sm font-medium border border-base-content/5 hover:border-primary/30 hover:text-primary transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="glass p-6 rounded-2xl space-y-6 border border-white/50 shadow-sm">
                <h3 className="font-bold text-base-content text-lg flex items-center gap-2">
                  <Grid className="w-5 h-5 text-primary" />
                  Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 hover:bg-white transition-colors">
                    <span className="text-base-content/60 font-medium">Posts</span>
                    <span className="font-bold text-base-content text-lg">{posts.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 hover:bg-white transition-colors">
                    <span className="text-base-content/60 font-medium">Connections</span>
                    <span className="font-bold text-base-content text-lg">0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 hover:bg-white transition-colors">
                    <span className="text-base-content/60 font-medium">Joined</span>
                    <span className="font-bold text-base-content text-sm">
                      {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
            <Grid className="w-5 h-5" />
            My Posts
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <UserPostCard
                key={post._id}
                post={post}
                onDelete={() => handleDelete(post._id)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center border-dashed border-2 border-base-content/10">
            <div className="w-16 h-16 bg-base-content/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusSquare className="w-8 h-8 text-base-content/40" />
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-2">No posts yet</h3>
            <p className="text-base-content/50 mb-6">Share your first post with the community</p>
            <Link
              to="/user/createpost"
              className="btn-primary inline-flex items-center gap-2"
            >
              Create Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;