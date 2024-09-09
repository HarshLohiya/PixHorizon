import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Connect to the database
dbConnect();

export async function DELETE(req, { params }) {
  const { itemId } = params;

  // Get the session to ensure the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(
      JSON.stringify({
        message: "You must be logged in to remove items from your cart.",
      }),
      { status: 401 }
    );
  }

  try {
    // Find the cart item by ID and ensure it belongs to the logged-in user
    console.log(itemId)
    console.log(session.user.id)
    const deletedItem = await Cart.findOneAndDelete({
      _id: itemId,
      userId: session.user.id, // Ensure the item belongs to the logged-in user
    });

    if (!deletedItem) {
      return new Response(
        JSON.stringify({
          message:
            "Cart item not found or you are not authorized to delete it.",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Item removed from the cart successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to remove item from the cart." }),
      { status: 500 }
    );
  }
}