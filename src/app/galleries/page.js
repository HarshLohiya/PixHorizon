"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const galleries = [
  { id: "birds", title: "Birds", src: "/photo1.jpg" },
  { id: "wildlife", title: "Wildlife", src: "/photo2.jpg" },
  { id: "landscape", title: "Landscapes", src: "/photo3.jpg" },
  { id: "butterfly", title: "Butterfly", src: "/photo4.jpg" },
  { id: "flowers", title: "Flowers", src: "/photo5.jpg" },
  { id: "abstract", title: "Abstract", src: "/photo6.jpg" },
];

export default function GalleriesPage() {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-green-200 p-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-black">
          Explore Galleries
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-8">
          {galleries.map((gallery) => (
            <Link key={gallery.id} href={`/${gallery.id}`} passHref>
              <div className="relative group cursor-pointer">
                <div className="relative aspect-[16/10] w-full">
                  {/* Skeleton Loader */}
                  {!loadedImages[gallery.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300 animate-pulse rounded-xl"></div>
                  )}
                  {/* Image */}
                  <Image
                    src={gallery.src}
                    alt={gallery.title}
                    layout="fill"
                    objectFit="cover"
                    className={`rounded-xl shadow-lg transform transition-transform duration-300 group-hover:scale-105 ${
                      loadedImages[gallery.id]
                        ? "opacity-100 fade-in"
                        : "opacity-0"
                    }`}
                    onLoadingComplete={() => handleImageLoad(gallery.id)}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-105 transition-opacity duration-300 rounded-xl">
                  <h2 className="text-2xl font-bold text-white">
                    {gallery.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
