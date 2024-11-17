"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Failed to fetch cart items.");
        const data = await res.json();
        setCartItems(data);

        // Calculate total cost
        const total = data.reduce((sum, item) => sum + item.imageId.price, 0);
        setTotalCost(total);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [session]);

  const handleRemove = async (itemId) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove item from cart.");

      // Remove the item from the state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );

      // Recalculate total cost
      const updatedTotal = cartItems
        .filter((item) => item._id !== itemId)
        .reduce((sum, item) => sum + item.imageId.price, 0);
      setTotalCost(updatedTotal);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems([]); // Clear the cart after checkout
        if (window.confirm("Order placed successfully! View your orders?")) {
          // Redirect to the /orders page
          window.location.href = "/orders";
        }
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-green-200">
        <Header />
        <p className="mx-auto text-lg text-gray-700">
          Please{" "}
          <Link href="/login" className="text-blue-600 underline">
            log in
          </Link>{" "}
          to view your cart.
        </p>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-green-200">
        <Header />
        <p className="mx-auto text-lg text-gray-700">
          Whoops, your cart is empty! Start adding your favorite finds.
        </p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-green-200 min-h-screen">
      <Header />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-lg">
              <Link href={`/images/${item.imageId._id}`}>
                <Image
                  src={item.imageId.src}
                  alt={item.imageId.title}
                  width={item.imageId.width}
                  height={item.imageId.height}
                  className="rounded-lg"
                />
              </Link>
              <h2 className="text-lg font-semibold mt-4 text-black">
                {item.imageId.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {item.imageId.category}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {item.imageId.description}
              </p>
              <p className="text-sm font-bold text-gray-800 mt-4">
                Price: ${item.imageId.price}
              </p>
              {/* <div className="flex items-center mt-2">
                <button className="px-2 py-1 bg-gray-300 rounded-lg">-</button>
                <span className="mx-2 text-black">{item.quantity}</span>
                <button className="px-2 py-1 bg-gray-300 rounded-lg">+</button>
              </div> */}
              {/* <p className="text-sm font-bold text-gray-800 mt-2">
                Total: ${item.imageId.price * item.quantity}
              </p> */}
              {/* Add a Remove from Cart button */}
              <button className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-lg"
              onClick={() => handleRemove(item._id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Cart Summary
          </h2>
          <p className="text-lg font-bold text-black">
            Total Items: {cartItems.length}
          </p>
          <p className="text-lg font-bold mt-2 text-black">
            Total Cost: ${totalCost}
          </p>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg"
          >
            Checkout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
