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

// export const config = {
//   api: {
//     bodyParser: false, // Disable the default bodyParser to handle file uploads
//   },
// };

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.formData();
    const file = data.get("file");
    const title = data.get("title");
    const category = data.get("category");
    const userEmail = data.get("userEmail")

    if (!file) {
      throw new Error("No file uploaded");
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found");
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Resize and compress the image using sharp
    const resizedBuffer = await sharp(buffer)
      .resize(2048) // Resize to 800px width, maintain aspect ratio
      .jpeg({ quality: 70 }) // Compress to 70% quality as JPEG
      .toBuffer();

    // Upload to ImageKit
    const uploadResponse = await new Promise((resolve, reject) => {
      imageKit.upload(
        {
          file: resizedBuffer, // Use the resized and compressed buffer
          fileName: file.name,
          folder: "your_folder_name", // optional
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
    });

    // Save image data to MongoDB
    const newImage = await Image.create({
      src: uploadResponse.url, // ImageKit.io provides the URL directly
      title: title,
      category: category,
      width: uploadResponse.width, // Assuming ImageKit.io provides width
      height: uploadResponse.height, // Assuming ImageKit.io provides height
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
