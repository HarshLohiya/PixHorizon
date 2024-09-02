"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  HeartIcon as HeartIconOutline,
  ArrowLeftIcon,
  ArrowsPointingOutIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ImagePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/api/images/${id}`);
      const data = await res.json();
      setImage(data);
      setLikes(data.likes);
    };

    const fetchComments = async () => {
      const res = await fetch(`/api/comments/${id}`);
      const data = await res.json();
      setComments(data);
    };

    if (id) {
      fetchImage();
      fetchComments();
    }
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleFullScreen = () => {
    const elem = document.getElementById("image-section");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      const res = await fetch("/api/comments/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId: id,
          username: session.user.name, // Use session user details
          comment: newComment,
        }),
      });

      const data = await res.json();
      setComments([data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  if (!image) return <div>Loading...</div>;

  return (
    <div className="bg-green-200">
      <Header />
      <div className="flex flex-col lg:flex-row p-4 px-12 min-h-screen">
        {/* Image Section */}
        <div
          id="image-section"
          className="w-full flex-col items-center relative"
        >
          <div className="relative bg-black rounded-lg w-full">
            <Image
              src={image.src}
              alt={image.title}
              width={image.width}
              height={image.height}
              className="w-full h-auto p-2"
              style={{ maxHeight: "90vh", objectFit: "contain" }}
            />
            {!isFullScreen && (
              <>
                <Link
                  href="/birds"
                  className="absolute top-4 left-4 bg-white bg-opacity-60 p-2 rounded-full shadow-lg text-black hover:bg-opacity-100"
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    className="p-2 rounded-full transition duration-300 hover:bg-gray-500"
                    onClick={handleLike}
                  >
                    {liked ? (
                      <HeartIconSolid className="w-5 h-5 text-red-600" />
                    ) : (
                      <HeartIconOutline className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <ShareButton imageUrl={`/images/${id}`} />
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-4">
                  <Link href={`/images/${image.nextId}`}>
                    <button className="bg-white bg-opacity-60 p-2 rounded-full shadow-lg text-black hover:bg-opacity-100">
                      <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                  </Link>
                  <Link href={`/images/${image.previousId}`}>
                    <button className="bg-white bg-opacity-60 p-2 rounded-full shadow-lg text-black hover:bg-opacity-100">
                      <ArrowLeftIcon className="w-6 h-6 rotate-180" />
                    </button>
                  </Link>
                </div>
                <button
                  onClick={handleFullScreen}
                  className="absolute bottom-4 left-4 bg-white bg-opacity-60 p-2 rounded-full shadow-lg text-black hover:bg-opacity-100"
                >
                  <ArrowsPointingOutIcon className="w-6 h-6" />
                </button>
              </>
            )}
            {isFullScreen && (
              <button
                onClick={exitFullScreen}
                className="absolute top-4 right-4 bg-white bg-opacity-60 p-2 rounded-full shadow-lg text-black"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full lg:w-2/5 lg:pl-6 lg:overflow-y-auto lg:h-full">
          <div className="mt-6 lg:mt-0">
            <h1 className="text-2xl font-bold">{image.title}</h1>
            <p className="mt-4">{image.description}</p>
            <p className="mt-2 text-sm text-gray-500">{image.category}</p>
          </div>
          {/* Comments Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Comments</h2>

            {session && (
              <form onSubmit={handleCommentSubmit} className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded text-black"
                  placeholder="Write a comment..."
                  required
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Post Comment
                </button>
              </form>
            )}

            <div className="mt-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="mb-4 p-2 border-b">
                    <p className="text-sm font-semibold">{comment.username}</p>
                    <p className="text-sm">{comment.comment}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ShareButton({ imageUrl }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this image!",
          url: window.location.origin + imageUrl,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + imageUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full transition duration-300 hover:bg-gray-500"
    >
      <ShareIcon className="w-5 h-5 text-white" />
    </button>
  );
}
