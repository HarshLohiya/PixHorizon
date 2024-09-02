// src/app/api/images/[id]/like/route.js
import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = params;
  await dbConnect();
  const { likes } = await req.json();

  try {
    await Image.findByIdAndUpdate(id, { likes });
    return NextResponse.json({ message: "Likes updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating likes", error },
      { status: 500 }
    );
  }
}
