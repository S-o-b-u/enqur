"use client";

import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          className="group fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#8edaff] to-[#59c3ff] text-[#0e2233] shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none scroll-to-top-glow"
          aria-label="Scroll to top"
          style={{ boxShadow: "0 4px 24px 0 rgba(142, 218, 255, 0.3)" }}
        >
          <FiArrowUp className="w-5 h-5 transition-transform group-hover:animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;