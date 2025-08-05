import connectDB from "@/backend/db";
import User from "@/backend/models/User";
import bcrypt from "bcryptjs";
import { createToken } from "@/backend/utils/jwt";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return new Response(JSON.stringify({ error: "Invalid password" }), { status: 400 });

  const token = createToken(user._id.toString());
  return new Response(JSON.stringify({ token }), { status: 200 });
}
