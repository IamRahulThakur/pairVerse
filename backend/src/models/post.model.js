import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Caption or text content
    content: {
      type: String,
      trim: true,
      maxLength: 500,
    },

    // Support multiple images or videos
    media: [
      {
        url: { type: String, required: true }, // Cloudinary URL
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        public_id: { type: String, required: true }, // always store public_id for deletion
      },
    ],

    // Likes by users
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Comments count (for performance optimization)
    commentsCount: {
      type: Number,
      default: 0,
    },

    // Reposts (for retweet/share feature)
    repostedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },

    // Hashtags and mentions
    hashtags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Visibility control
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },

  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);
export { PostModel };
