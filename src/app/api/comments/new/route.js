// src/app/api/comments/new/route.js

import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";

export async function POST(req) {
  await dbConnect();
  try {
    const { imageId, username, comment } = await req.json();

    const newComment = await Comment.create({ imageId, username, comment });
    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to post comment" }), {
      status: 500,
    });
  }
}
