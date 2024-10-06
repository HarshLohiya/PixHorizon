import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Image from "@/models/Image";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q");

  if (!searchTerm) {
    return NextResponse.json(
      { message: "No search term provided" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Search for users based on username
    const userResults = await User.find({
      username: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
    });

    // Search for images based on title or tags
    const imageResults = await Image.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } }, // Assuming tags is an array
      ],
    });

    return NextResponse.json(
      { users: userResults, images: imageResults },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json(
      { message: "Error fetching search results" },
      { status: 500 }
    );
  }
}
