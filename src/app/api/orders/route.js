import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Image from "@/models/Image"; 
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust if needed

export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await Order.find({ userId: session.user.id })
      .populate({
        path: "items.imageId",
      })
      .sort({ createdAt: -1 });;
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error during fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}
