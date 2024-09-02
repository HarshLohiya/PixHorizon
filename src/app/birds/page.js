"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MasonryGallery from "@/components/MasonryGallery";
import { useEffect, useState } from "react";

export default function Birds() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images?category=birds");
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="bg-green-200">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Birds</h1>
        <p className="text-lg text-gray-700">
          Welcome to PixHorizon! We are passionate about capturing the beauty of
          nature through our lens.
        </p>
        <MasonryGallery images={images} />
      </main>
      <Footer />
    </div>
  );
}
