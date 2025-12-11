import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setPosts } from "../utils/PostSlice";
import UserPostCard from "./UserPosts";
import toast from "react-hot-toast";
import {
  Briefcase,
  Code,
  Edit3,
  PlusSquare,
  Grid,
  Layers,
  MapPin,
  Calendar,
  Settings
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
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 group">
        {/* Cover Image */}
        <div className="h-56 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-slate-900/40"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl p-1 bg-white shadow-lg">
                <img
                  src={user.photourl || "https://placeimg.com/150/150/people"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full rounded-xl object-cover bg-slate-100"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                {user.firstName} {user.lastName}
                <span className="text-sm font-normal px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  @{user.username}
                </span>
              </h1>
              <p className="text-slate-500 mt-2 flex flex-wrap items-center gap-4 text-sm font-medium">
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
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-2 w-full md:w-auto">
              <Link
                to="/profile/edit"
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
              <Link
                to="/user/createpost"
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <PlusSquare className="w-4 h-4" />
                Create Post
              </Link>
            </div>
          </div>

          {/* Bio & Tech Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-100 pt-8">
            <div className="lg:col-span-2 space-y-8">
              {user.bio && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">About</h3>
                  <p className="text-slate-600 leading-relaxed max-w-2xl">{user.bio}</p>
                </div>
              )}

              {user.techStack && user.techStack.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Grid className="w-5 h-5 text-indigo-600" />
                  Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-100">
                    <span className="text-slate-500 font-medium text-sm">Posts</span>
                    <span className="font-bold text-slate-900">{posts.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-100">
                    <span className="text-slate-500 font-medium text-sm">Connections</span>
                    <span className="font-bold text-slate-900">0</span>
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
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
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
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No posts yet</h3>
            <p className="text-slate-500 mb-6">Share your first post with the community</p>
            <Link
              to="/user/createpost"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              <PlusSquare className="w-4 h-4" />
              Create Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;