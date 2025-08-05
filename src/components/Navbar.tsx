"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiGrid, FiUser, FiLogOut, FiMenu, FiX, FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import WrapButton from "./WrapButton";

interface NavbarProps {
  activePage?: "home" | "dashboard" | "profile";
  showLogout?: boolean;
}

export default function Navbar({
  activePage = "home",
  showLogout = true,
}: NavbarProps) {
  const router = useRouter();
  const [loggedOut, setLoggedOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedOut(true);
    setMenuOpen(false);
    router.push("/login");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Enqur",
          text: "Check out Enqur for beautiful QR codes!",
          url: window.location.origin,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin);
        alert("Link copied to clipboard!");
      } catch (err) {
        alert("Could not copy link.");
      }
    }
  };

  // Animation variants for mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <nav className="fixed w-full top-0 z-50  py-8 md:py-8">
      <div className="max-w-8xl mx-7 md:mx-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.a
            href="/"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/images/logo.png"
              alt="Enqur Logo"
              width={100}
              height={30}
              className="h-12 w-auto md:h-16"
              priority
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-2 bg-sky/1 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 shadow-lg"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                href="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg ${
                  activePage === "home"
                    ? "bg-sky-500/20 text-[#59c3ff]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {activePage === "home" && (
                  <span className="w-2 h-2 bg-[#59c3ff] rounded-full"></span>
                )}
                <span>Home</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                href="/dashboard"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg ${
                  activePage === "dashboard"
                    ? "bg-sky-500/20 text-[#59c3ff]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {activePage === "dashboard" && (
                  <span className="w-2 h-2 bg-[#59c3ff] rounded-full"></span>
                )}
                <span>Dashboard</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                href="/profile"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg ${
                  activePage === "profile"
                    ? "bg-sky-500/20 text-[#59c3ff]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {activePage === "profile" && (
                  <span className="w-2 h-2 bg-[#59c3ff] rounded-full"></span>
                )}
                <span>Profile</span>
              </motion.a>
              {showLogout && !loggedOut && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg text-white/80 hover:text-white hover:bg-white/10"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              )}
            </motion.div>
            {showLogout && (
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onClick={() => window.open('https://github.com/S-o-b-u/enqur', '_blank')}
              >
                <WrapButton>
                  {/* <FiStar className="w-4 h-4" /> */}
                  <span>Give A Star</span>
                </WrapButton>
              </motion.button>
            )}
          </div>

          {/* Mobile Burger Menu */}
          <div className="md:hidden flex items-center">
            <motion.button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="p-2 rounded-full transition-colors"
              initial={false}
              animate={{ scale: menuOpen ? 1.1 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                initial={false}
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="block"
              >
                {menuOpen ? (
                  <FiX className="w-7 h-7 text-white transition-all" />
                ) : (
                  <FiMenu className="w-7 h-7 text-white transition-all" />
                )}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="fixed inset-0 z-[100] backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full transition-colors"
              initial={false}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiX className="w-8 h-8 text-white" />
            </motion.button>
            <nav className="flex flex-col items-center space-y-8">
              <motion.a
                href="/"
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.1 }}
                className={`flex items-center gap-3 text-2xl font-semibold px-8 py-4 rounded-xl transition-all duration-200 ${
                  activePage === "home"
                    ? "bg-sky-600/30 text-sky-200"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <FiGrid className="w-7 h-7" />
                Home
              </motion.a>
              <motion.a
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.1 }}
                className={`flex items-center gap-3 text-2xl font-semibold px-8 py-4 rounded-xl transition-all duration-200 ${
                  activePage === "dashboard"
                    ? "bg-sky-600/30 text-sky-200"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <FiGrid className="w-7 h-7" />
                Dashboard
              </motion.a>
              <motion.a
                href="/profile"
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.1 }}
                className={`flex items-center gap-3 text-2xl font-semibold px-8 py-4 rounded-xl transition-all duration-200 ${
                  activePage === "profile"
                    ? "bg-sky-600/30 text-sky-200"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <FiUser className="w-7 h-7" />
                Profile
              </motion.a>
              {showLogout && !loggedOut && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  onClick={logout}
                  className="flex items-center gap-3 text-2xl font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-white/90 hover:bg-white/10"
                >
                  <FiLogOut className="w-7 h-7" />
                  Logout
                </motion.button>
              )}
              {showLogout && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => window.open('https://github.com/S-o-b-u/enqur', '_blank'), 200);
                  }}
                  className="flex items-center gap-3 text-2xl font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-white/90 hover:bg-white/10"
                >
                  <FiStar className="w-7 h-7" />
                  Give A Star
                </motion.button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
