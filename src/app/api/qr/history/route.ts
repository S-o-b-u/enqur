import connectDB from "@/backend/db";
import QRModel from "@/backend/models/QRCode";
import { requireAuth } from "@/backend/middleware/auth";

export async function GET(req: Request) {
  await connectDB();
  const user = await requireAuth(req);
  const history = await QRModel.find({ userId: user.id }).sort({ createdAt: -1 });
  return new Response(JSON.stringify({ history }), { status: 200 });
}
