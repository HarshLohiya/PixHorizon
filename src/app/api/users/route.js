import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  try {
    await dbConnect();

    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    })
      .populate("followers", "username") // Populate followers with username
      .populate("following", "username");

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
