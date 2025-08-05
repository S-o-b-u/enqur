import mongoose from "mongoose";

const QRCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  link: { type: String, required: true },
  design: { type: String, default: "style1" },
  // Add new styling fields
  dotStyle: { type: String, enum: ['square', 'dots', 'rounded', 'classy', 'extra-rounded'], default: 'square' },
  cornerStyle: { type: String, enum: ['square', 'rounded', 'extra-rounded', 'dot'], default: 'square' },
  backgroundColor: { type: String, default: '#ffffff' },
  foregroundColor: { type: String, default: '#000000' },
  frameText: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.QRCode || mongoose.model("QRCode", QRCodeSchema);
