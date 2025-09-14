import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  ],
  messages: [messageSchema]
});

const chatModel = mongoose.model("Chat", chatSchema);

export { chatModel };
