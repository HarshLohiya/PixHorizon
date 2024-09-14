import { NextResponse } from "next/server";
import Image from "@/models/Image";
import dbConnect from "@/lib/dbConnect";

export async function POST(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedImage) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "View incremented",
      views: updatedImage.views,
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { message: "Error incrementing views" },
      { status: 500 }
    );
  }
}
