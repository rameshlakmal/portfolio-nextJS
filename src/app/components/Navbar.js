"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNav } from "../context/NavContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isExpanded, setIsExpanded } = useNav();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "About",
      path: "#about",
      icon: <i className="far fa-user text-[#a8a9b4]"></i>,
    },
    {
      name: "Resume",
      path: "#resume",
      icon: <i className="far fa-file-alt text-[#a8a9b4]"></i>,
    },
    {
      name: "Portfolio",
      path: "#portfolio",
      icon: <i className="far fa-folder text-[#a8a9b4]"></i>,
    },
    {
      name: "Contact",
      path: "#contact",
      icon: <i className="far fa-envelope text-[#a8a9b4]"></i>,
    },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleNavigation = (path) => {
    const element = document.querySelector(path);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Side Navigation */}
      <nav
        className={`fixed top-0 left-0 h-screen z-50
        ${isExpanded ? "w-64" : "w-20"} 
        hidden md:block transition-all duration-300 ease-in-out`}
        style={{
          marginTop: 0,
          background: "#232526",
          background: "-webkit-linear-gradient(to right, #414345, #232526)",
          background: "linear-gradient(to right, #414345, #232526)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Top Section with Profile and Shrink Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#a8a9b4] relative">
                <div className="absolute inset-0 rounded-full shadow-[0_0_15px_#fc2589]"></div>
                <img
                  src="/img/my-profile-img.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover relative z-10"
                />
              </div>
              <div
                className={`ml-3 transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                <h2 className="text-white text-lg font-semibold whitespace-nowrap">
                  Ramesh Lakmal
                </h2>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95 text-white"
              >
                {isExpanded ? "◀" : "▶"}
              </button>
            </div>
          </div>

          {/* Social Media Icons */}
          <div
            className={`flex justify-center space-x-4 py-4 border-b border-gray-700 transition-all duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <a
              href="https://github.com/rameshlakmal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a8a9b4] hover:text-white transition-colors"
            >
              <i className="fab fa-github text-2xl"></i>
            </a>
            <a
              href="www.linkedin.com/in/rameshlakmal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a8a9b4] hover:text-white transition-colors"
            >
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-4 py-3 mb-2 transition-colors group
                    ${
                      pathname === item.path
                        ? "bg-gray-700 text-white"
                        : "text-[#a8a9b4] hover:bg-gray-700 hover:text-white"
                    }
                    ${!isExpanded && "justify-center"}`}
                >
                  <span
                    className={`text-xl transition-colors group-hover:text-[#fc2589] ${
                      pathname === item.path ? "text-[#fc2589]" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`ml-4 transition-all duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-0 w-0"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Top Navigation */}
      <motion.nav
        className="md:hidden fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "#232526",
          background: "-webkit-linear-gradient(to right, #414345, #232526)",
          background: "linear-gradient(to right, #414345, #232526)",
        }}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <span className="text-xl font-bold text-white hidden md:block">
            Portfolio
          </span>
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="bg-gray-800"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center px-4 py-3 border-b border-gray-700 last:border-b-0
                      ${
                        pathname === item.path
                          ? "bg-gray-700 text-white"
                          : "text-[#a8a9b4] hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
