import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    displaySrc: String,
    originalSrc: String,
    title: String,
    category: String,
    description: String,
    tags: {type: [String], index:true},
    width: Number,
    height: Number,
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    price: { type: Number, default: 25, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
