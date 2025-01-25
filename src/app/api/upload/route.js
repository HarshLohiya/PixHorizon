import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.formData();
    const displaySrc = data.get("displaySrc");
    const originalSrc = data.get("originalSrc");
    const title = data.get("title");
    const category = data.get("category");
    const userEmail = data.get("userEmail");
    const description = data.get("description");
    const displayWidth = data.get("width");
    const displayHeight = data.get("height");
    const tags = data.getAll("tags");

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found");
    }

    // Save image data to MongoDB
    const newImage = await Image.create({
      displaySrc: displaySrc,
      originalSrc: originalSrc,
      title: title,
      category: category,
      description: description,
      tags: tags,
      width: displayWidth,
      height: displayHeight,
      like: 0,
      price: 25,
      user: user._id,
    });

    return NextResponse.json(
      { message: "Image created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { message: "Error creating image", error: error.message },
      { status: 400 }
    );
  }
}
