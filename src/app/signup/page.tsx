"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiGrid } from "react-icons/fi";
import Image from "next/image";
import RippleGrid from "@/components/RippleGrid";
import FadeContent from "@/components/FadeContent";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row text-white overflow-hidden">
      {/* RippleGrid Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
         <RippleGrid
          enableRainbow={false}
          gridColor="#ffffff"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={0.8}
        />
      </div>
      
  

      {/* Left Section */}
      <div className="md:w-3/5 relative p-4 md:p-6 flex items-center justify-center min-h-[25vh] md:min-h-screen overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl relative font-bold mb-4 flex items-center flex-wrap justify-center md:justify-start"
          >
            <span className="mt-4 md:mt-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Welcome to </span>
            <Image
              src="/images/logo.png"
              alt="Enqur Logo"
              width={250}
              height={25}
              className="ml-2 md:ml-3 mr-1 w-[120px] md:w-[250px] h-auto"
              priority
            />
            <span className="text-4xl md:text-6xl text-purple-400">!</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base text-white/80 leading-relaxed"
          >
            Create an account to start your journey with us. Join our community
            and explore endless possibilities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-8 relative z-10 border border-white/10"
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-3">Why Choose Us?</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></span>
                Generate beautiful QR codes instantly
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></span>
                Customize designs to match your brand
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></span>
                Track QR code analytics in real-time
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Border Image - Only visible on medium screens and up */}
      <div className="z-19 hidden md:block">
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <Image
          src="/images/border.png"
          alt="Border"
          width={170}
          height={1000}
          className="h-full"
        />
        </FadeContent>
      </div>
      {/* Right Section */}
      <div className="md:w-3/5 p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[60vh] md:min-h-screen relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm md:max-w-md bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-5 md:p-8 relative z-10 border border-white/10"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-4 text-center">
            Create Account
          </h2>
          <p className="text-white/80 text-center mb-6 text-sm">
            Sign up to start generating beautiful QR codes!
          </p>

          <form onSubmit={signup} className="space-y-4">
            {/* Full Name */}
            <div className="relative group">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 group-hover:text-pink-400 transition-colors" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 backdrop-blur-sm"
                required
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 group-hover:text-pink-400 transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 backdrop-blur-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 group-hover:text-pink-400 transition-colors" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 backdrop-blur-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing up...
                </div>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-white/20"></div>
            <span className="mx-4 text-white/60 text-xs">OR</span>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/80 text-sm">
            Already have an account?{" "}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/login"
              className="text-purple-400 hover:text-pink-400 font-medium transition-colors"
            >
              Log In
            </motion.a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
