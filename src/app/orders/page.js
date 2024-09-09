"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

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

    fetchOrders();
  }, [session]);

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
          to view your orders.
        </p>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <p className="text-lg text-gray-700">You have no orders.</p>
      </div>
    );
  }

  return (
    <div className="bg-green-200 min-h-screen">
      <Header />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-black">
                Order placed on {new Date(order.createdAt).toLocaleDateString()}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Total: ${order.totalCost}
              </p>
              <ul className="mt-4">
                {order.items.map((item) => (
                  <li key={item.imageId._id} className="mt-2">
                    <Link href={`/images/${item.imageId._id}`}>
                      <Image
                        src={item.imageId.src}
                        alt={item.imageId.title}
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                    </Link>
                    <p className="text-sm text-gray-700">
                      {item.imageId.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
