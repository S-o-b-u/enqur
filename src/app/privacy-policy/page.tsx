"use client";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <LightRays
          raysOrigin="top-center"
          raysColor="#8edaff"
          raysSpeed={1.5}
          lightSpread={2}
          rayLength={2}
          followMouse={true}
          mouseInfluence={0.09}
          noiseAmount={1}
          distortion={0.05}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top, #8edaff33 0%, #59c3ff11 70%, transparent 100%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main className="pt-28 sm:pt-32 px-7 sm:px-6 lg:px-12 max-w-4xl mx-auto pb-10 sm:pb-16">
        <h1 className="text-4xl font-bold text-[#8edaff] mb-6">Privacy Policy</h1>
        <p className="text-[#eafaff]/80 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <p className="mb-4">
          At <strong>Enqur</strong>, your privacy is our top priority. This policy explains how we
          collect, use, and protect your personal information.
        </p>

        <h2 className="text-2xl font-semibold text-[#8edaff] mt-8 mb-3">Data We Collect</h2>
        <ul className="list-disc ml-6 text-[#eafaff]/80 space-y-1">
          <li>Your email address when you sign up.</li>
          <li>Generated QR code details (URL or text).</li>
          <li>Usage analytics (e.g., scans count).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#8edaff] mt-8 mb-3">How We Use Your Data</h2>
        <p className="text-[#eafaff]/80 mb-4">
          We only use your data to provide QR generation services, improve our platform, and send
          updates if you opt in.
        </p>

        <h2 className="text-2xl font-semibold text-[#8edaff] mt-8 mb-3">Contact Us</h2>
        <p className="text-[#eafaff]/80">
          If you have any questions, email us at{" "}
          <a href="mailto:contact@enqur.com" className="text-[#8edaff] underline">
            pixlproxy@gmail.com
          </a>
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
