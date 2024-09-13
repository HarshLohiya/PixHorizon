"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Upload() {
  const { data: session, status } = useSession();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("")
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);

    // Include user info (e.g., email) to associate the image with the user
    if (session?.user?.email) {
      formData.append("userEmail", session.user.email); // Adjust based on your session object
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setMessage(data.message);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image.");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>; // Show loading while session is being fetched
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
          to upload the images.
        </p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-green-200 flex flex-col justify-between min-h-screen">
      <Header />
      <div className="p-8 container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="block mb-4"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            required
            onChange={handleTitleChange}
            className="block mb-4 p-2 border border-gray-300 rounded text-black"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            required={true}
            className="block mb-4 p-2 border border-gray-300 rounded text-black"
          >
            <option value="" disabled>
              Choose a category...
            </option>
            <option value="birds">Birds</option>
            <option value="wildlife">Wildlife</option>
            <option value="landscape">Landscape</option>
            <option value="butterfly">Butterfly</option>
            <option value="flowers">Flowers</option>
            <option value="abstract">Abstract</option>
          </select>

          <textarea
            value={description}
            onChange={handleDescriptionChange}
            required
            className="w-full max-w-2xl p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a small description..."
          />
          <br/>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Upload
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
      <Footer />
    </div>
  );
}
