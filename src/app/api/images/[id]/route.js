// src/pages/api/images/[id].js
import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    const image = await Image.findById(id).populate("user", "username");
    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    // Fetch previous and next images
    const [previousImage, nextImage] = await Promise.all([
      Image.findOne({ _id: { $lt: id } })
        .sort({ _id: -1 })
        .exec(),
      Image.findOne({ _id: { $gt: id } })
        .sort({ _id: 1 })
        .exec(),
    ]);

    const response = {
      ...image.toObject(),
      previousId: previousImage?._id || null,
      nextId: nextImage?._id || null,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching image" },
      { status: 500 }
    );
  }
}
