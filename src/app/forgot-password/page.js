// app/forgot-password/page.js
"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center bg-green-200 py-12 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
          <h2 className="text-2xl mb-10 font-bold text-center text-black">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit} className="mt-40 ">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-blue-500 text-sm text-black"
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Send Reset Email
            </button>
            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
