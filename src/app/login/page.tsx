"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiGrid } from "react-icons/fi";
import Image from "next/image";
import RippleGrid from "@/components/RippleGrid";
import FadeContent from "@/components/FadeContent";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
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
            <span className="mt-4 md:mt-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Welcome back to{" "}
            </span>
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
            Sign in to your account to continue your journey with us. Access
            your QR codes and analytics in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-8 relative z-10 border border-white/10"
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-3">
              What You Can Do
            </h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></span>
                Access your saved QR code designs
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></span>
                View scan analytics and insights
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></span>
                Create new QR codes for your projects
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
            Welcome Back
          </h2>
          <p className="text-white/80 text-center mb-6 text-sm">
            Sign in to access your QR code dashboard
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-red-500/20 border-l-4 border-red-400 text-red-200 rounded-r-lg"
            >
              <p className="text-xs">{error}</p>
            </motion.div>
          )}

          <form onSubmit={login} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 group-hover:text-pink-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 backdrop-blur-sm"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-purple-400 focus:ring-purple-400 border-white/20 rounded bg-white/10"
                />
                <label className="ml-2 text-white/80">Remember me</label>
              </div>
              <a
                href="#"
                className="font-medium text-purple-400 hover:text-pink-400 transition-colors"
              >
                Forgot password?
              </a>
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
                  Signing in...
                </div>
              ) : (
                "Sign In"
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
            Don't have an account?{" "}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/signup"
              className="text-purple-400 hover:text-pink-400 font-medium transition-colors"
            >
              Sign Up
            </motion.a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
