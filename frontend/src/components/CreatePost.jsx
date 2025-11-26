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
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Please log in to create posts
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary"
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
            className="flex items-center text-base-content/60 hover:text-primary transition-colors mb-2 group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create New Post
          </h1>
          <p className="text-base-content/60 mt-1">Share your thoughts and moments</p>
        </div>
      </div>

      {/* Create Post Form */}
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={user.photourl || "https://placeimg.com/80/80/people"}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-base-content/10"
            />
            <div>
              <p className="font-semibold text-base-content">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-base-content/60">Posting to Public</p>
            </div>
          </div>

          {/* Content Input */}
          <div className="relative">
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              maxLength={500}
              rows={4}
              placeholder="What's on your mind?"
              className="w-full bg-base-content/5 border border-base-content/10 rounded-xl p-4 text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-base-content/40">
              {charCount}/500
            </div>
          </div>

          {/* Media Upload Section */}
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-3">
              Media ({previewUrls.length}/5)
            </label>

            {/* Media Previews Grid */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {previewUrls.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    {preview.type === 'video' ? (
                      <video
                        src={preview.url}
                        className="w-full h-full object-cover rounded-xl border border-base-content/10"
                      />
                    ) : (
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl border border-base-content/10"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 bg-error text-white p-1 rounded-full hover:bg-error/90 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            {previewUrls.length < 5 && (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-base-content/20 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-base-content/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 text-base-content/40 group-hover:text-primary" />
                </div>
                <p className="text-base-content/80 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-base-content/50">
                  Images and videos up to 50MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              className="hidden"
            />
          </div>

          {/* Post Features */}
          <div className="flex items-center justify-between p-4 bg-base-content/5 rounded-xl">
            <span className="text-sm text-base-content/60 font-medium">Add to your post</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors"
                title="Add media"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors"
                title="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                title="Add location"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-base-content/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!formData.content && mediaFiles.length === 0)}
              className="btn-primary min-w-[140px] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post
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