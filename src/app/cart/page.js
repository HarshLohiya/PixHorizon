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
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  const [isOrderPlaceLoading, setIsOrderPlaceLoading] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Failed to fetch cart items.");
        const data = await res.json();
        setCartItems(data);
        setIsCartEmpty(data.length === 0);

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
    setIsOrderPlaceLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccessDialogOpen(true);
        setCartItems([]); // Clear the cart after checkout
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsOrderPlaceLoading(false);
    }
  };

  const handleRedirection = () => {
    window.location.href = "/orders";
  };

  return (
    <div className="bg-green-200">
      <Header />
      <div className="p-8 min-h-[90vh]">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {isLoading && status === "loading" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && status === "unauthenticated" && (
          <p className="mx-auto text-lg text-gray-700">
            Please{" "}
            <Link href="/login" className="text-blue-600 underline">
              log in
            </Link>{" "}
            to view your cart.
          </p>
        )}

        {status === "authenticated" && !isLoading && cartItems.length === 0 && (
          <p className="mx-auto text-lg text-gray-700">
            Whoops, your cart is empty! Start adding your favourite finds.
          </p>
        )}

        {status === "authenticated" && !isLoading && (
          <div className="fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-lg shadow-lg"
                >
                  <Link href={`/images/${item.imageId._id}`}>
                    <Image
                      src={item.imageId.displaySrc}
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
                  <button
                    className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-lg"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-8 p-4 bg-white shadow-lg rounded-lg w-full md:w-1/2">
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
                disabled={isCartEmpty}
                className={`mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg ${
                  cartItems.length === 0 ? "cursor-not-allowed" : ""
                }`}
              >
                Checkout
              </button>
            </div>
            {/* Loading Dialog */}
            {isOrderPlaceLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center text-black">
                  <div className="loader mb-4"></div> {/* Spinner */}
                  <p>Almost there! Your order is being placed...</p>
                </div>
              </div>
            )}
            {/* Success Dialog */}
            {isSuccessDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-white p-6 rounded shadow-lg text-center text-black">
                  <p>Order placed successfully. Redirecting to orders page.</p>
                  <button
                    onClick={handleRedirection}
                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
