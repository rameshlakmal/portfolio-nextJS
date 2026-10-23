import project1Cover from '../images/project1/cover.webp';
import project2Cover from '../images/project2/cover.webp';
import project3Cover from '../images/project3/cover.webp';
import project4Cover from '../images/project4/cover.webp';
import project5Cover from '../images/project5/cover.webp';
import project6Cover from '../images/project6/cover.webp';
import project7Cover from '../images/project7/cover.webp';
import project8Cover from '../images/project8/cover.webp';
import project9Cover from '../images/project9/cover.webp';

export const resumeUrl =
  'https://drive.google.com/file/d/1IbW5OoP16tQTcJx3TvE7ZWC4Vy___Axi/view?usp=sharing';

export const person = {
  name: 'Ramesh Lakmal',
  firstName: 'Ramesh',
  title: 'QA Engineer',
  email: 'rameshslakmal1999@gmail.com',
  phone: '+94 77 074 0370',
  location: 'Colombo, Sri Lanka',
  siteUrl: 'https://lakmalramesh.online',
  github: 'https://github.com/rameshlakmal',
  linkedin: 'https://www.linkedin.com/in/rameshlakmal',
  description:
    'QA engineer focused on manual testing, test automation and performance testing across web and mobile products.',
};

export const hero = {
  intro: 'Hi, my name is',
  headline: 'Ramesh Lakmal.',
  subheadline: 'QA engineer focused on reliable releases.',
  blurb:
    'Quality work centered on reducing surprises at release time: focused manual testing, practical automation and lightweight performance checks, with findings that are clear, actionable and easy to reproduce.',
  ctaLabel: 'Open Resume',
  ctaUrl: resumeUrl,
};

export const about = {
  paragraphs: [
    'QA engineer focused on reducing product risk and supporting reliable, high-quality releases. Validates features through structured testing, identifies high-impact issues early and communicates findings clearly so teams can make quick, confident decisions.',
    'Experience includes testing web and mobile applications across LMS, ERP, POS and cloud-based platforms.',
    'Currently focused on building maintainable automation and improving test efficiency with modern tools and practices.',
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
      { label: 'Analyst Builder', url: 'https://www.analystbuilder.com/' },
      { label: 'Paradise Cloud', url: 'https://paradise-cloud.com/' },
      { label: 'Wildcard', url: 'https://wildcard.win/' },
      { label: 'Pyramid', url: 'https://www.pyramid.sg/' },
    ],
    bullets: [
      'Sole QA engineer across multiple concurrent projects, responsible for test planning, execution, defect tracking and release validation.',
      'Test web, mobile and cloud-based products, including Analyst Builder and Paradise Cloud, in close collaboration with developers, designers and stakeholders.',
      'Lead bug triage with the development and UI/UX teams to prioritize defects and track them through to resolution.',
      'Test REST APIs with Postman and Swagger, validating endpoints, payloads, responses and backend integrations.',
      'Verify consistent functionality and user experience across iOS, Android, browsers and screen sizes.',
    ],
  },
  {
    company: 'Impact IT Solutions',
    title: 'Associate Quality Assurance Engineer',
    range: 'November 2023 - October 2024',
    url: 'https://impactitsolutions.lk/',
    relatedLinks: [
      { label: 'Enimbus360', url: 'https://enimbus360.com/' },
      { label: 'We4E', url: 'https://we4e.app/' },
    ],
    bullets: [
      "Primary QA engineer for the company's ERP system, covering financial workflows, business logic and critical data processes.",
      'Tested the POS and ERP integration end to end, including transaction processing and real-time data synchronization.',
      'Developed automated tests for the ERP purchasing module using Selenium (Java) to reduce repetitive manual regression work.',
      'Tested a learning management system across instructor and learner workflows.',
      'Maintained detailed defect reports and test evidence, and worked with clients to clarify requirements and prioritize defects.',
    ],
  },
  {
    company: 'Impact IT Solutions',
    title: 'Intern Quality Assurance Engineer',
    tabLabel: 'Impact IT (Intern)',
    range: 'April 2023 - October 2023',
    url: 'https://impactitsolutions.lk/',
    bullets: [
      'Designed and executed test cases for enterprise PowerApps applications in Azure DevOps Test Plans, maintaining traceability to requirements.',
      'Tested WordPress sites and client web applications across browsers and devices.',
      'Worked with developers during Agile sprints to reproduce, prioritize and verify defect fixes.',
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
    date: '2026-10-22',
    title: 'Propmaster',
    cover: project9Cover,
    id: 'project9',
    description:
      'A test-data toolkit for QA engineers working with PostgreSQL. It records every insert, update and delete a test causes, grouped by the test step that caused it, checks the recording against business rules written in SQL, and exports it as a bug-ticket report or re-runnable SQL checks. It also finds and reserves shared test data with SQL recipes, and seeds and cleans up scenario data from YAML, through a CLI or a local web app.',
    tech: ['TypeScript', 'PostgreSQL', 'React', 'Vitest'],
    github: 'https://github.com/rameshlakmal/propmaster',
  },
  {
    date: '2026-03-15',
    title: 'TestPilot AI',
    cover: project7Cover,
    id: 'project7',
    description:
      'TestPilot AI converts software requirements into structured, prioritized test cases. It analyzes the input to identify key test conditions, applies the relevant test design techniques and generates a deduplicated test suite. Results are shown in a searchable format and can be exported or synced directly to Jira (AIO Tests) for end-to-end traceability.',
    tech: ['Anthropic', 'Jira'],
    github: 'https://github.com/rameshlakmal/TestPilot-AI',
    external: 'https://testpilot-ai-app.vercel.app/',
  },
];

