import connectDB from "@/backend/db";
import QRModel from "@/backend/models/QRCode";
import User from "@/backend/models/User";
import { requireAuth } from "@/backend/middleware/auth";
import { sendQRCodeGenerationEmail } from "@/backend/utils/email";
import QRCode from "qrcode";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";

// ✅ Register Poppins font
const fontPath = path.join(process.cwd(), "public/fonts/Poppins-Black.ttf");
registerFont(fontPath, { family: "Poppins" });

export async function POST(req: Request) {
  await connectDB();
  const user = await requireAuth(req);
  const { link, design, dotStyle, cornerStyle, backgroundColor, foregroundColor, frameText } = await req.json();

  const fgColor =
    foregroundColor || (design === "style2" ? "#4169E1" : design === "style3" ? "#FF6347" : "#000000");

  const qrData = await QRCode.create(link, { errorCorrectionLevel: "H" });
  const size = 300;
  const cellSize = size / qrData.modules.size;
  const canvas = createCanvas(340, 400);
  const ctx = canvas.getContext("2d");

  // Attach roundRect to context if missing
  if (!(ctx as any).roundRect) {
    (ctx as any).roundRect = function (x: number, y: number, w: number, h: number, r: number) {
      const radius = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
      this.beginPath();
      this.moveTo(x + radius.tl, y);
      this.lineTo(x + w - radius.tr, y);
      this.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
      this.lineTo(x + w, y + h - radius.br);
      this.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
      this.lineTo(x + radius.bl, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
      this.lineTo(x, y + radius.tl);
      this.quadraticCurveTo(x, y, x + radius.tl, y);
      this.closePath();
      return this;
    };
  }

  // Background
  ctx.fillStyle = backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Finder pattern detection
  const isFinderPattern = (row: number, col: number) => {
    const sizeFinder = 7;
    const max = qrData.modules.size;
    return (
      (row < sizeFinder && col < sizeFinder) ||
      (row < sizeFinder && col >= max - sizeFinder) ||
      (row >= max - sizeFinder && col < sizeFinder)
    );
  };

  // Draw QR modules (finder patterns included)
  for (let row = 0; row < qrData.modules.size; row++) {
    for (let col = 0; col < qrData.modules.size; col++) {
      if (qrData.modules.get(col, row)) {
        const x = 20 + col * cellSize;
        const y = 20 + row * cellSize;
        ctx.fillStyle = fgColor;

        if (isFinderPattern(row, col)) {
          ctx.fillRect(x, y, cellSize, cellSize);
        } else if (dotStyle === "dots") {
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (dotStyle === "rounded") {
          ctx.beginPath();
          (ctx as any).roundRect(x, y, cellSize, cellSize, 2);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }
  }

  // Frame text
  if (frameText && frameText.trim() !== "") {
    try {
      const text = frameText.toUpperCase();
      ctx.font = "bold 22px Poppins"; // ✅ Use Poppins font
      const textWidth = ctx.measureText(text).width;
      const rectWidth = textWidth + 20;
      const rectHeight = 40;
      const rectX = canvas.width / 2 - rectWidth / 2;
      const rectY = canvas.height / 2 - rectHeight / 2 - 40;

      ctx.fillStyle = "rgba(255,255,255,0.95)";
      (ctx as any).roundRect(rectX, rectY, rectWidth, rectHeight, 12);
      ctx.fill();

      ctx.fillStyle = fgColor;
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, rectY + 27);
    } catch (error) {
      console.error("Error rendering frame text:", error);
    }
  }

  // Logo (from file)
  const logoPath = path.join(process.cwd(), "public/images/logo.jpg");
  if (fs.existsSync(logoPath)) {
    const logo = await loadImage(logoPath);
    const logoWidth = 100;
    const logoHeight = 40;
    ctx.drawImage(logo, canvas.width / 2 - logoWidth / 2, 340, logoWidth, logoHeight);
  }

  const qrImageBuffer = canvas.toBuffer("image/png");
  const finalQrDataUrl = `data:image/png;base64,${qrImageBuffer.toString("base64")}`;

  // Save to DB
  await QRModel.create({
    userId: user.id,
    link,
    design,
    dotStyle,
    cornerStyle,
    backgroundColor,
    foregroundColor,
    frameText,
  });

  const userDoc = await User.findById(user.id);
  if (userDoc && userDoc.emailNotifications) {
    await sendQRCodeGenerationEmail(
      userDoc.email,
      link,
      design,
      dotStyle,
      cornerStyle,
      backgroundColor,
      foregroundColor,
      frameText
    );
  }

  return new Response(JSON.stringify({ image: finalQrDataUrl }), { status: 200 });
}
