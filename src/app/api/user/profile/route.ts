import connectDB from "@/backend/db";
import User from "@/backend/models/User";
import { requireAuth } from "@/backend/middleware/auth";

export async function GET(req: Request) {
  await connectDB();
  const user = await requireAuth(req);

  const foundUser = await User.findById(user.id).select("-password");
  if (!foundUser) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ user: foundUser }), { status: 200 });
}

export async function PATCH(req: Request) {
  await connectDB();
  const user = await requireAuth(req);
  const { name, avatar, emailNotifications } = await req.json();

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;

  const updated = await User.findByIdAndUpdate(
    user.id,
    updateData,
    { new: true }
  ).select("-password");

  return new Response(JSON.stringify({ user: updated }), { status: 200 });
}
