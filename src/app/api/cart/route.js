import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart"; // Cart model
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust the path if needed

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { imageId } = await req.json();

  try {
    const cartItem = await Cart.create({
      userId: session.user.id,
      imageId,
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItems = await Cart.find({ userId: session.user.id }).populate(
      "imageId"
    );

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}
