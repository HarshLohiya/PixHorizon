import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust if needed
import { sendOrderConfirmationEmail } from "@/lib/sendMail";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the user's cart items
    const cartItems = await Cart.find({ userId: session.user.id }).populate({
      path: "imageId"
    });

    if (!cartItems.length) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Calculate the total cost
    const totalCost = cartItems.reduce((acc, item) => 
      acc + item.imageId.price, 0);

    console.log(totalCost);

    // Create a new order
    const order = await Order.create({
      userId: session.user.id,
      items: cartItems.map((item) => ({ imageId: item.imageId._id })),
      totalCost,
    });

    // Clear the cart after order is placed
    await Cart.deleteMany({ userId: session.user.id });

    const downloadLinks = cartItems.map((item) => item.imageId.originalSrc);

    await sendOrderConfirmationEmail(
      session.user.email,
      order._id,
      downloadLinks
    );

    return NextResponse.json(
      { message: "Order placed successfully! An email will be sent with the order details shortly.", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during checkout:", error); // Log the error to identify the issue
    return NextResponse.json(
      { error: "Failed to process checkout", details: error.message },
      { status: 500 }
    );
  }
}
