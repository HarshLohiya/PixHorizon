"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function About() {

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center bg-green-200 py-32 px-4">
        <p className="text-lg text-gray-700 mb-4">
          Coming soon! We&apos;re putting the finishing touches on this page.
        </p>
      </div>
      <Footer />
    </div>
  );
}
