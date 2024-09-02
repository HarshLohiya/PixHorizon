// api/images/route.js
import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    await dbConnect();

    // Find images by category and sort them by creation date in descending order
    const images = await Image.find({ category }).sort({ _id: -1 }).exec();

    // Include width and height properties
    const formattedImages = images.map((image) => ({
      _id: image._id,
      src: image.src,
      title: image.title,
      category: image.category,
      width: image.width,
      height: image.height,
      likes: image.likes,
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
