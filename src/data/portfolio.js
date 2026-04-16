import project1Cover from '../images/project1/cover.png';
import project2Cover from '../images/project2/cover.png';
import project3Cover from '../images/project3/cover.png';
import project4Cover from '../images/project4/cover.png';
import project5Cover from '../images/project5/cover.png';
import project6Cover from '../images/project6/cover.png';
import project7Cover from '../images/project7/cover.png';
import project8Cover from '../images/project8/cover.png';

export const resumeUrl =
  'https://drive.google.com/file/d/1IbW5OoP16tQTcJx3TvE7ZWC4Vy___Axi/view?usp=sharing';

export const person = {
  name: 'Ramesh Lakmal',
  firstName: 'Ramesh',
  title: 'QA Engineer',
  email: 'rameshslakmal1999@gmail.com',
  phone: '+94 77 074 0370',
  location: 'Kandy, Sri Lanka',
  siteUrl: 'https://lakmalramesh.online',
  github: 'https://github.com/rameshlakmal',
  linkedin: 'https://www.linkedin.com/in/rameshlakmal',
  description:
    'QA engineer focused on manual testing, automation, and performance checks across web and mobile products.',
};

export const hero = {
  intro: 'Hi, my name is',
  headline: 'Ramesh Lakmal.',
  subheadline: 'QA engineer focused on reliable releases.',
  blurb:
    'Quality work centered on reducing release surprises: focused manual testing, practical automation, and lightweight performance checks. Findings stay clear, actionable, and easy to repeat.',
  ctaLabel: 'Open Resume',
  ctaUrl: resumeUrl,
};

export const about = {
  paragraphs: [
    'A QA Engineer focused on reducing product risk and ensuring reliable, high-quality releases. Validates features through structured testing, identifies high-impact issues early, and communicates findings clearly to support fast and confident decision-making.',
    'Experience includes testing web and mobile applications across domains such as LMS, ERP, POS, and cloud-based platforms.',
    'Currently focused on building scalable automation and improving test efficiency using modern tools and practices.',
  ],
  skills: [
    'Test Design & Execution',
    'End-to-End Automation (Playwright, Selenium)',
    'API Testing & Validation',
    'Performance Testing & Monitoring (JMeter, Grafana)',
    'Test Management & Reporting (Azure DevOps)',
    'CI/CD Test Integration',
  ],
};

export const jobs = [
  {
    company: 'WaveZync',
    title: 'Quality Assurance Engineer',
    range: 'October 2024 - Present',
    url: 'https://www.wavezync.com/',
    relatedLinks: [
      { label: 'AnalystBuilder', url: 'https://www.analystbuilder.com/' },
      { label: 'Paradise-Cloud', url: 'https://paradise-cloud.com/' },
      { label: 'Wildcard', url: 'https://wildcard.win/' },
      { label: 'Pyrmid', url: 'https://www.pyramid.sg/' },
    ],
    bullets: [
      'Performed functional and regression testing for Analyst Builder, partnering with developers to catch and resolve issues across browsers and devices.',
      'Tested Paradise Cloud hosting and configuration workflows with a focus on performance, scalability, and environment reliability.',
      'Validated mobile app usability and functional behavior across iOS and Android.',
    ],
  },
  {
    company: 'Impact IT Solutions',
    title: 'Associate Software Quality Assurance Engineer',
    range: 'November 2023 - September 2024',
    url: 'https://impactitsolutions.lk/',
    relatedLinks: [
      { label: 'Enimbus360', url: 'https://enimbus360.com/' },
      { label: 'We4E', url: 'https://we4e.app/' },
    ],
    bullets: [
      "Primary QA resource for the company's enterprise ERP system, validating financial and operational workflows end-to-end.",
      'Developed and maintained automated test cases for the ERP purchasing module using Selenium (Java), reducing manual regression effort.',
      'Tested a POS application integrated with the ERP system, verifying real-time data synchronization between retail frontend and backend operations.',
      'Performed end-to-end testing of a Learning Management System (LMS), covering instructor and learner workflows.',
      'Authored detailed bug reports with reproduction steps, expected vs. actual results, and system diagnostics.',
      'Collaborated directly with clients to gather requirements, provide status updates, and ensure delivery alignment.',
    ],
  },
  {
    company: 'Impact IT Solutions',
    title: 'Intern Software Quality Assurance Engineer',
    range: 'April 2023 - October 2023',
    url: 'https://impactitsolutions.lk/',
    bullets: [
      'Executed functional and cross-browser testing for WordPress websites, ensuring responsive design and stable plugin behavior.',
      'Validated enterprise-level PowerApps applications across functionality, usability, and performance criteria.',
      'Developed and managed test cases in Azure DevOps, enhancing test coverage and result tracking.',
      'Partnered with development teams to identify, report, and resolve defects efficiently.',
    ],
  },
];

