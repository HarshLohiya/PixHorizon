"use client";

import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { ShareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MasonryGallery({ images }) {
  return (
    <div className="columns-1 sm:columns-2 gap-3 space-y-3">
      {images.map((image, index) => (
        <Link key={index} href={`/images/${image._id}`} passHref>
          <div className="relative group break-inside-avoid mb-4 cursor-pointer">
            <Image
              priority={true}
              src={image.src}
              alt={image.title || `Image ${index + 1}`}
              width={image.width}
              height={image.height}
              className="w-full h-auto rounded-lg"
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 rounded-lg">
              {/* Title with adjusted vertical position */}
              <div className="flex-grow flex items-center justify-center mt-10">
                <p className="text-lg font-semibold text-white">
                  {image.title}
                </p>
              </div>
              {/* Like and Share buttons at the bottom */}
              <div className="flex justify-between mb-2">
                <LikeButton
                  imageId={image._id}
                  initialLikes={image.likes.length || 0}
                />
                <ShareButton imageId={image._id} imageTitle={image.title} />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function LikeButton({ imageId, initialLikes }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/images/${imageId}/like`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        } else {
          console.error("Failed to fetch like status");
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [imageId]);

  const handleLike = async (e) => {
    e.preventDefault();

    if (!session) {
      alert("You must be logged in to like this image.");
      return;
    }

    const newLikedState = !liked;
    const updatedLikes = newLikedState ? likes + 1 : likes - 1;

    try {
      const response = await fetch(`/api/images/${imageId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setLiked(newLikedState);
        setLikes(updatedLikes);
      } else {
        console.error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div className="flex items-center space-x-0.5">
      <button
        className="p-2 transition duration-300 hover:animate-bounce"
        onClick={handleLike}
      >
        {liked ? (
          <HeartIconSolid className="w-5 h-5 text-red-600" />
        ) : (
          <HeartIconOutline className="w-5 h-5 text-white" />
        )}
      </button>
      <span className="text-white">{likes}</span>
    </div>
  );
}

function ShareButton({ imageId, imageTitle }) {
  const handleShare = async (e) => {
    e.preventDefault(); // Prevent click from propagating to the Link

    const shareData = {
      title: imageTitle || "Check out this image!",
      text: "Check out this image on PixHorizon!",
      url: `${window.location.origin}/images/${imageId}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Image shared successfully");
      } catch (error) {
        console.error("Error sharing the image:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
        alert("Failed to copy link. Please try manually.");
      }
    }
  };

  return (
    <button
      className="p-2 rounded-full transition duration-300 hover:bg-gray-500"
      onClick={handleShare}
    >
      <ShareIcon className="w-5 h-5 text-white" />
    </button>
  );
}
