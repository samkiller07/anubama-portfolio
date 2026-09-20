// Authoritative Resume & Project Data for Anubama M
export const personalInfo = {
  name: "Anubama M",
  role: "Software Developer",
  tagline: "Specializing in JavaScript, React.js, and Spring Boot",
  careerLevel: "Fresher",
  availability: "Immediate Joiner",
  location: "Chennai, Tamil Nadu, India",
  phone: "+91 8122840684",
  email: "anubamam7@gmail.com",
  linkedin: "https://www.linkedin.com/in/anubama2003/",
  github: "https://github.com/anubamam2003",
  resumePath: "./resume/Anubama_M_Resume.pdf",
  aboutSummary:
    "Passionate and motivated Software Developer with a strong interest in designing, developing, and delivering reliable software solutions using modern full-stack technologies. Eager to apply strong programming, problem-solving, and application development skills in a professional environment while continuously learning and contributing to impactful projects."
};

export const skillsData = [
  {
    category: "Programming Languages",
    icon: "code",
    description: "Core languages for algorithmic logic and application engineering",
    skills: [
      { name: "Java", desc: "Core OOP, Collections, Exception Handling, Spring Ecosystem" },
      { name: "JavaScript", desc: "ES6+, DOM Manipulation, Async/Await, Event Architecture" },
      { name: "Python", desc: "Data Structures, Scripting, Problem Solving" },
      { name: "C", desc: "Structured Programming, Memory Concepts & Foundations" }
    ]
  },
  {
    category: "Frontend Development",
    icon: "layout",
    description: "Modern, component-driven, responsive user interfaces",
    skills: [
      { name: "React.js", desc: "Components, Hooks, State Management, Virtual DOM" },
      { name: "HTML5", desc: "Semantic Markup, Accessibility, Clean Structure" },
      { name: "CSS3", desc: "Flexbox, CSS Grid, Media Queries, Custom Animations" },
      { name: "Bootstrap", desc: "Responsive Grid Utilities & UI Components" },
      { name: "JavaScript (Frontend)", desc: "Interactive UI logic & client-side behavior" }
    ]
  },
  {
    category: "Backend & Services",
    icon: "server",
    description: "Robust server-side logic and enterprise micro-architectures",
    skills: [
      { name: "Spring Boot", desc: "REST Controller, Service Layer, Dependency Injection" },
      { name: "Java Backend", desc: "Enterprise application logic & Data handling" },
      { name: "Node.js", desc: "Server-side JavaScript runtime environment" }
    ]
  },
  {
    category: "Databases & Storage",
    icon: "database",
    description: "Relational and document persistence management",
    skills: [
      { name: "MySQL", desc: "Relational Schemas, SQL Queries, Data Normalization" },
      { name: "MongoDB", desc: "NoSQL Document Storage, Collections & CRUD Operations" }
    ]
  },
  {
    category: "API & Web Services",
    icon: "network",
    description: "Scalable client-server communication standards",
    skills: [
      { name: "REST API", desc: "HTTP Methods (GET, POST, PUT, DELETE), JSON Serialization" },
      { name: "RESTful Web Services", desc: "Stateless architecture, Resource routing & API Contracts" }
    ]
  },
  {
    category: "Version Control & Tooling",
    icon: "git-branch",
    description: "Source code collaboration and version management",
    skills: [
      { name: "Git", desc: "Branching, Merging, Commits, Version History" },
      { name: "GitHub", desc: "Remote Repositories, Issue Tracking, Open Source" }
    ]
  }
];

