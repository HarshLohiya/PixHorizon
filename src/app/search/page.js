"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MasonryGallery from "@/components/MasonryGallery";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q");

  const [users, setUsers] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchTerm)}`
        );
        const data = await response.json();

        setUsers(data.users || []);
        setImages(data.images || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchSearchResults();
    }
  }, [searchTerm]);

  if (!searchTerm) {
    return <p>No search term provided.</p>;
  }

  return (
    <div className="">
      <Header />
      <div className="min-h-screen bg-green-200 px-5 py-5 sm:px-7 sm:py-7 md:px-9 md:py-8 lg:px-16">
        <h1 className="text-3xl text-black font-semibold mb-4">
          Search Results for &quot;{searchTerm}&quot;
        </h1>

        {/* Loading State */}
        {loading && (
          <>
          <div className="h-8 w-2/12 bg-gray-300 animate-pulse rounded-lg mb-4"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mt-4">
                  <div className="w-1/2 h-4 bg-gray-300 animate-pulse rounded-full"></div>
                  <div className="w-1/4 h-4 bg-gray-300 animate-pulse rounded-full mt-2"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-8 w-2/12 bg-gray-300 animate-pulse rounded-lg mb-4"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-40 bg-gray-300 animate-pulse rounded-lg"></div>
                <div className="mt-4">
                  <div className="w-1/2 h-4 bg-gray-300 animate-pulse rounded-full"></div>
                  <div className="w-1/4 h-4 bg-gray-300 animate-pulse rounded-full mt-2"></div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {/* Display Users */}
        {users.length > 0 && !loading ? (
          <div className="mb-8 fade-in">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Link key={user._id} href={`/user/${user.username}`}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-lg font-semibold text-black">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* Display Images */}
        {images.length > 0 && !loading ? (
          <div className="mt-8 fade-in">
            <h2 className="text-2xl font-bold mb-2">Images</h2>
            <MasonryGallery images={images} />
          </div>
        ) : null}

        {/* If both users and images are empty */}
        {users.length === 0 && images.length === 0 && !loading && (
          <p>No users or images found for &quot;{searchTerm}&quot;.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
