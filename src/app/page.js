"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Image from "next/image";
import React from "react";
// import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Header />

      <section className="w-full h-[300px] md:h-[83vh]">
        <Swiper
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          loop={true}
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
        >
          <SwiperSlide>
            <div className="relative w-full h-[300px] md:h-[83vh]">
              <Image
                src="/photo2.jpg"
                alt="Image 1"
                fill
                style={{ objectFit: "cover" }}
                quality={60}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-[300px] md:h-[83vh]">
              <Image
                src="/photo4.jpg"
                alt="Image 2"
                fill
                style={{ objectFit: "cover" }}
                quality={60}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-[300px] md:h-[83vh]">
              <Image
                src="/photo3.jpg"
                alt="Image 3"
                fill
                style={{ objectFit: "cover" }}
                quality={60}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="bg-green-200 bg-cover bg-center h-screen">
        <div className="container mx-auto px-6 py-20 flex flex-col justify-center items-center text-center h-full">
          <img
            src="/dp_harsh.jpg" // Replace with the actual path to your image
            alt="Harsh Lohiya"
            className="w-48 h-48 rounded-full object-cover mb-8"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold">
            Harsh Lohiya
          </h1>
          <p className="text-white text-lg md:text-xl lg:text-2xl mt-4">
            Photographer
          </p>
          <Link href="/galleries">
            <button className="mt-6 px-6 py-2 md:px-8 md:py-3 bg-red-500 text-white text-base md:text-lg font-semibold rounded-lg">
              Check Out Photos
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
