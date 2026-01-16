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
  Send,
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CreatePost = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const fileInputRef = useRef(null);

  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]); // SOURCE OF TRUTH
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ===============================
  // TEXT INPUT
  // ===============================
  const handleContentChange = (e) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  // ===============================
  // FILE SELECTION
  // ===============================
  const handleMediaChange = (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  // max count check
  if (mediaFiles.length + files.length > 5) {
    toast.error("Maximum 5 files allowed");
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  const newValidFiles = [];
  const newPreviews = [];

  let rejectedCount = 0;

  for (const file of files) {
    // ❌ Invalid type
    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/")
    ) {
      rejectedCount++;
      continue;
    }

    // ❌ Size > 10MB
    if (file.size > MAX_FILE_SIZE) {
      rejectedCount++;
      continue;
    }

    newValidFiles.push(file);
    newPreviews.push({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    });
  }

  if (rejectedCount === files.length) {
    toast.error("File size must be under 10MB");
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  // ✅ Append valid files
  setMediaFiles((prev) => [...prev, ...newValidFiles]);
  setPreviewUrls((prev) => [...prev, ...newPreviews]);

  // reset input so same file can be reselected
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};


  const removeMedia = (index) => {
    URL.revokeObjectURL(previewUrls[index].url);
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && mediaFiles.length === 0) {
      toast.error("Post must contain text or media");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      if (content) {
        formData.append("content", content);
      }

      // Backend expects single("file")
      mediaFiles.forEach((file) => {
        formData.append("file", file);
      });

      await api.post("/user/posts/create", formData);

      toast.success("Post created successfully");

      // clear AFTER success
      setContent("");
      setCharCount(0);
      setMediaFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      navigate("/profile");
    } catch (err) {
      toast.error("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================
  // GUARD
  // ===============================
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border">
          <h2 className="text-xl font-bold mb-4">
            Please log in to create posts
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-2 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold">Create Post</h1>
        <p className="text-slate-500 mt-1">Share your thoughts and moments</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y">
          {/* TEXT */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.photourl}
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <span className="text-xs text-slate-500">Public</span>
              </div>
            </div>

            <textarea
              value={content}
              onChange={handleContentChange}
              maxLength={500}
              rows={5}
              placeholder="What's on your mind?"
              className="w-full text-lg resize-none focus:outline-none"
            />

            <div className="text-right text-xs text-slate-400 mt-1">
              {charCount}/500
            </div>
          </div>

          {/* MEDIA */}
          <div className="p-6 bg-slate-50">
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {previewUrls.map((p, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden bg-white border"
                  >
                    {p.type === "video" ? (
                      <video
                        src={p.url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={p.url} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-2 right-2 bg-white text-rose-500 p-1 rounded-full shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-indigo-600 bg-indigo-50 rounded-xl"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <Smile className="w-5 h-5 text-amber-500" />
              <MapPin className="w-5 h-5 text-rose-500" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="hidden"
            />
          </div>

          {/* ACTIONS */}
          <div className="p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Posting..." : "Post"}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
