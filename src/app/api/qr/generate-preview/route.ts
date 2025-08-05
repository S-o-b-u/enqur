import QRCode from "qrcode";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// ✅ Register Poppins font for serverless environments (Vercel)
import { fileURLToPath } from "url";

const fontPath = path.resolve("./public/fonts/Poppins-Black.ttf");
registerFont(fontPath, { family: "Poppins" });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link") || "";
    const design = searchParams.get("design") || "style1";
    const dotStyle = searchParams.get("dotStyle") || "square";
    const backgroundColor = searchParams.get("backgroundColor") || "#ffffff";
    const frameText = searchParams.get("frameText") || "";
    const resetToDefaultColors = searchParams.get("resetToDefaultColors") === "true";
    let foregroundColor = searchParams.get("foregroundColor") || "";

    // If resetToDefaultColors is true or foregroundColor is empty, use the default colors based on design
    const fgColor = resetToDefaultColors || !foregroundColor
      ? (design === "style2" ? "#4169E1" : design === "style3" ? "#FF6347" : "#000000")
      : foregroundColor;
    
    // Use default background color if resetToDefaultColors is true
    const bgColor = resetToDefaultColors ? "#ffffff" : backgroundColor;

    if (!link) return new Response("Missing link", { status: 400 });

    const qrData = await QRCode.create(link, { errorCorrectionLevel: "H" });

    // Canvas setup
    const size = 200;
    const cellSize = size / qrData.modules.size;
    const canvas = createCanvas(240, 280);
    const ctx = canvas.getContext("2d");

    // ✅ roundRect helper
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
    ctx.fillStyle = bgColor;
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

    // Draw QR code
    const qrStartX = (canvas.width - size) / 2;
    const qrStartY = 20;

    for (let row = 0; row < qrData.modules.size; row++) {
      for (let col = 0; col < qrData.modules.size; col++) {
        if (qrData.modules.get(col, row)) {
          const x = qrStartX + col * cellSize;
          const y = qrStartY + row * cellSize;
          ctx.fillStyle = fgColor;

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

    // Frame text overlay
    if (frameText.trim() !== "") {
      try {
        const text = frameText.toUpperCase();
        ctx.font = "16px Poppins"; // ✅ Use Poppins font
        const textWidth = ctx.measureText(text).width;
        const rectWidth = textWidth + 16;
        const rectHeight = 30;
        const rectX = canvas.width / 2 - rectWidth / 2;
        const rectY = canvas.height / 2 - rectHeight / 2 - 20;

        ctx.fillStyle = "rgba(255,255,255,0.85)";
        (ctx as any).roundRect(rectX, rectY, rectWidth, rectHeight, 8);
        ctx.fill();

        ctx.fillStyle = fgColor;
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, rectY + 20);
      } catch (error) {
        console.error("Error rendering frame text in preview:", error);
      }
    }

    // ENQUR Logo
    const logoPath = path.join(process.cwd(), "public/images/logo.jpg");
    try {
      const logo = await loadImage(logoPath);
      const logoWidth = 80;
      const logoHeight = 30;
      ctx.drawImage(
        logo,
        canvas.width / 2 - logoWidth / 2,
        230,
        logoWidth,
        logoHeight
      );
    } catch (err) {
      console.warn("Logo not found:", err);
    }

    // Return as PNG
    const pngBuffer = canvas.toBuffer("image/png");
    return new Response(new Uint8Array(pngBuffer), {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("QR Preview Error:", error);
    return new Response("Failed to generate preview", { status: 500 });
  }
}