export const projectsData = [
  {
    id: "ecommerce-frontend",
    title: "E-Commerce Website Frontend",
    year: "2026",
    category: "Frontend",
    featured: true,
    shortDescription: "Modern, responsive e-commerce web application frontend built with React.js, HTML5, CSS3, and Bootstrap.",
    description:
      "Engineered an interactive e-commerce storefront. Developed modular, reusable React components to power product listings, detailed product views, shopping cart interactions, and a user-friendly responsive navigation layout consistent across desktop and mobile devices.",
    keyFeatures: [
      "Built reusable React components for product listings",
      "Interactive product details view with quick specs",
      "Dynamic shopping cart management with state updates",
      "User-friendly navigation and responsive grid layout",
      "Interactive features and smooth transitions",
      "Consistent user experience across all screen viewports"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "React.js", "Bootstrap"],
    githubUrl: "https://github.com/anubamam2003",
    badges: ["React.js", "Component Architecture", "Frontend"]
  },
  {
    id: "employee-management-backend",
    title: "Employee Management System Backend",
    year: "2026",
    category: "Backend",
    featured: true,
    shortDescription: "Enterprise backend service developed with Java and Spring Boot for persistent employee data management.",
    description:
      "Designed and implemented a backend application using Java and the Spring Boot framework to manage employee records. Implemented standard RESTful APIs for full CRUD functionality coupled with MySQL database integration for persistent and reliable data management.",
    keyFeatures: [
      "Engineered robust RESTful APIs following standard HTTP verbs",
      "Create employee records with field validation",
      "Retrieve employee records with structured response formatting",
      "Update employee details with integrity checks",
      "Delete employee records with transactional safety",
      "MySQL database integration with relational schema mappings",
      "API functionality testing and endpoint validation"
    ],
    technologies: ["Java", "Spring Boot", "MySQL", "REST API", "RESTful Web Services"],
    githubUrl: "https://github.com/anubamam2003",
    badges: ["Java", "Spring Boot", "MySQL", "REST APIs"]
  },
  {
    id: "timer-website",
    title: "Interactive Timer Web Application",
    year: "2025",
    category: "Web Application",
    featured: false,
    shortDescription: "Precision timing and countdown web application built with clean native JavaScript and responsive styling.",
    description:
      "Designed a lightweight and responsive timer web application leveraging native JavaScript timing events, interval logic, and an intuitive user interface for desktop and mobile.",
    keyFeatures: [
      "Precise interval timing algorithms",
      "Interactive controls for start, pause, and reset",
      "Responsive layout optimized for quick mobile interactions",
      "Clean UI visual feedback"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/anubamam2003/timer-website",
    badges: ["JavaScript", "DOM Events", "Web App"]
  },
  {
    id: "icecream-store",
    title: "Ice Cream Parlour Showcase UI",
    year: "2025",
    category: "Frontend",
    featured: false,
    shortDescription: "Vibrant storefront web interface showcasing dessert offerings with responsive product cards.",
    description:
      "Crafted an interactive storefront interface highlighting menu items and product varieties using semantic HTML5, modern CSS3 styling, and JavaScript interactions.",
    keyFeatures: [
      "Engaging product category presentation",
      "Responsive layout for mobile and desktop screens",
      "Interactive card micro-interactions",
      "Clean typography and visual hierarchy"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/anubamam2003/icecream",
    badges: ["Frontend", "CSS3", "Responsive Design"]
  },
  {
    id: "pet-portal",
    title: "Pet Care & Adoption Web Portal",
    year: "2025",
    category: "Frontend",
    featured: false,
    shortDescription: "User-friendly web portal designed for pet care information and adoption browsing.",
    description:
      "Developed a responsive web interface tailored for pet adoption browsing and care guidelines with structured card components and clean accessibility.",
    keyFeatures: [
      "Structured pet profile cards with category filters",
      "Responsive multi-column card layout",
      "Accessible navigation and form controls",
      "Clean visual presentation"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/anubamam2003/pet",
    badges: ["Web Portal", "JavaScript", "UI Design"]
  }
];

export const interpersonalSkills = [
  {
    name: "Problem Solving",
    desc: "Analytical approach to debugging code, diagnosing bottlenecks, and solving algorithmic challenges.",
    icon: "lightbulb"
  },
  {
    name: "Logical Thinking",
    desc: "Structured reasoning applied to database schemas, REST endpoint designs, and component trees.",
    icon: "cpu"
  },
  {
    name: "Team Collaboration",
    desc: "Proactive team player committed to transparent communication, code reviews, and shared delivery goals.",
    icon: "users"
  },
  {
    name: "Communication",
    desc: "Articulate technical concepts, API contracts, and project updates clearly in written and verbal formats.",
    icon: "message-square"
  },
  {
    name: "Quick Learning",
    desc: "Eager and agile in adopting new libraries, frameworks, and engineering best practices.",
    icon: "zap"
  },
  {
    name: "Adaptability",
    desc: "Comfortable navigating evolving technical requirements and diverse full-stack project demands.",
    icon: "sparkles"
  },
  {
    name: "Time Management",
    desc: "Disciplined scheduling, prioritization of critical tasks, and dependable on-time delivery.",
    icon: "clock"
  }
];

export const educationData = [
  {
    degree: "Bachelor of Technology (B.Tech) – Biotechnology",
    institution: "Kalasalingam Academy of Research and Education",
    duration: "2021 – 2025",
    highlights: "Rigorous analytical training, research methodologies, computational logic, and project management fundamentals."
  }
];

export const certificationsData = [
  {
    title: "Java Full Stack Development",
    location: "Chennai",
    year: "2026",
    category: "Full Stack Development",
    skills: ["Java", "Spring Boot", "React.js", "REST APIs", "MySQL", "CRUD Architecture"]
  },
  {
    title: "Python Programming Language",
    location: "Viruthunagar",
    year: "2024",
    category: "Programming & Logic",
    skills: ["Python Core", "Data Structures", "Algorithmic Logic", "Modular Scripting"]
  }
];
