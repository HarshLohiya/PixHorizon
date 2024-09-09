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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`/api/images/${id}`);
        if (!res.ok) throw new Error("Failed to fetch image data.");
        const data = await res.json();
        setImage(data);
        setLikes(data.likes);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/${id}`);
        if (!res.ok) throw new Error("Failed to fetch comments.");
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };

    const checkIfInCart = async () => {
      if (session) {
        try {
          const res = await fetch("/api/cart", {
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (res.ok) {
            const cartItems = await res.json();
            const itemInCart = cartItems.some(
              (item) => item.imageId._id === id
            );
            setIsInCart(itemInCart);
          }
        } catch (error) {
          console.error("Failed to check cart status:", error);
        }
      }
    };

    if (id) {
      fetchImage();
      fetchComments();
      checkIfInCart(); // Check if the image is in the cart when the component mounts
    }
  }, [id, session]);

  const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(newLikedState ? likes + 1 : likes - 1);

    try {
      const res = await fetch(`/api/images/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          liked: newLikedState,
        }),
      });

      if (!res.ok) {
        // Revert state if request fails
        setLiked(!newLikedState);
        setLikes(newLikedState ? likes - 1 : likes + 1);
        throw new Error("Failed to update like.");
      }
    } catch (error) {
      console.error("Failed to update like:", error);
    }
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

      if (!res.ok) throw new Error("Failed to post comment.");

      const data = await res.json();
      setComments([data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      alert("You must be logged in to add items to the cart.");
      router.push("/login");
      return;
    }

    setIsAddingToCart(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId: id }),
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart.");
      }

      alert("Image added to cart!");
      setIsInCart(true); 
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
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
              priority={true}
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

            {/* Add to Cart Button */}
            <div className="mt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || isInCart}
                className={`px-4 py-2 font-semibold text-white rounded-lg transition ${
                  isInCart ? "bg-gray-400 hover:bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isInCart ? "Already in Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
          {/* Comments Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold border-b pb-2">Comments</h2>

            {session && (
              <form onSubmit={handleCommentSubmit} className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a comment..."
                  required
                />
                <button
                  type="submit"
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Post Comment
                </button>
              </form>
            )}

            <div className="mt-6 space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <p className="text-sm font-semibold text-blue-600">
                    {comment.username}
                  </p>
                  <p className="text-sm mt-1 text-black">{comment.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>

                  {/* Display Replies */}
                  <div className="ml-6 mt-4 space-y-4">
                    {comment.replies &&
                      comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="p-3 border rounded-lg bg-white shadow-sm"
                        >
                          <p className="text-sm font-semibold text-green-600">
                            {reply.username}
                          </p>
                          <p className="text-sm mt-1 text-black">
                            {reply.comment}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                  </div>

                  {/* Reply Form */}
                  {session && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const reply = e.target.reply.value;
                        try {
                          const res = await fetch(
                            `/api/comments/${image._id}/${comment._id}/reply`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                username: session.user.name,
                                reply,
                              }),
                            }
                          );

                          if (!res.ok) throw new Error("Failed to post reply.");

                          const data = await res.json();
                          setComments((prevComments) =>
                            prevComments.map((c) =>
                              c._id === comment._id ? data : c
                            )
                          );
                          e.target.reset();
                        } catch (error) {
                          console.error("Failed to post reply:", error);
                        }
                      }}
                      className="ml-6 mt-4"
                    >
                      <textarea
                        name="reply"
                        className="w-full p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write a reply..."
                        required
                      />
                      <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Post Reply
                      </button>
                    </form>
                  )}
                </div>
              ))}
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