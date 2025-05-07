import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const categories = [
    "All",
    "Selenium",
    "Playwright",
    "API Testing",
    "Performance Testing",
  ];

  const projects = [
    {
      id: "perf-testing-basics",
      title: "Understanding the Basics of Performance Testing",
      description:
        "This article provides a beginner-friendly overview of performance testing, covering its purpose, importance, and key types—load, stress, spike, and soak testing. It emphasizes the role of performance testing in ensuring fast, reliable user experiences and avoiding costly issues, serving as a solid foundation before exploring tools like k6, LoadRunner, and JMeter.",
      image: "/img/portfolio/project5/cover.png",
      technologies: ["Performance Testing", "JMeter"],
      link: "https://www.linkedin.com/posts/rameshlakmal_nobody-likes-a-slow-or-crashing-app-this-activity-7307826795880292353-5NQu?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACwGKZUBUTsm3RCaPd2Ter9MpnB5-vT5_vU",
      category: "Performance Testing",
    },
    {
      id: "selenium-framework",
      title: "End to End Automation with Selenium and Jenkins",
      description:
        "🚀 This is a scalable and maintainable test automation framework built using Selenium WebDriver 🧪, TestNG 📋, and Maven 🛠️ — seamlessly integrated with Allure Reports 📊 and Jenkins ⚙️ to support automated testing in both local and CI/CD environments. 🌐 📐 The framework adheres to best practices in test automation and follows a clean architecture that's easy to extend and manage. It's ideal for automating web application testing workflows in modern Agile or DevOps pipelines. 🔄",
      image: "/img/portfolio/project4/cover.png",
      technologies: ["Selenium", "Maven", "TestNG", "Allure Report", "Jenkins"],
      link: "https://github.com/rameshlakmal/Selenium-Framework-Demo",
      category: "Selenium",
    },
    {
      id: "playwright-test-suite",
      title: "Web Automation with Playwright",
      description:
        "Implemented automated testing strategies to ensure thorough coverage of application functionality and performance, using the Page Object Model (POM) design pattern to promote modular, maintainable test code. Leveraged fixtures for streamlined setup and teardown processes, enhancing test clarity and execution efficiency. Integrated testing within the Azure DevOps pipeline to support continuous integration and delivery (CI/CD), enabling automated test execution with every code change.",
      image: "/img/portfolio/project1/cover.jpg",
      technologies: ["Playwright", "Azure DevOps"],
      link: "https://github.com/rameshlakmal/Playwright-Practice",
      category: "Playwright",
    },
    {
      id: "playwright-zerostep",
      title: "Playwright Automation with ZeroStep",
      description:
        "End-to-end (E2E) testing is key to ensuring software works in real-life situations, but traditional methods can be complicated and easily break with small UI changes. ⚙️🚨 ZeroStep changes that by using AI 🤖 to improve Playwright tests. With ZeroStep, testers can automate tests using simple text commands ✍️, without needing to rely on complex selectors. ❌🔍 Powered by GPT-3.5 and GPT-4, it makes testing faster ⏩, more reliable ✅, and less affected by UI updates. 🔄",
      image: "/img/portfolio/project2/cover.png",
      technologies: ["Playwright", "ZeroStep"],
      link: "https://github.com/rameshlakmal/playwright-and-zerostep",
      category: "Playwright",
    },

    {
      id: "jmeter-influxdb-grafana",
      title: "Performance Monitoring Using JMeter + InfluxDB + Grafana",
      description:
        "This article is about setting up a basic integration of JMeter, InfluxDB, and Grafana for real-time performance test monitoring. The guide covers configuring JMeter to send data to InfluxDB, storing metrics, and visualizing them through Grafana dashboards. While it's a foundational setup, it offers a powerful starting point for customizing and scaling performance test visualizations to gain deeper insights and make informed decisions",
      image: "/img/portfolio/project3/cover.png",
      technologies: ["JMeter", "InfluxDB", "Grafana"],
      link: "https://github.com/rameshlakmal/playwright-and-zerostep",
      category: "Performance Testing",
    },
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  const toggleDescription = (projectId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const truncateDescription = (text, isExpanded) => {
    if (isExpanded) return text;
    const words = text.split(" ");
    if (words.length <= 20) return text;
    return words.slice(0, 20).join(" ") + "...";
  };

  return (
    <section id="portfolio" className="px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-8 relative inline-block">
            Portfolio
            <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-[#fc2589]"></span>
          </h2>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                  activeCategory === category
                    ? "bg-[#fc2589] text-white"
                    : "bg-[#2d2f30] text-gray-300 hover:bg-[#fc2589] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[#2d2f30] rounded-lg shadow-lg overflow-hidden"
              >
                <div
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectPosition: "center" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <div className="mb-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={
                          expandedDescriptions[project.id]
                            ? "expanded"
                            : "collapsed"
                        }
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300">
                          {truncateDescription(
                            project.description,
                            expandedDescriptions[project.id]
                          )}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                    {project.description.split(" ").length > 20 && (
                      <motion.button
                        onClick={() => toggleDescription(project.id)}
                        className="text-[#fc2589] hover:text-[#e01e7a] mt-2 text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {expandedDescriptions[project.id]
                          ? "Show Less"
                          : "See More"}
                      </motion.button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-[#232526] text-gray-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#fc2589] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    View Project
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
