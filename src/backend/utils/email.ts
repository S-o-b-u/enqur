import nodemailer from "nodemailer";

// ✅ Export transporter so it can be used in other routes (like test-email)
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email template for QR code generation
export const sendQRCodeGenerationEmail = async (
  userEmail: string,
  qrLink: string,
  qrDesign: string,
  dotStyle?: string,
  cornerStyle?: string,
  backgroundColor?: string,
  foregroundColor?: string,
  frameText?: string
) => {
  try {
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
    console.log("SMTP CREDENTIALS:", {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    });

    let qrPreviewUrl = `/api/qr/generate-preview?link=${encodeURIComponent(
      qrLink
    )}&design=${encodeURIComponent(qrDesign)}`;
    if (dotStyle) qrPreviewUrl += `&dotStyle=${encodeURIComponent(dotStyle)}`;
    if (cornerStyle)
      qrPreviewUrl += `&cornerStyle=${encodeURIComponent(cornerStyle)}`;
    if (backgroundColor)
      qrPreviewUrl += `&backgroundColor=${encodeURIComponent(backgroundColor)}`;
    if (foregroundColor)
      qrPreviewUrl += `&foregroundColor=${encodeURIComponent(foregroundColor)}`;
    if (frameText)
      qrPreviewUrl += `&frameText=${encodeURIComponent(frameText)}`;

    await transporter.sendMail({
      from: `"Enqur QR Code" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your QR Code has been generated!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #59c3ff; text-align:center;">Your QR Code is Ready!</h1>
          <p>Hello,</p>
          <p>Your QR code has been successfully generated. Here are the details:</p>
          <ul>
            <li><strong>Link:</strong> ${qrLink}</li>
            <li><strong>Design:</strong> ${qrDesign}</li>
            ${
              dotStyle ? `<li><strong>Dot Style:</strong> ${dotStyle}</li>` : ""
            }
            ${
              cornerStyle
                ? `<li><strong>Corner Style:</strong> ${cornerStyle}</li>`
                : ""
            }
            ${
              backgroundColor
                ? `<li><strong>Background Color:</strong> ${backgroundColor}</li>`
                : ""
            }
            ${
              foregroundColor
                ? `<li><strong>Foreground Color:</strong> ${foregroundColor}</li>`
                : ""}
            ${
              frameText
                ? `<li><strong>Frame Text:</strong> ${frameText}</li>`
                : ""}
          </ul>
          <p>You can view and download your QR code from your dashboard.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL
            }/dashboard" style="background-color: #59c3ff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
