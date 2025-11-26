// Profile.jsx
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setPosts } from "../utils/PostSlice";
import UserPostCard from "./UserPosts";
import toast from "react-hot-toast";

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

  // In Profile.jsx - Update the handleDelete function
const handleDelete = async (id) => {
  try {
    console.log("Attempting to delete post:", id);
    const response = await api.delete(`/user/posts/delete/${id}`);
    console.log("Delete response:", response);
    
    toast.success("Post Deleted Successfully");
    // Update the posts in Redux store
    const updatedPosts = posts.filter((p) => p._id !== id);
    dispatch(setPosts(updatedPosts));
  } catch (error) {
    console.log("Full delete error:", error);
    console.log("Error response:", error.response);
    
    if (error.response?.status === 500) {
      const serverError = error.response.data?.error;
      toast.error(`Server error: ${serverError || "Could not delete post"}`);
    } else if (error.response?.status === 404) {
      toast.error("Post not found");
    } else if (error.response?.status === 403) {
      toast.error("Not authorized to delete this post");
    } else if (error.response?.status === 400) {
      toast.error("Invalid post ID");
    } else {
      toast.error(error.response?.data?.error || "Failed to delete post");
    }
  }
};

  useEffect(() => {
    fetchUser();
    fetchPost();
  }, []);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user.photourl || "/default-avatar.png"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-16 h-16 rounded-full border-4 border-white/20 shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-blue-100">@{user.username}</p>
                {user.domain && (
                  <p className="text-blue-100 font-medium mt-1">{user.domain}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                to="/profile/edit"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 font-medium backdrop-blur-sm"
              >
                Edit Profile
              </Link>
              <Link
                to="/user/createpost"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Posts</span>
                  <span className="font-semibold text-gray-900 text-sm">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Tech Stack</span>
                  <span className="font-semibold text-gray-900 text-sm">{user.techStack?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Experience</span>
                  <span className="font-semibold text-gray-900 text-sm capitalize">{user.experienceLevel}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Tech Stack */}
            {user.techStack && user.techStack.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {user.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Posts Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Posts Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  My Posts {posts.length > 0 && `(${posts.length})`}
                </h2>
              </div>

              {/* Posts Content */}
              <div className="p-6">
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <UserPostCard
                        key={post._id}
                        post={post}
                        onDelete={() => handleDelete(post._id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-6">Share your first post with the community</p>
                    <Link
                      to="/user/createpost"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Your First Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;