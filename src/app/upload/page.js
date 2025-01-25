"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";
import Link from "next/link";
import pica from "pica";

export default function Upload() {
  const { data: session, status } = useSession();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([]);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    } else {
      setMessage("Please upload a valid image file.");
    }
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleDelete = (i) => setTags(tags.filter((tag, index) => index !== i));
  const handleAddition = (tag) => {
    if (!tags.some((existingTag) => existingTag.text === tag.text)) {
      setTags([...tags, tag]);
    } else {
      setMessage("Duplicate tags are not allowed.");
    }
  };

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an image to upload.");
      return;
    }

    if (tags.length === 0) {
      setMessage("Please add at least one tag.");
      return;
    }

    if (!session?.user?.email) {
      return;
    }

    try {
      setIsUploadLoading(true);

      const picaInstance = pica();
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();

      const { naturalWidth: width, naturalHeight: height } = img;
      const aspectRatio = width / height;

      // Display Resolution of Image
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = Math.round(2048 / aspectRatio);
      await picaInstance.resize(img, canvas);
      const displayBlob = await picaInstance.toBlob(
        canvas,
        "image/jpeg",
        0.7
      );
      const displayBase64 = await blobToBase64(displayBlob);

      const authResponse1 = await fetch("/api/upload/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadPayload: {
            fileName: file.name,
            folder: "display_size",
          },
          expireIn: 3000,
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        }),
      });
      var { token } = await authResponse1.json();

      const displayImageFormData = new FormData();
      displayImageFormData.append("file", displayBase64);
      displayImageFormData.append("token", token);
      displayImageFormData.append("fileName", file.name);
      displayImageFormData.append("folder", "display_size");

      // Upload Display Image to ImageKit
      const uploadDisplayResponse = await fetch(
        "https://upload.imagekit.io/api/v2/files/upload",
        {
          method: "POST",
          body: displayImageFormData,
        }
      );

      // Original Resolution of Image
      const maxResolution = 25000000; // 25 MP
      if (width * height > maxResolution) {
        const newWidth = Math.sqrt(maxResolution * (aspectRatio - 0.1));
        canvas.width = Math.trunc(newWidth);
        canvas.height = Math.trunc(newWidth / aspectRatio);
        await picaInstance.resize(img, canvas);
      } else {
        canvas.width = width;
        canvas.height = height;
        await picaInstance.resize(img, canvas);
      }

      var originalBlob = await picaInstance.toBlob(
        canvas,
        "image/jpeg",
        1
      );
      const originalBuffer = await originalBlob.arrayBuffer();
      const fileSizeMB = originalBuffer.byteLength / (1024 * 1024);

      if (fileSizeMB > 30) {
        throw new Error("File size too large");
      } 
      else if (fileSizeMB > 20) {
        var originalBlob = await picaInstance.toBlob(canvas, "image/jpeg", 0.95);
      }
      const originalBase64 = await blobToBase64(originalBlob);

      const authResponse2 = await fetch("/api/upload/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadPayload: {
            fileName: file.name,
            folder: "original_size",
          },
          expireIn: 3000,
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        }),
      });
      var { token } = await authResponse2.json();

      const originalImageFormData = new FormData();
      originalImageFormData.append("file", originalBase64);
      originalImageFormData.append("token", token);
      originalImageFormData.append("fileName", file.name);
      originalImageFormData.append("folder", "original_size");

      // Upload Original Image to ImageKit
      const uploadOriginalResponse = await fetch(
        "https://upload.imagekit.io/api/v2/files/upload",
        {
          method: "POST",
          body: originalImageFormData,
        }
      );

      const uploadedDisplayData = await uploadDisplayResponse.json();
      const uploadedOriginalData = await uploadOriginalResponse.json();

      const formData = new FormData();
      formData.append("displaySrc", uploadedDisplayData.url);
      formData.append("originalSrc", uploadedOriginalData.url);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      tags.forEach((tag) => {
        formData.append("tags", tag.text); // Assuming tag is an object with a 'text' property
      }); // Convert tags to array of strings
      formData.append("width", uploadedDisplayData.width);
      formData.append("height", uploadedDisplayData.height);
      formData.append("userEmail", session.user.email);

      setIsUploadLoading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setMessage(data.message || "Image uploaded successfully!");
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image.");
    } finally {
      setIsUploadLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="px-4 md:px-20 py-8 bg-green-200">
        <h1 className="text-2xl font-bold mb-4 text-black">Upload Image</h1>
        {status === "loading" && (
          <>
            <div className="h-10 w-7/12 md:w-3/12 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
            <div className="h-10 w-6/12 md:w-2/12 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
            <div className="h-8 w-5/12 md:w-3/12 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
            <div className="h-16 w-full md:w-3/5 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
            <div className="h-8 w-full md:w-2/5 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
            <div className="h-10 w-3/12 md:w-1/12 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
          </>
        )}
        {status === "unauthenticated" && (
          <p className="mx-auto text-lg text-gray-700 fade-in">
            Please{" "}
            <Link href="/login" className="text-blue-600 underline">
              log in
            </Link>{" "}
            to upload the images.
          </p>
        )}
        {status === "authenticated" && (
          <div className="fade-in">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="block max-w-80 w-full text-black text-center p-2 border border-gray-400 rounded mt-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Title"
                value={title}
                required
                onChange={handleTitleChange}
                className="block mb-4 p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={category}
                onChange={handleCategoryChange}
                required
                className="block mb-4 p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Choose a category...
                </option>
                <option value="birds">Birds</option>
                <option value="wildlife">Wildlife</option>
                <option value="landscape">Landscape</option>
                <option value="butterfly">Butterfly</option>
                <option value="flowers">Flowers</option>
                <option value="abstract">Abstract</option>
              </select>

              <textarea
                value={description}
                onChange={handleDescriptionChange}
                required
                className="w-full max-w-2xl p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a small description..."
              />

              <ReactTags
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                autoFocus={false}
                separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
                required
                placeholder="Add search tags"
                classNames={{
                  tags: "-translate-y-3",
                  tagInputField:
                    "w-full max-w-xl p-2 border rounded-lg text-sm text-black mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  tag: "bg-blue-500 text-white p-1 text-sm rounded-lg mr-2",
                  remove: "ml-2 text-red-500 cursor-pointer",
                }}
              />

              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Upload
              </button>
            </form>
            {message && <p className="mt-4 text-black">* {message}</p>}

            {/* Loading Dialog */}
            {isUploadLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center text-black">
                  <div className="loader mb-4"></div> {/* Spinner */}
                  <p>
                    Almost there! Your photo is being uploaded to the gallery...
                  </p>
                </div>
              </div>
            )}

            {/* Success Dialog */}
            {isSuccessDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-white p-6 rounded shadow-lg text-center text-black">
                  <p>Upload complete! Your photo is now part of the gallery.</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
