import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Resume() {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const experiences = [
    {
      title: "Quality Assurance Engineer",
      company: "WaveZync",
      period: "October 2024 - Present",
      description: [
        <>
          Performed functional and regression testing on the{" "}
          <a
            href="https://www.analystbuilder.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(252, 37, 137)" }}
          >
            Analyst Builder
          </a>{" "}
          platform, collaborating with development teams to identify, document,
          and resolve issues, ensuring a seamless user experience across
          browsers and devices.
        </>,
        <>
          Performed testing on the{" "}
          <a
            href="https://paradise-cloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(252, 37, 137)" }}
          >
            Paradise Cloud Hosting and Configuration Solution
          </a>{" "}
          , validating its performance, scalability, and integration with web
          applications, ensuring seamless deployment and configuration
          management across environments.
        </>,

        "Conducted functional, usability testing on mobile applications across iOS and Android platforms, ensuring seamless user experience and optimal performance.",
      ],
    },
    {
      title: "Associate Software Quality Assurance Engineer",
      company: "Impact IT Solutions Private Limited",
      period: "November 2023 - September 2024",
      description: [
        <>
          Performed detailed manual and automated testing of{" "}
          <a
            href="https://enimbus360.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(252, 37, 137)" }}
          >
            ERP system
          </a>{" "}
          to validate functionality, accuracy, and integration of financial and
          operational processes.
        </>,
        "Tested a Point of Sale (POS) application integrated with an ERP system, ensuring seamless data synchronization and operational efficiency between ERP and POS systems.",
        <>
          Performed comprehensive testing of a{" "}
          <a
            href="https://we4e.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(252, 37, 137)" }}
          >
            Learning Management System (LMS)
          </a>{" "}
          to ensure overall functionality and user experience.
        </>,
        "Performed comprehensive testing of a Learning Management System (LMS) to ensure overall functionality and user experience.",
        "Tested a highly sophisticated LMS, focusing on its complex functionality and ensuring overall performance, usability, and seamless integration across various components.",
        "Created comprehensive bug reports detailing issues, including steps to reproduce, expected and actual results, and relevant system information.",
        "Engaged directly with clients to gather requirements, provide updates, and address concerns, ensuring alignment with project goals and successful delivery of solutions.",
      ],
    },

    {
      title: "Intern Software Quality Assurance Engineer",
      company: "Impact IT Solutions Private Limited",
      period: "April 2023 - October 2023",
      description: [
        <>
          Performed functional and compatibility testing on WordPress websites{" "}
          <a
            href="https://dinukasafari.com/, https://50scentsspices.com/, https://acmeshipping.lk/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(252, 37, 137)" }}
          >
            e.g. Dinuka Safari,
          </a>{" "}
          <a
            href="https://50scentsspices.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(252, 37, 137)" }}
          >
            50 scents spices,
          </a>{" "}
          <a
            href="https://acmeshipping.lk/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(252, 37, 137)" }}
          >
            Acme Shipping
          </a>{" "}
          to ensure responsiveness, plugin stability, and cross-browser
          consistency.
        </>,

        "Conducted comprehensive testing of enterprise level PowerApp applications to ensure functionality, usability, and performance.",
        "Created, managed, and executed test cases using Azure DevOps, ensuring comprehensive coverage and effective tracking of test results.",
        "Collaborated with the development team to communicate and resolve identified issues",
      ],
    },
  ];

  const education = [
    {
      title:
        "BSc (Hons) in Information Technology, specializing in Information Technology, at SLIIT University",
      degree: "BSc (Hons) in Information Technology",
      period: "2020 - 2024",
      description:
        "I graduated with a BSc (Hons) in Information Technology, specializing in Information Technology, from SLIIT University. My studies equipped me with comprehensive knowledge in areas like software development, networking, and database management, helping me build a strong technical foundation for a career in the IT industry.",
    },
    {
      title:
        "GCE Advanced Level at Vidyartha College, Kandy, in the Commerce stream.",
      degree: "G.C.E. (A/L) Examination",
      period: "2016 - 2019",
      description:
        "I completed my GCE Advanced Level at Vidyartha College, Kandy, in the Commerce stream. This academic background provided me with a solid foundation in subjects like accounting, economics, and business studies, equipping me with a strong understanding of financial principles and business operations.",
    },
  ];

  return (
    <section id="resume" className="px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-white relative inline-block">
              Resume
              <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-[#fc2589]"></span>
            </h2>
            <a
              href="https://drive.google.com/file/d/1OB1FyuWJYlPgwVsRxMYXm923aiZ8PNlY/view?usp=sharing"
              download
              className="flex items-center space-x-2 bg-[#fc2589] text-white px-6 py-3 rounded-full hover:bg-[#e01e7a] transition-colors duration-300"
            >
              <i className="fa-regular fa-file-pdf text-xl"></i>
              <span>Download CV</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Experience Section */}
            <div className="bg-[#2d2f30] rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Experience
              </h3>
              <div className="space-y-6 relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#fc2589]"></div>
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-[-8px] top-1.5 w-4 h-4 rounded-full border-2 border-[#fc2589] bg-[#2d2f30]"></div>
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleSection(`exp-${index}`)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl font-semibold text-white">
                          {exp.title}
                        </h4>
                        <motion.i
                          animate={{
                            rotate: expandedSections[`exp-${index}`] ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="fa-solid fa-chevron-down text-[#fc2589]"
                        ></motion.i>
                      </div>
                      <p className="text-white mb-2">{exp.company}</p>
                      <p className="text-gray-400 mb-2">{exp.period}</p>
                    </div>
                    <AnimatePresence>
                      {expandedSections[`exp-${index}`] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4">
                            {Array.isArray(exp.description) ? (
                              <ul className="list-disc list-inside text-gray-300 space-y-2">
                                {exp.description.map((point, i) => (
                                  <li key={i}>{point}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-300">{exp.description}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-[#2d2f30] rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Education
              </h3>
              <div className="space-y-6 relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#fc2589]"></div>
                {education.map((edu, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-[-8px] top-1.5 w-4 h-4 rounded-full border-2 border-[#fc2589] bg-[#2d2f30]"></div>
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleSection(`edu-${index}`)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl font-semibold text-white">
                          {edu.degree}
                        </h4>
                        <motion.i
                          animate={{
                            rotate: expandedSections[`edu-${index}`] ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="fa-solid fa-chevron-down text-[#fc2589]"
                        ></motion.i>
                      </div>
                      <p className="text-white mb-2">{edu.title}</p>
                      <p className="text-gray-400">{edu.period}</p>
                    </div>
                    <AnimatePresence>
                      {expandedSections[`edu-${index}`] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4">
                            <p className="text-gray-300">{edu.description}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
