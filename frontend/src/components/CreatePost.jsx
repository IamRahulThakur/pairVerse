import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Image as ImageIcon,
  Smile,
  MapPin,
  X,
  UploadCloud,
  Send
} from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    content: "",
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "content") {
      setCharCount(value.length);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    if (mediaFiles.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        invalidFiles.push(file.name);
        return;
      }

      const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (too large)`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      const newMediaFiles = [...mediaFiles, ...validFiles];
      setMediaFiles(newMediaFiles);

      const newPreviewUrls = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        name: file.name
      }));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMedia = (index) => {
    const newMediaFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setMediaFiles(newMediaFiles);
    setPreviewUrls(newPreviewUrls);

    URL.revokeObjectURL(previewUrls[index].url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content && mediaFiles.length === 0) {
      toast.error("Post must have content or media");
      return;
    }

    if (formData.content.length > 500) {
      toast.error("Content must be less than 500 characters");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();

      if (formData.content) submitData.append("content", formData.content);

      mediaFiles.forEach(file => {
        submitData.append("media", file);
      });

      await api.post("/user/posts/create", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!");

      setFormData({ content: "" });
      setMediaFiles([]);
      previewUrls.forEach(preview => URL.revokeObjectURL(preview.url));
      setPreviewUrls([]);
      setCharCount(0);

      setTimeout(() => {
        navigate("/profile");
      }, 100);

    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.error || "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleMediaChange({ target: { files } });
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Please log in to create posts
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-2 group text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create Post
          </h1>
          <p className="text-slate-500 mt-1">Share your thoughts and moments with the community</p>
        </div>
      </div>

      {/* Create Post Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          {/* Editor Area */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.photourl || "https://placeimg.com/80/80/people"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="font-semibold text-slate-900 text-sm">{user.firstName} {user.lastName}</p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Public</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                maxLength={500}
                rows={5}
                placeholder="What's on your mind?"
                className="w-full bg-transparent border-none p-0 text-lg text-slate-800 placeholder:text-slate-400 focus:ring-0 focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex justify-end mt-2">
                <span className={`text-xs font-medium ${charCount > 450 ? 'text-amber-500' : 'text-slate-300'}`}>
                  {charCount}/500
                </span>
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div
            className="p-6 bg-slate-50 relative transition-colors hover:bg-slate-100/50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Media Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {previewUrls.map((preview, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                    {preview.type === 'video' ? (
                      <video
                        src={preview.url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 bg-white/90 text-rose-500 p-1.5 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm transform scale-90 group-hover:scale-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload/Features Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-500 mr-2">Add to post:</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                  title="Add photos/videos"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"
                  title="Add feeling/activity"
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Add location"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drag Drop Overlay (hidden input) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="p-4 bg-white flex justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!formData.content && mediaFiles.length === 0)}
              className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Post</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;