export const education = [
  {
    institution: 'SLIIT University',
    program: 'BSc (Hons) in Information Technology',
    specialization: 'Information Technology',
    range: '2020 - 2024',
  },
];

export const certifications = [
  {
    title: 'ISTQB Certified Tester - Foundation Level',
    issuer: 'International Software Testing Qualifications Board',
    date: 'May 2025',
    url: 'https://drive.google.com/file/d/1hr8S8uZQgOqPFGbJGk0RxGoWDqeypaiK/view?usp=sharing',
  },
];

export const featuredProjects = [
  {
    date: '2026-03-15',
    title: 'TestPilot AI',
    cover: project7Cover,
    description:
      'TestPilot AI converts software requirements into structured, prioritized test cases using a QA-driven approach. It analyzes inputs to identify key test conditions, applies relevant testing techniques, and generates a deduplicated test suite. Results are presented in a clear, searchable format and can be exported or synced directly with Jira (AIO Tests) for end-to-end traceability.',
    tech: ['Anthropic', 'jira'],
    github: 'https://github.com/rameshlakmal/TestPilot-AI',
    external: 'https://testpilot-ai-app.vercel.app/',
  },
];

export const projects = [
  {
    date: '2026-04-14',
    title: 'E2E Testing with Claude Agents',
    cover: project8Cover,
    description:
      ' A five-stage pipeline walkthrough showing how structured AI agents and human review gates turn a web feature into a complete, traceable Playwright test suite — without a single selector written by hand',
    tech: ['Playwright', 'Claude', 'Agentic testing'],
    github: 'https://github.com/rameshlakmal/Agentic-Testing',
    external:
      'https://www.linkedin.com/pulse/setting-up-qa-workflow-playwright-github-actions-aio-tests-lakmal-kvscc',
  },
  {
    date: '2025-11-20',
    title: 'QA Workflow with Playwright, GitHub Actions and AIO Tests',
    cover: project6Cover,
    description:
      'A workflow article connecting Playwright, GitHub Actions, and AIO Tests for traceable automation execution directly from a QA management surface.',
    tech: ['Playwright', 'GitHub Actions', 'AIO Tests'],
    github: 'https://github.com/rameshlakmal/playwright-AIO-Tests',
    external:
      'https://www.linkedin.com/pulse/setting-up-qa-workflow-playwright-github-actions-aio-tests-lakmal-kvscc',
  },
  {
    date: '2025-11-01',
    title: 'Understanding the Basics of Performance Testing',
    cover: project5Cover,
    description:
      'A practical introduction to load, stress, spike, and soak testing with a focus on why performance quality matters before scale exposes problems.',
    tech: ['Performance Testing', 'JMeter'],
    external:
      'https://www.linkedin.com/posts/rameshlakmal_nobody-likes-a-slow-or-crashing-app-this-activity-7307826795880292353-5NQu?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACwGKZUBUTsm3RCaPd2Ter9MpnB5-vT5_vU',
  },
  {
    date: '2025-02-15',
    title: 'Performance Monitoring Using JMeter + InfluxDB + Grafana',
    cover: project3Cover,
    description:
      'A monitoring setup for streaming JMeter metrics into InfluxDB and visualizing performance behavior in Grafana dashboards.',
    tech: ['JMeter', 'InfluxDB', 'Grafana'],
    github: 'https://github.com/rameshlakmal/Jmeter-githubActions-influxdb-grafana',
    external: '/projects/project3',
  },
  {
    date: '2024-10-21',
    title: 'Playwright Automation with ZeroStep',
    cover: project2Cover,
    description:
      'An exploration of AI-assisted end-to-end testing where plain-language instructions reduce brittle selectors and improve test authoring speed.',
    tech: ['Playwright', 'ZeroStep'],
    github: 'https://github.com/rameshlakmal/playwright-and-zerostep',
  },
  {
    date: '2024-10-15',
    title: 'End to End Automation with Selenium and Jenkins',
    cover: project4Cover,
    description:
      'A scalable Selenium framework with TestNG, Maven, Allure reporting, and Jenkins support for local and CI-based web testing.',
    tech: ['Selenium', 'TestNG', 'Maven', 'Jenkins'],
    github: 'https://github.com/rameshlakmal/Selenium-Framework-Demo',
  },

  {
    date: '2024-9-15',
    title: 'Web Automation with playwright',
    cover: project1Cover,
    description:
      'Playwright automation framework for web applications. Integrated with Azure DevOps CI/CD pipelines to enable continuous testing and faster feedback on code changes.',
    tech: ['Playwright', 'javascript', 'Azure DevOps'],
    github: 'https://github.com/rameshlakmal/Playwright-Practice',
  },
];
