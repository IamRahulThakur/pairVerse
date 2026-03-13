import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, ImagePlus, Send, Trash2, Video } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const CreatePost = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const fileInputRef = useRef(null);

  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (mediaFiles.length + files.length > 5) {
      toast.error("You can upload up to 5 files");
      event.target.value = "";
      return;
    }

    const nextFiles = [];
    const nextPreviews = [];

    files.forEach((file) => {
      const isMedia = file.type.startsWith("image/") || file.type.startsWith("video/");
      if (!isMedia || file.size > MAX_FILE_SIZE) {
        return;
      }

      nextFiles.push(file);
      nextPreviews.push({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
      });
    });

    if (!nextFiles.length) {
      toast.error("Only images or videos under 10MB are allowed");
      event.target.value = "";
      return;
    }

    setMediaFiles((current) => [...current, ...nextFiles]);
    setPreviewUrls((current) => [...current, ...nextPreviews]);
    event.target.value = "";
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(previewUrls[index].url);
    setMediaFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPreviewUrls((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim() && mediaFiles.length === 0) {
      toast.error("Add text or media before posting");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      if (content.trim()) {
        formData.append("content", content.trim());
      }

      mediaFiles.forEach((file) => {
        formData.append("file", file);
      });

      await api.post("/user/posts/create", formData);
      toast.success("Build update shared");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not share update");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="glass-panel-strong mx-auto max-w-xl rounded-[36px] px-8 py-12 text-center">
        <h1 className="display-font text-3xl font-bold text-slate-900">Sign in required</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          You need an account to share updates with your network.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 rounded-full bg-[#18474f] px-5 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-full border border-[#e8dccb] bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-3xl">
          <span className="section-kicker">Share build momentum</span>
          <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            Post an update your collaborators can react to with real context.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            The backend already supports text, images, and videos. This screen reframes that as a
            build log rather than a generic social post.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="glass-panel-strong rounded-[32px] px-5 py-6 sm:px-6">
        <div className="flex items-start gap-4">
          <img
            src={user.photourl || "https://placehold.co/96x96/f4ede2/1f2937?text=PV"}
            alt={user.firstName}
            className="h-14 w-14 rounded-[20px] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Share progress, asks, demos, or experiments with your accepted network.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={500}
            rows={7}
            placeholder="What are you building right now? What kind of collaborator, feedback, or momentum would help?"
            className="field-shell w-full px-5 py-4 text-base leading-8"
          />
          <div className="mt-2 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {content.length}/500
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-dashed border-[#dccbb3] bg-[#faf6ee] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Add images or videos</p>
              <p className="mt-1 text-sm text-slate-500">
                Up to 5 files, maximum 10MB each.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-[#18474f] px-4 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
            >
              <span className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" />
                Select files
              </span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
            className="hidden"
          />

          {previewUrls.length > 0 && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {previewUrls.map((preview, index) => (
                <div
                  key={`${preview.url}-${index}`}
                  className="relative overflow-hidden rounded-[24px] bg-black/80"
                >
                  {preview.type === "video" ? (
                    <video src={preview.url} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <img src={preview.url} alt="Preview" className="aspect-[4/3] w-full object-cover" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-white">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {preview.type === "video" ? (
                        <span className="inline-flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          Video
                        </span>
                      ) : (
                        "Image"
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="rounded-full bg-white/20 p-2 transition hover:bg-white/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-[#e8dccb] px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-[#ff8a3d] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition hover:bg-[#f07b2e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {isLoading ? "Posting..." : "Share update"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
