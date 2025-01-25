import jwt from "jsonwebtoken";

export async function POST(request) {

  try {
    const payload = await request.json(); 
    
    const token = jwt.sign(payload.uploadPayload, process.env.IMAGEKIT_PRIVATE_KEY, {
      expiresIn: payload.expireIn,
      header: {
        alg: "HS256",
        typ: "JWT",
        kid: process.env.IMAGEKIT_PUBLIC_KEY,
      },
    });

    return new Response(
      JSON.stringify({
        token,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating JWT:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate JWT token" }),
      { status: 500 }
    );
  }
}
