"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FiLink,
  FiDownload,
  FiSettings,
  FiZap,
  FiShield,
  FiUsers,
  FiTrendingUp,
  FiStar,
  FiAward,
  FiGrid,
  FiSquare,
  FiCircle,
  FiSliders,
  FiDroplet,
  FiType,
} from "react-icons/fi";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const [link, setLink] = useState("");
  const [style, setStyle] = useState("style1");
  const [dotStyle, setDotStyle] = useState("square");
  // cornerStyle is not applicable and will be phased out
  const [cornerStyle, setCornerStyle] = useState("square");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [foregroundColor, setForegroundColor] = useState("");
  const [resetToDefaultColors, setResetToDefaultColors] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [qr, setQr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [frameText, setFrameText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const generateQR = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          link,
          design: style,
          dotStyle,
          cornerStyle: "square", // Default to square as cornerStyle is not applicable
          backgroundColor,
          foregroundColor,
          frameText,
          resetToDefaultColors,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setQr(data.image);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Add this new function
  const generatePreviewQR = async () => {
    if (!link) return; // don't generate without a link
    try {
      const query = new URLSearchParams({
        link,
        design: style,
        dotStyle,
        cornerStyle: "square", // Default to square as cornerStyle is not applicable
        backgroundColor,
        foregroundColor,
        frameText,
        resetToDefaultColors: resetToDefaultColors.toString(),
      }).toString();

      const res = await fetch(`/api/qr/generate-preview?${query}`);
      if (!res.ok) throw new Error("Failed to generate preview");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setQr(url); // set preview image
    } catch (err) {
      console.error("Preview generation failed:", err);
    }
  };

  // Call preview on changes
  useEffect(() => {
    generatePreviewQR();
  }, [
    link,
    style,
    dotStyle,
    backgroundColor,
    foregroundColor,
    frameText,
    resetToDefaultColors,
  ]);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qr;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Generate QR codes in milliseconds with our optimized algorithms",
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never stored permanently",
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "User Friendly",
      description: "Intuitive interface designed for everyone",
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Analytics",
      description: "Track scan statistics and insights",
    },
  ];

  const stats = [
    { number: "500+", label: "QR Codes Generated" },
    { number: "100+", label: "Scans Tracked" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* LightRays Background */}
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
          className="custom-rays"
        />
        {/* Subtle blue gradient overlay for extra glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top, #8edaff33 0%, #59c3ff11 70%, transparent 100%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* Navigation Bar */}
      <Navbar activePage="home" />

      <div className="pt-28 sm:pt-32 px-7 xs:px-3 sm:px-6 lg:px-12 max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto pb-10 sm:pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h1
            className="text-4xl xs:text-5xl md:text-7xl font-extrabold mb-5 sm:mb-6 text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #8edaff 0%, #59c3ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              filter: "drop-shadow(0 4px 32px #8edaff55)",
              textShadow: "0 2px 24px #59c3ff44",
              borderRadius: 0,
              display: "inline-block",
            }}
          >
            Where URLs Get a Makeover
          </h1>
          <p className="text-[#eafaff] px-9 max-w-2xl mx-auto text-lg sm:text-xl font-medium drop-shadow-lg">
            Enqur - because every scan should tell a story!
          </p>
        </motion.div>

        {/* QR Generator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto mb-16"
        >
          <form
            className="w-full bg-black/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_0_rgba(0,0,0,0.15)] border border-[#2226] px-3 xs:px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col gap-5 sm:gap-7"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading && link) {
                generateQR();
              }
            }}
            style={{
              boxShadow: "0 8px 40px 0 rgba(0,0,0,0.15)",
              maxWidth: "100%",
            }}
          >
            <div className="relative group">
              <FiLink className="absolute left-4 top-7 transform -translate-y-1/2 text-[#8edaff] group-hover:text-[#59c3ff] transition-colors" />
              <input
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-black/20 border border-[#2228] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8edaff] focus:border-transparent text-white placeholder-[#8edaff99] transition-all duration-300 backdrop-blur-sm shadow-inner text-base sm:text-lg"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Your Links Deserve a Glow-Up . . ."
                style={{
                  fontSize: "1.08rem",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  background: "rgba(10,10,10,0.40)",
                }}
              />
              <div className="relative group mt-4">
                <FiType className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8edaff] group-hover:text-[#59c3ff] transition-colors" />
                <input
                  type="text"
                  value={frameText}
                  onChange={(e) => setFrameText(e.target.value)}
                  placeholder="Enter frame text e.g. SCAN ME"
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-[#2228] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8edaff] focus:border-transparent text-white placeholder-[#8edaff99] transition-all duration-300 backdrop-blur-sm shadow-inner text-base"
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    background: "rgba(10,10,10,0.40)",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="relative group flex-1">
                  <FiSettings className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8edaff] group-hover:text-[#59c3ff] transition-colors" />
                  <div className="relative">
                    <select
                      className="w-full pl-12 pr-10 py-3 sm:py-4 bg-black/20 border border-[#2228] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8edaff] focus:border-transparent text-white transition-all duration-300 appearance-none backdrop-blur-sm shadow-inner text-base sm:text-lg"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 500,
                        background: "rgba(10,10,10,0.40)",
                      }}
                    >
                      <option
                        value="style1"
                        className="bg-[#111] text-white py-2"
                      >
                        Classic Black
                      </option>
                      <option
                        value="style2"
                        className="bg-[#111] text-white py-2"
                      >
                        Royal Blue
                      </option>
                      <option
                        value="style3"
                        className="bg-[#111] text-white py-2"
                      >
                        Sunset Gradient
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#8edaff]">
                      <svg
                        className="fill-current h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="bg-black/30 border border-[#2228] text-[#8edaff] py-3 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-black/40 transition-all duration-300"
                >
                  <FiSliders className="w-5 h-5" />
                  {showAdvancedOptions ? "Hide Options" : "Style Options"}
                </motion.button>
              </div>

              {/* Advanced QR Styling Options */}
              {showAdvancedOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/30 backdrop-blur-md rounded-xl border border-[#2228] p-4 space-y-4"
                >
                  <h3 className="text-[#8edaff] font-medium mb-2">
                    Advanced QR Styling
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dot Style Selection */}
                    <div className="space-y-2">
                      <label className="text-[#eafaff] text-sm flex items-center gap-1">
                        <FiGrid className="w-4 h-4" /> Dot Style
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 bg-black/20 border border-[#2228] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8edaff] text-white text-sm appearance-none pr-8 hover:bg-black/30 transition-colors backdrop-blur-sm shadow-inner"
                          value={dotStyle}
                          onChange={(e) => setDotStyle(e.target.value)}
                          style={{
                            background: "rgba(10,10,10,0.40)",
                          }}
                        >
                          <option
                            value="square"
                            className="bg-[#111] text-white py-2"
                          >
                            Square (Default)
                          </option>
                          <option
                            value="dots"
                            className="bg-[#111] text-white py-2"
                          >
                            Dots
                          </option>
                          <option
                            value="rounded"
                            className="bg-[#111] text-white py-2"
                          >
                            Rounded
                          </option>
                          <option
                            value="classy"
                            className="bg-[#111] text-white py-2"
                          >
                            Classy
                          </option>
                          <option
                            value="extra-rounded"
                            className="bg-[#111] text-white py-2"
                          >
                            Extra Rounded
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8edaff]">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Reset to Default Colors Button */}
                    <div className="space-y-2">
                      <label className="text-[#eafaff] text-sm flex items-center gap-1">
                        <FiSquare className="w-4 h-4" /> Default Colors
                      </label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setResetToDefaultColors(!resetToDefaultColors);
                            if (resetToDefaultColors) {
                              // If turning off reset, keep current colors
                              setBackgroundColor(backgroundColor);
                              setForegroundColor(foregroundColor);
                            }
                          }}
                          className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8edaff] text-white text-sm transition-colors backdrop-blur-sm shadow-inner ${resetToDefaultColors ? 'bg-[#8edaff] text-[#0e2233]' : 'bg-black/20 border border-[#2228]'}`}
                          style={{
                            background: resetToDefaultColors ? "#8edaff" : "rgba(10,10,10,0.40)",
                          }}
                        >
                          {resetToDefaultColors ? 'Using Default Colors' : 'Reset to Default Colors'}
                        </button>
                      </div>
                    </div>

                    {/* Background Color */}
                    <div className="space-y-2">
                      <label className="text-[#eafaff] text-sm flex items-center gap-1">
                        <FiDroplet className="w-4 h-4" /> Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className={`w-10 h-10 rounded-full overflow-hidden ${resetToDefaultColors ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'} border-2 border-[#8edaff33] transition-transform shadow-md`}
                          disabled={resetToDefaultColors}
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className={`flex-1 px-4 py-3 bg-black/20 border border-[#2228] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8edaff] text-white text-sm backdrop-blur-sm shadow-inner ${resetToDefaultColors ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="#ffffff"
                          style={{
                            background: "rgba(10,10,10,0.40)",
                          }}
                          disabled={resetToDefaultColors}
                        />
                      </div>
                    </div>

                    {/* Foreground Color */}
                    <div className="space-y-2">
                      <label className="text-[#eafaff] text-sm flex items-center gap-1">
                        <FiCircle className="w-4 h-4" /> Foreground Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={
                            foregroundColor ||
                            (style === "style2"
                              ? "#4169E1"
                              : style === "style3"
                              ? "#FF6347"
                              : "#000000")
                          }
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className={`w-10 h-10 rounded-full overflow-hidden ${resetToDefaultColors ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'} border-2 border-[#8edaff33] transition-transform shadow-md`}
                          disabled={resetToDefaultColors}
                        />
                        <input
                          type="text"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className={`flex-1 px-4 py-3 bg-black/20 border border-[#2228] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8edaff] text-white text-sm backdrop-blur-sm shadow-inner ${resetToDefaultColors ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder={
                            style === "style2"
                              ? "#4169E1"
                              : style === "style3"
                              ? "#FF6347"
                              : "#000000"
                          }
                          style={{
                            background: "rgba(10,10,10,0.40)",
                          }}
                          disabled={resetToDefaultColors}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex justify-center sm:justify-end">
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading && link) {
                    generateQR();
                  }
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#8edaff] to-[#59c3ff] text-[#0e2233] font-bold py-3 sm:py-4 px-7 sm:px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8edaff] focus:ring-offset-2 focus:ring-offset-transparent tracking-wide text-base sm:text-lg"
                disabled={isLoading || !link}
                style={{
                  boxShadow: "0 4px 24px 0 #8edaff44",
                  fontSize: "1.08rem",
                  letterSpacing: "0.01em",
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-[#0e2233] border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  "Generate QR"
                )}
                
              </motion.button>
            </div>

            {qr && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center mt-2"
              >
                <div className="p-4 sm:p-6 bg-black/20 backdrop-blur-md rounded-xl border border-[#2228] shadow-lg">
                  <img
                    src={qr}
                    alt="Generated QR Code"
                    className="max-w-[180px] sm:max-w-[220px] md:max-w-[260px] rounded-lg shadow-[0_4px_32px_0_rgba(94,210,255,0.10)] border border-[#8edaff22] bg-white"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadQR}
                  className="mt-6 bg-gradient-to-r from-[#59c3ff] to-[#8edaff] text-[#0e2233] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-300 font-bold flex items-center gap-2 shadow-lg hover:shadow-xl border border-[#8edaff33] text-base sm:text-lg"
                  style={{
                    fontSize: "1.05rem",
                    letterSpacing: "0.01em",
                    boxShadow: "0 4px 24px 0 #8edaff44",
                  }}
                >
                  <FiDownload className="h-5 w-5" />
                  Download QR
                </motion.button>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-[#2226]"
            >
              <div className="text-2xl md:text-3xl font-bold text-[#8edaff] mb-2">
                {stat.number}
              </div>
              <div className="text-[#eafaff]/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #8edaff 0%, #59c3ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Why Choose Enqur?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-[#2226] text-center hover:border-[#8edaff33] transition-all duration-300"
              >
                <div className="text-[#8edaff] mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-[#eafaff] font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#eafaff]/70 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #8edaff 0%, #59c3ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                content:
                  "Enqur has revolutionized our QR code strategy. The analytics are incredible!",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "Startup Founder",
                content:
                  "Fast, reliable, and beautiful QR codes. Exactly what we needed for our product launch.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Event Planner",
                content:
                  "Perfect for our events! The custom designs make our QR codes stand out.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-[#2226]"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-[#eafaff]/80 text-sm mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="text-[#8edaff] font-semibold text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-[#eafaff]/60 text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-[#2226]"
        >
          <FiAward className="w-12 h-12 text-[#8edaff] mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#eafaff] mb-4">
            Ready to Transform Your Links?
          </h2>
          <p className="text-[#eafaff]/70 mb-6 max-w-2xl mx-auto">
            Join thousands of users who are already creating beautiful QR codes
            with Enqur. Start your journey today!
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-[#8edaff] to-[#59c3ff] text-[#0e2233] font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
