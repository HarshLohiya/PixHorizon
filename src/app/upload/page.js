"use client";

import Header from "@/components/Header";
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setMessage(data.message);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image.");
    }
  };

  return (
    <div className="bg-green-200 h-screen">
      <Header />
      <div className="p-8 container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="block mb-4"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            required
            onChange={handleTitleChange}
            className="block mb-4 p-2 border border-gray-300 rounded text-black"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            required={true}
            className="block mb-4 p-2 border border-gray-300 rounded text-black"
          >
            <option value="" disabled>Choose a category...</option>
            <option value="birds">Birds</option>
            <option value="wildlife">Wildlife</option>
            <option value="landscape">Landscape</option>
            <option value="butterfly">Butterfly</option>
            <option value="flowers">Flowers</option>
            <option value="abstract">Abstract</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Upload
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
}
