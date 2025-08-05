"use client";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
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
        <h1 className="text-4xl font-bold text-[#8edaff] mb-6">Cookie Policy</h1>
        <p className="text-[#eafaff]/80 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <p className="mb-4">
          This Cookie Policy explains how <strong>Enqur</strong> uses cookies and similar technologies
          to improve your experience.
        </p>

        <h2 className="text-2xl font-semibold text-[#8edaff] mt-8 mb-3">What Are Cookies?</h2>
        <p className="text-[#eafaff]/80 mb-4">
          Cookies are small text files stored on your device to help websites function and enhance
          user experience.
        </p>

        <h2 className="text-2xl font-semibold text-[#8edaff] mt-8 mb-3">How We Use Cookies</h2>
        <ul className="list-disc ml-6 text-[#eafaff]/80 space-y-1">
          <li>Authentication and keeping you logged in.</li>
          <li>Analytics to improve QR generation features.</li>
          <li>Remembering your preferences.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#8edaff] mt-8 mb-3">Managing Cookies</h2>
        <p className="text-[#eafaff]/80">
          You can disable cookies in your browser settings, but some features of Enqur may not work
          properly without them.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
