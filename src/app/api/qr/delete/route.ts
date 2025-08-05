import connectDB from "@/backend/db";
import QRModel from "@/backend/models/QRCode";
import { requireAuth } from "@/backend/middleware/auth";

export async function DELETE(req: Request) {
  await connectDB();
  const user = await requireAuth(req);
  const { searchParams } = new URL(req.url);
  const qrId = searchParams.get("id");

  if (!qrId) {
    return new Response(JSON.stringify({ error: "QR ID is required" }), { status: 400 });
  }

  // Find the QR code and verify it belongs to the user
  const qr = await QRModel.findById(qrId);
  if (!qr) {
    return new Response(JSON.stringify({ error: "QR code not found" }), { status: 404 });
  }

  // Verify ownership
  if (qr.userId.toString() !== user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  // Delete the QR code
  await QRModel.findByIdAndDelete(qrId);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}