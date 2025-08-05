"use client";
import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiHeart,
  FiZap,
  FiShield,
  FiUsers,
  FiInstagram,
} from "react-icons/fi";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const features = [
    {
      icon: <FiZap className="w-5 h-5" />,
      title: "Lightning Fast",
      description: "Generate QR codes instantly with our optimized algorithms",
    },
    {
      icon: <FiShield className="w-5 h-5" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never stored permanently",
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      title: "User Friendly",
      description: "Intuitive interface designed for everyone",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <FiGithub className="w-5 h-5" />,
      href: "https://github.com/S-o-b-u",
    },
    {
      name: "Instagram",
      icon: <FiInstagram className="w-5 h-5" />,
      href: "https://www.instagram.com/mainhoonsobu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com/in/souvik-rahut-3059a128a/",
    },
    {
      name: "Email",
      icon: <FiMail className="w-5 h-5" />,
      href: "mailto:contact@enqur.com",
    },
  ];

  return (
    <footer className="relative mt-20 border-t border-[#2226] bg-black/20 backdrop-blur-sm">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#8edaff11] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-4"
            >
              <Image
                src="/images/logo.png"
                alt="Enqur Logo"
                width={80}
                height={24}
                className="h-10 w-auto"
              />
            </motion.div>
            <p className="text-[#eafaff]/80 text-sm leading-relaxed mb-4">
              Transform your links into beautiful, scannable QR codes. Every
              scan tells a story with Enqur.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2 bg-[#8edaff]/10 hover:bg-[#8edaff]/20 rounded-lg text-[#8edaff] transition-all duration-300 border border-[#8edaff]/20"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#8edaff] font-semibold mb-4 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="text-[#eafaff]/70 hover:text-[#8edaff] transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-[#8edaff] font-semibold mb-4 text-lg">
              Features
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <div className="text-[#8edaff] mt-0.5">{feature.icon}</div>
                  <div>
                    <h4 className="text-[#eafaff] font-medium text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-[#eafaff]/60 text-xs mt-1">
                      {feature.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Telegram Community */}
          <div>
            <h3 className="text-[#8edaff] font-semibold mb-4 text-lg">
              Join Our Community
            </h3>
            <p className="text-[#eafaff]/70 text-sm mb-4">
              Get support, share ideas, and connect with other users in our
              official Telegram group.
            </p>
            <motion.a
              href="https://t.me/+iEQ3Tw9AIIk5ZGU1"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#8edaff] to-[#59c3ff] text-[#0e2233] font-medium rounded-lg text-sm hover:shadow-lg hover:shadow-[#59c3ff66] transition-all duration-300"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/90">
                <Image
                  src="/images/tg.png"
                  alt="Telegram"
                  width={14}
                  height={14}
                />
              </div>
              <span>Join Telegram</span>
            </motion.a>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-[#2226] flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-2 text-[#eafaff]/60 text-sm">
            <span>© {currentYear} Enqur. All rights reserved.</span>
            <FiHeart className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Made with love @mainhoonsobu</span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="/privacy-policy"
              className="text-[#eafaff]/60 hover:text-[#8edaff] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-[#eafaff]/60 hover:text-[#8edaff] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookie-policy"
              className="text-[#eafaff]/60 hover:text-[#8edaff] transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
