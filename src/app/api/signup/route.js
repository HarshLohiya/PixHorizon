// app/api/auth/signup/route.js
import { hash } from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.formData();
    const username = data.get("username");
    const fullName = data.get("fullName");
    const email = data.get("email");
    const password = data.get("password");

    // const { username, email, password } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return new Response(
        JSON.stringify({ error: "Username is already taken!" }),
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user creation:", error);
    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500,
    });
  }
}
