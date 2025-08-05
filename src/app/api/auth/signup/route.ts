import connectDB from "@/backend/db";
import User from "@/backend/models/User";
import bcrypt from "bcryptjs";
import { createToken } from "@/backend/utils/jwt";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing) return new Response(JSON.stringify({ error: "User exists" }), { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  const token = createToken(user._id.toString());

  return new Response(JSON.stringify({ token }), { status: 201 });
}
