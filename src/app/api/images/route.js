// api/images/route.js
import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";
import User from "@/models/User"; // Import the User model if not already imported
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const username = searchParams.get("username");

  try {
    await dbConnect();

    let images;

    if (username) {
      // Find user by username and then fetch images associated with the user
      const user = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, "i") },
      }).exec();
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      images = await Image.find({ user: user._id }).sort({ _id: -1 }).exec();
    } else if (category) {
      // Find images by category
      images = await Image.find({ category }).sort({ _id: -1 }).exec();
    } else {
      return NextResponse.json(
        { message: "Category or username is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Format the images
    const formattedImages = images.map((image) => ({
      _id: image._id,
      src: image.src,
      title: image.title,
      category: image.category,
      width: image.width,
      height: image.height,
      likes: image.likes,
      liked: image.likes.includes(userId) ? true : false,
      price: image.price,
    }));

    return NextResponse.json(formattedImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { message: "Error fetching images", error: error.message },
      { status: 400 }
    );
  }
}
