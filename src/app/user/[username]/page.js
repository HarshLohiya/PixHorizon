"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MasonryGallery from "@/components/MasonryGallery";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

export default function UserImages({ params }) {
  const { data: session } = useSession();
  const { username } = params; // Get the username from the route
  const [images, setImages] = useState(null);
  const [user, setUser] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [error, setError] = useState(null);
  const [pageFound, setPageFound] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/users?username=${username}`);
        const data = await res.json();
        setUser(data);

        const imagesRes = await fetch(`/api/images?username=${username}`);
        const imagesData = await imagesRes.json();
        setImages(imagesData);

        if (session) {
          const isFollowing = data.followers.some(
            (follower) => follower._id === session.user.id
          );
          setIsFollowing(isFollowing);
        }

        const countViews = imagesData.reduce(
          (acc, image) => acc + image.views,
          0
        );

        const countLikes = imagesData.reduce(
          (acc, image) => acc + image.likes.length,
          0
        );

        setTotalViews(countViews);
        setTotalLikes(countLikes);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setPageFound(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [session, username, isFollowing]);

  if (!pageFound) {
    notFound();
  }

  const toggleFollow = async () => {
    setFollowLoading(true);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        body: JSON.stringify({
          targetUsername: username,
          currentUserId: session.user.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      console.log(result);

      // Toggle follow state
      if (res.status === 200) {
        setIsFollowing((prev) => !prev);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleFollowersClick = () => {
    setShowFollowersModal(true);
  };

  const handleFollowingClick = () => {
    setShowFollowingModal(true);
  };

  const closeModal = () => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
  };

  return (
    <div>
      <Header />
      <main className="bg-green-200 px-5 py-5 sm:px-7 sm:py-7 md:px-9 md:py-8 lg:px-16">
        {!images && (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="text-center h-10 w-2/12 mb-4 rounded-xl bg-gray-300 animate-pulse" />
              <div className="text-center h-10 w-4/12 mb-6 rounded-xl bg-gray-300 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full h-80 bg-gray-300 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          </>
        )}
        {images && (
          <>
            <div className="text-center fade-in">
              {/* Centered Username */}
              <h1 className="text-4xl font-bold mb-4 text-black">
                {user.username}
              </h1>

              {/* Follow Button */}
              <div>
                {user.username !== session?.user?.username ? (
                  <button
                    onClick={
                      () =>
                        session
                          ? toggleFollow() // If logged in, toggle follow
                          : alert("Please log in to follow users.") // If not logged in, show alert
                    }
                    disabled={followLoading}
                    className="bg-blue-400 rounded-3xl px-4 py-2"
                  >
                    {followLoading
                      ? "Loading..."
                      : isFollowing
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                ) : (
                  <span />
                )}
              </div>

              {/* Followers and Following Counts */}
              <div className="inline-block mt-4 space-x-2 mb-4 px-5 py-1.5 bg-green-300 rounded-3xl">
                <span
                  className="cursor-pointer underline text-gray-600"
                  onClick={handleFollowersClick}
                >
                  {user.followers?.length} Followers
                </span>
                <span className="text-gray-600">|</span>
                <span
                  className="cursor-pointer underline text-gray-600"
                  onClick={handleFollowingClick}
                >
                  {user.following?.length} Following
                </span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-600">{totalViews} Views</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-600">{totalLikes} Likes</span>
              </div>
            </div>

            {/* Images Gallery */}
            {error && <p className="text-red-500">Error: {error}</p>}
            {images.length > 0 ? (
              <div className="fade-in">
                <MasonryGallery images={images} />
              </div>
            ) : (
              <p className="text-gray-700 text-center mt-8 fade-in">
                No images to display.
              </p>
            )}

            {/* Followers Modal */}
            {showFollowersModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-4 rounded-lg">
                  <h2 className="text-xl font-bold mb-4 text-black">
                    Followers
                  </h2>
                  <ul>
                    {user.followers?.map((follower) => (
                      <li key={follower._id} className="text-black">
                        {follower.username}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={closeModal}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Following Modal */}
            {showFollowingModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-4 rounded-lg">
                  <h2 className="text-xl font-bold mb-4 text-black">
                    Following
                  </h2>
                  <ul>
                    {user.following?.map((us) => (
                      <li key={us._id} className="text-black">
                        {us.username}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={closeModal}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
