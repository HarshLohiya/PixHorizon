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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!searchTerm) {
    return <p>No search term provided.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-green-200">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl text-black font-semibold mb-4">
          Search Results for "{searchTerm}"
        </h1>

        {/* Display Users */}
        {users.length > 0 ? (
          <div className="mb-8">
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
        {images.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Images</h2>
            <MasonryGallery images={images} />
          </div>
        ) : null}

        {/* If both users and images are empty */}
        {users.length === 0 && images.length === 0 && (
          <p>No users or images found for "{searchTerm}".</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
