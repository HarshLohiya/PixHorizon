import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";
import User from "@/models/User";
import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import sharp from "sharp"; // Import sharp for image processing

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.formData();
    const file = data.get("file");
    const title = data.get("title");
    const category = data.get("category");
    const userEmail = data.get("userEmail");
    const description = data.get("description");
    const tags = data.getAll("tags");

    if (!file) {
      throw new Error("No file uploaded");
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found");
    }

    // Convert file to buffer
    let buffer = Buffer.from(await file.arrayBuffer());

    // Resize and compress the image using sharp
    const displayBuffer = await sharp(buffer)
      .resize(2048)
      .jpeg({ quality: 70 })
      .toBuffer();

    const { width, height } = await sharp(buffer).metadata();
    const aspectRatio = width / height;
    const maxResolution = 25000000; // 25 MP

    if (width * height > maxResolution) {
      const newWidth = Math.sqrt(maxResolution * (aspectRatio - 0.1));

      buffer = await sharp(buffer)
        .resize(Math.trunc(newWidth))
        .jpeg({ quality: 100 })
        .toBuffer();
    }

    // Upload to ImageKit
    const uploadResponseDisplay = await new Promise((resolve, reject) => {
      imageKit.upload(
        {
          file: displayBuffer,
          fileName: file.name,
          folder: "display_size",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
    });

    const fileSizeInMB = buffer.length / (1024 * 1024);
    if (fileSizeInMB > 35) {
      throw new Error("File size too large");
    }
    else if (fileSizeInMB > 25) {
      buffer = await sharp(buffer)
        .resize(width)
        .jpeg({ quality: 90 })
        .toBuffer();
    }

    const uploadResponseOriginal = await new Promise((resolve, reject) => {
      imageKit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "original_size",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
    });

    // Save image data to MongoDB
    const newImage = await Image.create({
      displaySrc: uploadResponseDisplay.url,
      originalSrc: uploadResponseOriginal.url,
      title: title,
      category: category,
      description: description,
      tags: tags,
      width: uploadResponseDisplay.width,
      height: uploadResponseDisplay.height,
      like: 0,
      price: 25,
      user: user._id,
    });

    return NextResponse.json(
      { message: "Image created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { message: "Error creating image", error: error.message },
      { status: 400 }
    );
  }
}
