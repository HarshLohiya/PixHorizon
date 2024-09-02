// src/app/api/comments/[imageId]/route.js

import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { imageId } = params;
    const comments = await Comment.find({ imageId }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch comments" }), {
      status: 500,
    });
  }
}
