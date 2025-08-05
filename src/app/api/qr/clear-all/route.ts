import connectDB from "@/backend/db";
import QRModel from "@/backend/models/QRCode";
import { requireAuth } from "@/backend/middleware/auth";

export async function DELETE(req: Request) {
  await connectDB();
  const user = await requireAuth(req);

  // Delete all QR codes for this user
  const result = await QRModel.deleteMany({ userId: user.id });

  return new Response(JSON.stringify({ 
    success: true, 
    deleted: result.deletedCount 
  }), { status: 200 });
}