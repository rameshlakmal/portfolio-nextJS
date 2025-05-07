"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Resume from "./components/Resume";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import { useNav } from "./context/NavContext";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const { isExpanded } = useNav();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Add smooth scrolling behavior to the entire page
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  if (!isMounted) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#232526]">
      <Navbar />
      <div
        className={`transition-all duration-300 ease-in-out
          ${isExpanded ? "md:ml-64" : "md:ml-20"}`}
        style={{ marginTop: 0 }}
      >
        {/* Hero Section */}
        <div className="relative h-[100vh]" style={{ marginTop: 0 }}>
          <div className="absolute inset-0">
            <Image
              src="/img/hero-bg.jpg"
              alt="Hero Background"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={100}
              style={{
                objectFit: "cover",
                objectPosition: "center 40%",
              }}
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "color-mix(in srgb, var(--background-color), transparent 50%)",
            }}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <motion.div
                className="max-w-3xl text-white relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <h1 className="text-6xl font-bold mb-4">Hi I'm Ramesh</h1>
                <div className="text-left mt-10 text-white">
                  <p className="text-2xl text-[#ffffff]">
                    <Typewriter
                      words={[
                        "I'm a passionate QA engineer, dedicated to crafting flawless digital experiences through precision, testing, and a sharp eye for detail.",
                        "From testing flows to catching the little stuff, I’m all about keeping things smooth and stress-free.",
                      ]}
                      loop={0}
                      cursor
                      cursorStyle="_"
                      typeSpeed={50}
                      deleteSpeed={30}
                      delaySpeed={1000}
                    />
                  </p>
                </div>
                {/* <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-6"
                  variants={itemVariants}
                >
                  Welcome to My Portfolio
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl mb-8"
                  variants={itemVariants}
                >
                  I'm a passionate developer creating amazing digital
                  experiences
                </motion.p> */}
                <motion.div variants={itemVariants}></motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <main className="relative">
          <div className="bg-[#232526] py-16">
            <About />
          </div>
          <div className="bg-[#232526] py-16">
            <Resume />
          </div>
          <div className="bg-[#232526] py-16">
            <Portfolio />
          </div>
          <div className="bg-[#232526] py-16">
            <Contact />
          </div>
        </main>
      </div>
    </div>
  );
}
