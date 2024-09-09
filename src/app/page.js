"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Image from "next/image";

import React from "react";
import { Carousel } from "react-responsive-carousel";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import "react-responsive-carousel/lib/styles/carousel.min.css";


import { Autoplay, Pagination, Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function Home() {

  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div>
      <Header />

      <section className="w-full h-[500px]">
        {session ? `Welcome, ${session.user.email + ", " + session.user.username}!` : "Welcome!"}
        <button className="ml-16" onClick={signOut}>Log out</button>
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
            <div className="relative w-full h-[500px]">
              <Image
                src="/photo1.jpg"
                alt="Image 1"
                fill
                style={{ objectFit: "cover" }}
                quality={80}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[500px]">
              <Image
                src="/photo2.jpg"
                alt="Image 2"
                fill
                style={{ objectFit: "cover" }}
                quality={80}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[500px]">
              <Image
                src="/photo3.jpg"
                alt="Image 3"
                fill
                style={{ objectFit: "cover" }}
                quality={80}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* <section className="w-full h-[400px]">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          className="h-full"
        >
          <div>
            <img
              src="/photo1.jpg"
              alt="Image 1"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div>
            <img
              src="/photo2.jpg"
              alt="Image 2"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div>
            <img
              src="/photo3.jpg"
              alt="Image 3"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </Carousel>
      </section> */}

      <section className="bg-green-200 bg-cover bg-center h-screen">
        <div className="container mx-auto px-6 py-24 flex flex-col justify-center items-center text-center h-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold">
            Harsh Lohiya
          </h1>
          <p className="text-white text-lg md:text-xl lg:text-2xl mt-4">
            Photographer
          </p>
          <button className="mt-6 px-6 py-2 md:px-8 md:py-3 bg-red-500 text-white text-base md:text-lg font-semibold rounded-lg">
            Check Out Photos
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
