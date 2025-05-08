import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const personalInfo = [
    {
      label: "Name",
      value: "Ramesh Lakmal",
      icon: "far fa-user",
    },

    {
      label: "Degree",
      value: "BSc (Hons) in Information Technology",
      icon: "fas fa-graduation-cap",
    },
    {
      label: "Experiance Level",
      value: "1.5+ years",
      icon: "fas fa-laptop-house",
    },
  ];

  const description =
    "As an QA Engineer with nearly two years of experience, I have developed strong expertise in manual testing across various applications. My approach is detail-oriented and customer-focused, ensuring seamless functionality and high-quality user experiences. With strong organizational and communication skills, I excel in dynamic environments, adapting quickly to new challenges. I am now expanding my skill set into automation testing, aiming to enhance testing processes and deliver even more effective and efficient quality assurance solutions that drive user satisfaction and continuous improvement in web application functionality.";

  const truncateDescription = (text, isExpanded) => {
    if (!isMobile || isExpanded) return text;
    const words = text.split(" ");
    if (words.length <= 20) return text;
    return words.slice(0, 20).join(" ") + "...";
  };

  return (
    <section id="about" className="px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-8 relative inline-block">
            About Me
            <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-[#fc2589]"></span>
          </h2>
          <div className="bg-[#2d2f30] rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Who am I?
                </h3>
                <div className="mb-8">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={isExpanded ? "expanded" : "collapsed"}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-gray-300 leading-relaxed"
                    >
                      {truncateDescription(description, isExpanded)}
                    </motion.p>
                  </AnimatePresence>
                  {isMobile && description.split(" ").length > 20 && (
                    <motion.button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-[#fc2589] hover:text-[#e01e7a] mt-2 text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isExpanded ? "Show Less" : "See More"}
                    </motion.button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {personalInfo.map((info, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <i className={`${info.icon} text-[#fc2589] text-xl`}></i>
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">
                          {info.label}
                        </span>
                        <span className="text-gray-300">{info.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/img/my-profile-img.jpg"
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
