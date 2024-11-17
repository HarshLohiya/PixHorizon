"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MasonryGallery from "@/components/MasonryGallery";
import { useEffect, useState } from "react";

export default function Wildlife() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images?category=wildlife");
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <Header />
      <main className="bg-green-200 px-5 py-5 sm:px-7 sm:py-7 md:px-9 md:py-10 lg:px-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Wildlife</h1>
        <p className="text-base md:text-lg text-gray-700 mb-4">
          Welcome to PixHorizon! We are passionate about capturing the beauty of
          nature through our lens.
        </p>
        <MasonryGallery images={images} />
      </main>
      <Footer />
    </div>
  );
}
