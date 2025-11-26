import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../utils/api";
import toast from "react-hot-toast";

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
    
    // Check total files count
    if (mediaFiles.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        invalidFiles.push(file.name);
        return;
      }

      // Validate file size (10MB for images, 50MB for videos)
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

      // Create preview URLs
      const newPreviewUrls = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        name: file.name
      }));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMedia = (index) => {
    const newMediaFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    setMediaFiles(newMediaFiles);
    setPreviewUrls(newPreviewUrls);
    
    // Revoke object URLs to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index].url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
      
      // Append all media files
      mediaFiles.forEach(file => {
        submitData.append("media", file);
      });

      const response = await api.post("/user/posts/create", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!");
      
      // Reset form
      setFormData({ content: "" });
      setMediaFiles([]);
      previewUrls.forEach(preview => URL.revokeObjectURL(preview.url));
      setPreviewUrls([]);
      setCharCount(0);
      
      // Navigate to posts page
      setTimeout(() => {
        navigate("/profile");
      }, 100);

    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        error.response?.data?.error || 
        "Failed to create post. Please try again."
      );
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

  const rearrangeMedia = (fromIndex, toIndex) => {
    const newMediaFiles = [...mediaFiles];
    const newPreviewUrls = [...previewUrls];
    
    const [movedMedia] = newMediaFiles.splice(fromIndex, 1);
    const [movedPreview] = newPreviewUrls.splice(fromIndex, 1);
    
    newMediaFiles.splice(toIndex, 0, movedMedia);
    newPreviewUrls.splice(toIndex, 0, movedPreview);
    
    setMediaFiles(newMediaFiles);
    setPreviewUrls(newPreviewUrls);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to create posts
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
            <p className="text-gray-600 mt-2">Share your thoughts and moments with up to 5 photos or videos</p>
          </div>
        </div>

        {/* Create Post Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={user.photourl || "/default-avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">Posting to: Public</p>
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind? {formData.content && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({charCount}/500)
                  </span>
                )}
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                maxLength={500}
                rows={4}
                placeholder="Share your thoughts, ideas, or experiences..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-none"
              />
            </div>

            {/* Media Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Media ({previewUrls.length}/5)
              </label>
              
              {/* Media Previews Grid */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {previewUrls.map((preview, index) => (
                    <div key={index} className="relative group">
                      {preview.type === 'video' ? (
                        <video
                          src={preview.url}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                          controls
                        />
                      ) : (
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                      )}
                      
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Drag Handle */}
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 group-hover:opacity-100 cursor-move">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </div>

                      {/* Media Type Badge */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {preview.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              {previewUrls.length < 5 && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">
                    Supports images and videos • Max 5 files • Videos up to 50MB
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
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Add to your post</span>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Add media"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Add emoji"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  title="Add location"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Validation Summary */}
            {(!formData.content && mediaFiles.length === 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  💡 Your post should include at least some text or media.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || (!formData.content && mediaFiles.length === 0)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">💡 Posting Tips</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• You can upload up to 5 photos or videos in one post</li>
            <li>• Supported formats: JPG, PNG, GIF, MP4, MOV</li>
            <li>• Maximum file size: 10MB for images, 50MB for videos</li>
            <li>• Add descriptive text to make your post more engaging</li>
            <li>• Be respectful and follow community guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;