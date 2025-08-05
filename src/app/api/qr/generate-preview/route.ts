import QRCode from "qrcode";
import { createCanvas, loadImage } from "canvas";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link") || "";
    const design = searchParams.get("design") || "style1";
    const dotStyle = searchParams.get("dotStyle") || "square";
    const backgroundColor = searchParams.get("backgroundColor") || "#ffffff";
    const frameText = searchParams.get("frameText") || "";
    let foregroundColor = searchParams.get("foregroundColor") || "";

    if (!foregroundColor) {
      foregroundColor =
        design === "style2"
          ? "#4169E1"
          : design === "style3"
          ? "#FF6347"
          : "#000000";
    }

    if (!link) return new Response("Missing link", { status: 400 });

    const qrData = await QRCode.create(link, { errorCorrectionLevel: "H" });
    // Make preview QR code smaller than the generated one (200px instead of 300px)
    const size = 200;
    const cellSize = size / qrData.modules.size;
    const canvas = createCanvas(240, 280);
    const ctx = canvas.getContext("2d");

    // ✅ Attach roundRect to the context instance
    if (!(ctx as any).roundRect) {
      (ctx as any).roundRect = function (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) {
        const radius =
          typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
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
    ctx.fillStyle = backgroundColor;
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

    // Draw QR modules - centered in the 240x280 canvas
    const qrStartX = (canvas.width - size) / 2; // Center horizontally
    const qrStartY = 20; // Position from top

    for (let row = 0; row < qrData.modules.size; row++) {
      for (let col = 0; col < qrData.modules.size; col++) {
        if (qrData.modules.get(col, row)) {
          const x = qrStartX + col * cellSize;
          const y = qrStartY + row * cellSize;
          ctx.fillStyle = foregroundColor;

          if (isFinderPattern(row, col)) {
            ctx.fillRect(x, y, cellSize, cellSize);
          } else if (dotStyle === "dots") {
            ctx.beginPath();
            ctx.arc(
              x + cellSize / 2,
              y + cellSize / 2,
              cellSize / 3,
              0,
              Math.PI * 2
            );
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

    // Frame text overlay - smaller for preview
    if (frameText.trim() !== "") {
      const text = frameText.toUpperCase();
      ctx.font = "bold 16px Arial"; // Smaller font for preview
      const textWidth = ctx.measureText(text).width;
      const rectWidth = textWidth + 16;
      const rectHeight = 30;
      const rectX = canvas.width / 2 - rectWidth / 2;
      const rectY = canvas.height / 2 - rectHeight / 2 - 20;

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      (ctx as any).roundRect(rectX, rectY, rectWidth, rectHeight, 8);
      ctx.fill();

      ctx.fillStyle = foregroundColor;
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, rectY + 20);
    }

    // ENQUR logo image (instead of font text) - smaller for preview
    const logoPath = path.join(process.cwd(), "public/images/logo.jpg");
    try {
      const logo = await loadImage(logoPath);
      const logoWidth = 80; // Smaller logo for preview
      const logoHeight = 30; // Smaller logo for preview
      ctx.drawImage(
        logo,
        canvas.width / 2 - logoWidth / 2,
        230, // Adjusted position for smaller canvas
        logoWidth,
        logoHeight
      );
    } catch (err) {
      console.warn("Logo not found:", err);
    }

    const pngBuffer = canvas.toBuffer("image/png");
    return new Response(new Uint8Array(pngBuffer), {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("QR Preview Error:", error);
    return new Response("Failed to generate preview", { status: 500 });
  }
}
