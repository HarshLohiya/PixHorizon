import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";
import { getServerSession } from "next-auth/next"; // Use next-auth for server-side session handling
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your NextAuth config

export async function POST(request, { params }) {
  const { id } = params; // Get image ID from URL

  // Get the session using getServerSession for server-side
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await dbConnect();
    const userId = session.user.id;

    // Find the image by ID
    const image = await Image.findById(id);

    if (!image) {
      return new Response("Image not found", { status: 404 });
    }

    // Check if the user has already liked the image
    const isLiked = image.likes.includes(userId);

    if (isLiked) {
      // If already liked, unlike it (remove user from likes array)
      image.likes.pull(userId);
    } else {
      // If not liked, like it (add user to likes array)
      image.likes.push(userId);
    }

    // Save the image with updated likes
    await image.save();

    return new Response(
      JSON.stringify({ message: "Success", likesCount: image.likes.length }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error liking/unliking image:", error);
    return new Response("Error", { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params; // Get image ID from URL
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ liked: false, loggedIn: false }), {
      status: 200,
    });
  }

  try {
    await dbConnect();
    const userId = session.user.id;

    // Find the image by ID
    const image = await Image.findById(id);

    if (!image) {
      return new Response("Image not found", { status: 404 });
    }

    // Check if the user has already liked the image
    const isLiked = image.likes.includes(userId);

    return new Response(JSON.stringify({ liked: isLiked }), { status: 200 });
  } catch (error) {
    console.error("Error fetching like status:", error);
    return new Response("Error", { status: 500 });
  }
}
