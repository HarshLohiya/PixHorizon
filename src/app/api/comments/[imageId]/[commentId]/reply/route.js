import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Comment from "@/models/Comment"; // Adjust the path based on your project structure

export async function POST(req, { params }) {
  const { imageId, commentId } = params;
  const { username, reply } = await req.json();

  if (
    !mongoose.Types.ObjectId.isValid(imageId) ||
    !mongoose.Types.ObjectId.isValid(commentId)
  ) {
    return NextResponse.json(
      { error: "Invalid image or comment ID" },
      { status: 400 }
    );
  }

  try {
    const comment = await Comment.findOne({ _id: commentId, imageId });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    comment.replies.push({ username, comment: reply, createdAt: new Date() });
    await comment.save();

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.error("Error posting reply:", error);
    return NextResponse.json(
      { error: "Failed to post reply" },
      { status: 500 }
    );
  }
}
