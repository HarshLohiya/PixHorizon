"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MasonryGallery from "@/components/MasonryGallery";
import { useEffect, useState } from "react";

export default function Butterfly() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images?category=butterfly");
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <Header />
      <main className="bg-green-200 px-5 py-5 sm:px-7 sm:py-7 md:px-9 md:py-10 lg:px-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Butterfly</h1>
        <p className="text-base md:text-lg text-gray-700 mb-4">
          Welcome to PixHorizon! We are passionate about capturing the beauty of
          nature through our lens.
        </p>
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-80 bg-gray-300 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : (
          <div className="fade-in">
            <MasonryGallery images={images} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
