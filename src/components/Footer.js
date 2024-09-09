import React from "react";
import InstaLogo from "./InstaLogo";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-1 pb-8">
      <div className="text-center">
        <p className="text-sm">© 2024 by Harsh Lohiya</p>
      </div>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm">
              E-mail:
              <a
                href="mailto:pixhorizon1@gmail.com"
                className="text-orange-300 hover:text-orange-500 ml-2"
              >
                pixhorizon1@gmail.com
              </a>
            </p>
          </div>

          <div className="flex justify-center md:justify-end items-center space-x-4">
            <p className="text-sm">Follow us:</p>
            <a
              href="https://www.instagram.com/pix.horizon/"
              className="text-pink-500 hover:text-pink-700"
            >
              <InstaLogo />
            </a>
          </div>
        </div>

        <div className="flex mt-8 text-center md:text-left">
          <a href="/galleries" className="text-xl font-semibold">Galleries :</a>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 ml-10 max-w-80">
            <a href="/birds" className="hover:text-orange-500 space-x-1">
              Birds
            </a>
            <a
              href="/wildlife"
              className="hover:text-orange-500 mt-0.5 space-x-1"
            >
              Wildlife
            </a>
            <a href="/landscape" className="hover:text-orange-500 mt-0.5">
              Landscape
            </a>
            <a href="/butterfly" className="hover:text-orange-500 mt-0.5">
              Butterfly
            </a>
            <a href="/flowers" className="hover:text-orange-500 mt-0.5">
              Flowers
            </a>
            <a href="/abstract" className="hover:text-orange-500 mt-0.5">
              Abstract
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
