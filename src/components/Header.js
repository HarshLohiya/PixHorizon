"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (session) {
        try {
          const res = await fetch("/api/cart"); // Fetch cart items
          if (!res.ok) throw new Error("Failed to fetch cart items.");
          const data = await res.json();
          setCartCount(data.length);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchCartCount();
  }, [session]);

  const activeLink = "text-green-500 font-semibold";
  const inactiveLink = "text-black hover:text-green-500 font-semibold";

  const inactiveSubLink =
    "block px-4 py-2 text-gray-700 hover:text-green-500 hover:bg-orange-100 rounded-lg";
  const activeSubLink =
    "block px-4 py-2 text-gray-700 text-green-500 hover:bg-orange-100 rounded-lg";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`bg-orange-50 shadow-lg sticky top-0 transition-all duration-500 ease-in-out z-50 ${
        isSticky ? "bg-opacity-90" : "bg-opacity-100"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Title */}
        <div className="text-5xl md:text-6xl italic text-red-600 font-peaches text-shadow-md -translate-y-0.5">
          <a href="/">PixHorizon</a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:-ml-60 md:flex space-x-6 bg-orange-100 rounded-3xl py-2 px-4">
          <a href="/" className={pathname === "/" ? activeLink : inactiveLink}>
            Home
          </a>

          {/* Dropdown Menu for Galleries */}
          <div className="relative group">
            <a
              href="/galleries"
              className={
                pathname.includes("/galleries") ||
                pathname.includes("/birds") ||
                pathname.includes("/wildlife") ||
                pathname.includes("/landscape") ||
                pathname.includes("/butterfly") ||
                pathname.includes("/flowers") ||
                pathname.includes("/abstract")
                  ? activeLink
                  : inactiveLink
              }
            >
              Galleries
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-orange-100 border border-gray-200 shadow-lg z-10 hidden group-hover:block group-hover:mt-0 transition-all duration-200 rounded-lg">
              <a
                href="/birds"
                className={
                  pathname.includes("/birds") ? activeSubLink : inactiveSubLink
                }
              >
                Birds
              </a>
              <a
                href="/wildlife"
                className={
                  pathname.includes("/wildlife")
                    ? activeSubLink
                    : inactiveSubLink
                }
              >
                Wildlife
              </a>
              <a
                href="/landscape"
                className={
                  pathname.includes("/landscape")
                    ? activeSubLink
                    : inactiveSubLink
                }
              >
                Landscape
              </a>
              <a
                href="/butterfly"
                className={
                  pathname.includes("/butterfly")
                    ? activeSubLink
                    : inactiveSubLink
                }
              >
                Butterfly
              </a>
              <a
                href="/flowers"
                className={
                  pathname.includes("/flowers")
                    ? activeSubLink
                    : inactiveSubLink
                }
              >
                Flowers
              </a>
              <a
                href="/abstract"
                className={
                  pathname.includes("/abstract")
                    ? activeSubLink
                    : inactiveSubLink
                }
              >
                Abstract
              </a>
            </div>
          </div>

          <a
            href="/pricing"
            className={
              pathname.includes("/pricing") ? activeLink : inactiveLink
            }
          >
            Pricing
          </a>
          <a
            href="/about"
            className={pathname.includes("/about") ? activeLink : inactiveLink}
          >
            About
          </a>
          <a
            href="/contact-us"
            className={
              pathname.includes("/contact-us") ? activeLink : inactiveLink
            }
          >
            Contact Us
          </a>
        </nav>

        {/* Login, Cart, and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          {!session ? (
            <>
              <a href="/signup" className="text-gray-700 hover:text-red-500">
                Sign Up
              </a>
              <a href="/login" className="text-gray-700 hover:text-red-500">
                Log In
              </a>
            </>
          ) : (
            <>
              <span className="text-gray-700">Hi, {session.user.username}</span>

              {/* User Avatar for Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="focus:outline-none flex items-center space-x-2"
                >
                  <img
                    src={session.user.image || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-gray-400"
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-orange-100 rounded-md shadow-lg py-2">
                    <a
                      href="/profile"
                      className={
                        pathname.includes("/profile")
                          ? activeSubLink
                          : inactiveSubLink
                      }
                    >
                      Profile Details
                    </a>
                    <a
                      href="/upload"
                      className={
                        pathname.includes("/upload")
                          ? activeSubLink
                          : inactiveSubLink
                      }
                    >
                      Upload Image
                    </a>
                    <a
                      href="/orders"
                      className={
                        pathname.includes("/orders")
                          ? activeSubLink
                          : inactiveSubLink
                      }
                    >
                      My Orders
                    </a>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-500"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="flex items-center text-gray-700 hover:text-red-500"
              >
                <FaShoppingCart size={20} />
                <span className="ml-1">({cartCount})</span>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-orange-50">
          <a
            href="/"
            className={`block px-4 py-2 ${
              pathname === "/" ? activeLink : inactiveLink
            }`}
          >
            Home
          </a>

          {/* Dropdown Menu for Galleries */}
          <div className="relative">
            <a
              href="/galleries"
              className={`block px-4 py-2 ${
                pathname.includes("/galleries") ||
                pathname.includes("/birds") ||
                pathname.includes("/wildlife") ||
                pathname.includes("/landscape") ||
                pathname.includes("/butterfly") ||
                pathname.includes("/flowers") ||
                pathname.includes("/abstract")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              Galleries
            </a>
            <div className="pl-4">
              <a
                href="/birds"
                className={`block px-4 py-2 ${
                  pathname.includes("/birds") ? activeSubLink : inactiveSubLink
                }`}
              >
                Birds
              </a>
              <a
                href="/wildlife"
                className={`block px-4 py-2 ${
                  pathname.includes("/wildlife")
                    ? activeSubLink
                    : inactiveSubLink
                }`}
              >
                Wildlife
              </a>
              <a
                href="/landscape"
                className={`block px-4 py-2 ${
                  pathname.includes("/landscape")
                    ? activeSubLink
                    : inactiveSubLink
                }`}
              >
                Landscape
              </a>
              <a
                href="/butterfly"
                className={`block px-4 py-2 ${
                  pathname.includes("/butterfly")
                    ? activeSubLink
                    : inactiveSubLink
                }`}
              >
                Butterfly
              </a>
              <a
                href="/flowers"
                className={`block px-4 py-2 ${
                  pathname.includes("/flowers")
                    ? activeSubLink
                    : inactiveSubLink
                }`}
              >
                Flowers
              </a>
              <a
                href="/abstract"
                className={`block px-4 py-2 ${
                  pathname.includes("/abstract")
                    ? activeSubLink
                    : inactiveSubLink
                }`}
              >
                Abstract
              </a>
            </div>
          </div>

          <a
            href="/pricing"
            className={`block px-4 py-2 ${
              pathname.includes("/pricing") ? activeLink : inactiveLink
            }`}
          >
            Pricing
          </a>
          <a
            href="/about"
            className={`block px-4 py-2 ${
              pathname.includes("/about") ? activeLink : inactiveLink
            }`}
          >
            About
          </a>
          <a
            href="/contact-us"
            className={`block px-4 py-2 ${
              pathname.includes("/contact-us") ? activeLink : inactiveLink
            }`}
          >
            Contact Us
          </a>
        </nav>
      )}
    </header>
  );
}
