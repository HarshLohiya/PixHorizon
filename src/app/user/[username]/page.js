"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MasonryGallery from "@/components/MasonryGallery";
import { useEffect, useState } from "react";

export default function UserImages({ params }) {
  const { username } = params; // Get the username from the route
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/images?username=${username}`);
        const data = await res.json();
        if (data.length === 0) {
          console.warn("No images found for this user.");
        }
        setImages(data);
      } catch (error) {
        console.error("Error fetching user images:", error);
        setError(error.message)
      }
    };

    if (username) {
      fetchImages();
    }
  }, [username]);

  return (
    <div className="bg-green-200">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">{username}&apos;s Images</h1>
        {error && <p className="text-red-500">Error: {error}</p>}
        {images.length > 0 ? (
          <MasonryGallery images={images} />
        ) : (
          <p className="text-gray-700">No images to display.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
