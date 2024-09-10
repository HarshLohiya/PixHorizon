import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  src: String,
  // alt: String,
  title: String,
  category: String,
  width: Number,
  height: Number,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  price: { type: Number, default: 25, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
