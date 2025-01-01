"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState(null); // Default to null
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) return;

      setIsLoading(true);
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders.");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [session, status]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-green-200 p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>

        {/* Loading State */}
        {(status === "loading" ||
          (status === "authenticated" && isLoading)) && (
          // <div className="flex items-center justify-center mt-12">
          //   <div className="loader"></div>
          //   <p className="ml-4 text-gray-700">Checking session...</p>
          // </div>
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

        {/* No Session State */}
        {!isLoading ||
          (status === "unauthenticated" && (
            <p className="mx-auto text-lg text-gray-700 text-center fade-in">
              Please{" "}
              <Link href="/login" className="text-blue-600 underline">
                log in
              </Link>{" "}
              to view your orders.
            </p>
          ))}

        {/* Empty State */}
        {status === "authenticated" && !isLoading && orders?.length === 0 && (
          <div className="flex flex-col items-center mt-8 mb-12 fade-in">
            {/* <Image
              src="/assets/empty-orders.svg"
              alt="No Orders"
              width={200}
              height={200}
            /> */}
            <p className="text-center text-lg text-gray-700">
              No orders yet! Start shopping now and your orders will appear
              here.
            </p>
            <Link
              href="/galleries"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Orders List */}
        {status === "authenticated" && !isLoading && orders?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 fade-in">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg shadow-lg"
              >
                <h2 className="text-lg font-semibold text-black">
                  Order placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Total: ${order.totalCost}
                </p>
                <ul className="mt-4 flex flex-wrap">
                  {order.items.map((item) => (
                    <li key={item.imageId._id} className="m-2 w-2/5">
                      <div className="relative aspect-[16/10] w-full">
                        <Link href={`/images/${item.imageId._id}`}>
                          <Image
                            src={item.imageId.src}
                            alt={item.imageId.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </Link>
                      </div>
                      <p className="text-sm text-gray-700">
                        {item.imageId.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
