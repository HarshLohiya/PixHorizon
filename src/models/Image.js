import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    src: String,
    title: String,
    category: String,
    description: String,
    width: Number,
    height: Number,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    price: { type: Number, default: 25, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