export const projects = [
  {
    date: '2026-04-14',
    title: 'E2E Testing with Claude Agents',
    cover: project8Cover,
    id: 'project8',
    description:
      'A five-stage pipeline in which Claude agents turn a web feature into a Playwright test suite. A setup agent analyzes the application source, a planning agent writes test scenarios from that analysis, and a generator agent produces tests that follow a strict page-object convention, with a human review gate after setup and after planning. A healer agent repairs tests that break when the UI changes. Demonstrated on the Sauce Demo store.',
    tech: ['Playwright', 'Claude', 'Agentic Testing'],
    github: 'https://github.com/rameshlakmal/Agentic-Testing',
    external:
      'https://www.linkedin.com/pulse/setting-up-qa-workflow-playwright-github-actions-aio-tests-lakmal-kvscc',
  },
  {
    date: '2025-11-20',
    title: 'QA Workflow with Playwright, GitHub Actions and AIO Tests',
    cover: project6Cover,
    id: 'project6',
    description:
      'A Playwright Test project, with page objects, fixtures and a reusable authentication setup, that reports each run to AIO Tests in Jira. Test titles carry AIO case keys, so every automated result is recorded against its test case in a test cycle. A GitHub Actions workflow runs the suite on demand, with credentials stored as repository secrets. The accompanying article explains the setup step by step.',
    tech: ['Playwright', 'GitHub Actions', 'AIO Tests'],
    github: 'https://github.com/rameshlakmal/playwright-AIO-Tests',
    external:
      'https://www.linkedin.com/pulse/setting-up-qa-workflow-playwright-github-actions-aio-tests-lakmal-kvscc',
  },
  {
    date: '2025-11-01',
    title: 'Understanding the Basics of Performance Testing',
    cover: project5Cover,
    id: 'project5',
    description:
      'A short introduction to performance testing and why it matters before real traffic exposes problems. It explains load, stress, spike and soak testing, what each one reveals about an application, and the metrics worth watching, such as response time, throughput and error rate.',
    tech: ['Performance Testing', 'JMeter'],
    external:
      'https://www.linkedin.com/posts/rameshlakmal_nobody-likes-a-slow-or-crashing-app-this-activity-7307826795880292353-5NQu?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACwGKZUBUTsm3RCaPd2Ter9MpnB5-vT5_vU',
  },
  {
    date: '2025-02-15',
    title: 'Performance Monitoring Using JMeter + InfluxDB + Grafana',
    cover: project3Cover,
    id: 'project3',
    description:
      'A performance test setup for the OrangeHRM demo application. JMeter test plans cover login and employee creation, using test data from a CSV file and values extracted from earlier responses. A backend listener streams live results to InfluxDB, and Grafana dashboards chart response times, throughput and errors while the test runs. A GitHub Actions workflow runs the plan on every push and keeps the HTML report as a build artifact.',
    tech: ['JMeter', 'InfluxDB', 'Grafana'],
    github: 'https://github.com/rameshlakmal/Jmeter-githubActions-influxdb-grafana',
    external: '/projects/project3',
  },
  {
    date: '2024-10-21',
    title: 'Playwright Automation with ZeroStep',
    cover: project2Cover,
    id: 'project2',
    description:
      'An experiment with ZeroStep, which adds an ai() step to Playwright tests. Instead of CSS or XPath selectors, each step is a plain-language instruction that is resolved to an action at run time, so tests are less affected by changes to the UI. The project automates a checkout flow and documents practical guidelines for writing reliable instructions.',
    tech: ['Playwright', 'ZeroStep'],
    github: 'https://github.com/rameshlakmal/playwright-and-zerostep',
  },
  {
    date: '2024-10-15',
    title: 'End-to-End Automation with Selenium and Jenkins',
    cover: project4Cover,
    id: 'project4',
    description:
      'A Selenium WebDriver framework in Java, built with Maven and TestNG. It separates page objects, locators and reusable actions, runs data-driven login tests through a TestNG data provider with test data kept in a properties file, and produces Allure reports. The Maven build can run locally or as a Jenkins job.',
    tech: ['Selenium', 'Java', 'TestNG', 'Allure', 'Jenkins'],
    github: 'https://github.com/rameshlakmal/Selenium-Framework-Demo',
  },
  {
    date: '2024-09-15',
    title: 'Web Automation with Playwright',
    cover: project1Cover,
    id: 'project1',
    description:
      'A Playwright framework built on the Page Object Model, covering login, registration and shopping cart flows with shared fixtures and common actions. Tests run on Chromium, Firefox and WebKit, and an Azure DevOps pipeline runs the suite on every push for quick feedback on each change.',
    tech: ['Playwright', 'JavaScript', 'Azure DevOps'],
    github: 'https://github.com/rameshlakmal/Playwright-Practice',
  },
];
