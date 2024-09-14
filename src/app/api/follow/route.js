import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { targetUsername, currentUserId } = await req.json();

    // Fetch the userId of the target user from their username
    console.log(targetUsername);
    const targetUser = await User.findOne({
      username: { $regex: new RegExp(`^${targetUsername}$`, "i") },
    });
    if (!targetUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Fetch the current user's data
    console.log(currentUserId)
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return new Response(JSON.stringify({ message: "Current User not found" }), {
        status: 404,
      });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow logic
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      // Follow logic
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    return new Response(
      JSON.stringify({
        message: isFollowing
          ? "Unfollowed successfully"
          : "Followed successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
