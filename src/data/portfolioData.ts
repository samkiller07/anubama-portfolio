import { Project, SkillCategory, Certification, Education } from '../types';

export const personalInfo = {
  name: 'Anubama M',
  role: 'Software Developer',
  tagline: 'Specializing in JavaScript, React.js, and Spring Boot',
  careerLevel: 'Fresher',
  availability: 'Immediate Joiner',
  location: 'Chennai, Tamil Nadu, India',
  phone: '+91 8122840684',
  email: 'anubamam7@gmail.com',
  linkedin: 'https://www.linkedin.com/in/anubama2003/',
  github: 'https://github.com/anubamam2003',
  instagram: 'https://www.instagram.com/anubama_murugesan_/',
  resumePath: './resume/Anubama_M_Resume.pdf',
  about: {
    summary:
      'Passionate and motivated Software Developer with a strong interest in designing, developing, and delivering reliable software solutions using modern full-stack technologies. Eager to apply strong programming, problem-solving, and application development skills in a professional environment while continuously learning and contributing to impactful projects.',
    highlights: [
      {
        title: 'Modern Frontend',
        description: 'Building dynamic, component-driven user interfaces with React.js, JavaScript, and responsive design systems.'
      },
      {
        title: 'Robust Backend & APIs',
        description: 'Architecting structured RESTful web services and enterprise backends using Java and Spring Boot.'
      },
      {
        title: 'Data & Persistence',
        description: 'Integrating relational (MySQL) and NoSQL (MongoDB) databases with clean CRUD patterns.'
      },
      {
        title: 'Immediate Availability',
        description: 'Ready to contribute immediately to engineering teams with rapid learning agility and dedication.'
      }
    ]
  }
};

export const skillsData: SkillCategory[] = [
  {
    name: 'Programming Languages',
    iconName: 'Code2',
    description: 'Core languages for algorithmic problem solving and development',
    skills: [
      { name: 'Java', description: 'Core OOP, Collections, Multi-threading & Spring Ecosystem' },
      { name: 'JavaScript', description: 'ES6+, DOM Manipulation, Async/Await & Event Handling' },
      { name: 'Python', description: 'Data structures, Scripting & Algorithmic logic' },
      { name: 'C', description: 'Foundational programming & Memory management fundamentals' }
    ]
  },
  {
    name: 'Frontend Development',
    iconName: 'Layout',
    description: 'Modern, responsive, component-based user interfaces',
    skills: [
      { name: 'React.js', description: 'Functional components, Hooks, State management & Props' },
      { name: 'HTML5', description: 'Semantic markup, Web accessibility & Modern structure' },
      { name: 'CSS3', description: 'Flexbox, CSS Grid, Responsive design & Keyframes' },
      { name: 'Bootstrap', description: 'Rapid grid systems, Utilities & Responsive layouts' },
      { name: 'JavaScript (ES6+)', description: 'Interactive frontend behavior and modular logic' }
    ]
  },
  {
    name: 'Backend & Services',
    iconName: 'Server',
    description: 'Scalable server-side architecture and business logic',
    skills: [
      { name: 'Spring Boot', description: 'REST APIs, Dependency Injection & MVC Architecture' },
      { name: 'Java Backend', description: 'Enterprise service layer, Data handling & Controller logic' },
      { name: 'Node.js', description: 'Server-side JavaScript runtime environments' }
    ]
  },
  {
    name: 'Databases & Storage',
    iconName: 'Database',
    description: 'Relational and document storage solutions',
    skills: [
      { name: 'MySQL', description: 'Relational schema design, SQL Queries & Data integrity' },
      { name: 'MongoDB', description: 'Document-oriented NoSQL storage & CRUD operations' }
    ]
  },
  {
    name: 'API & Web Services',
    iconName: 'Network',
    description: 'Seamless client-server data exchange protocols',
    skills: [
      { name: 'REST API', description: 'Standard HTTP methods (GET, POST, PUT, DELETE) & JSON communication' },
      { name: 'RESTful Web Services', description: 'Stateless communication, Endpoint design & API structure' }
    ]
  },
  {
    name: 'Version Control & Tools',
    iconName: 'GitBranch',
    description: 'Source code management and team workflow tooling',
    skills: [
      { name: 'Git', description: 'Branching, Commit management, Merging & Local versioning' },
      { name: 'GitHub', description: 'Remote repository management, Collaboration & Open source' }
    ]
  }
];

export const interpersonalSkills = [
  {
    name: 'Problem Solving',
    description: 'Methodical approach to debugging, algorithmic reasoning, and breaking down complex requirements.',
    icon: 'Lightbulb'
  },
  {
    name: 'Logical Thinking',
    description: 'Analytical mindset focused on writing clean, efficient, and maintainable software logic.',
    icon: 'Cpu'
  },
  {
    name: 'Team Collaboration',
    description: 'Effective team player committed to clear communication, code reviews, and shared milestones.',
    icon: 'Users'
  },
  {
    name: 'Communication',
    description: 'Articulate technical and non-technical ideas clearly across documentation and discussions.',
    icon: 'MessageSquare'
  },
  {
    name: 'Quick Learning',
    description: 'Rapidly assimilates new frameworks, tech stacks, and development workflows.',
    icon: 'Zap'
  },
  {
    name: 'Adaptability',
    description: 'Flexible and resilient in dynamic project environments and evolving project scopes.',
    icon: 'Sparkles'
  },
  {
    name: 'Time Management',
    description: 'Organized execution ensuring task prioritization, code quality, and on-schedule delivery.',
    icon: 'Clock'
  }
];

export const projectsData: Project[] = [
  {
    id: 'ecommerce-frontend',
    title: 'E-Commerce Website Frontend',
    year: '2026',
    category: 'Frontend',
    featured: true,
    shortDescription: 'Modern, component-driven e-commerce interface built with React.js, HTML5, CSS3, and Bootstrap.',
    description:
      'Developed a responsive and intuitive e-commerce web application frontend. Built modular, reusable React components to deliver a seamless shopping experience with dynamic product listings, product detail views, interactive shopping cart management, and fluid multi-device navigation.',
    keyFeatures: [
      'Reusable React components for scalable catalog management',
      'Dynamic product listing showcase with structured layout',
      'Interactive product details view with instant feedback',
      'Shopping cart state management with real-time updates',
      'User-friendly responsive navigation across desktop & mobile',
      'Clean interactive features with cross-browser compatibility'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Bootstrap'],
    githubUrl: 'https://github.com/anubamam2003',
    badges: ['React.js', 'Component Architecture', 'Responsive UI']
  },
  {
    id: 'employee-management-backend',
    title: 'Employee Management System Backend',
    year: '2026',
    category: 'Backend',
    featured: true,
    shortDescription: 'Enterprise backend application engineered with Java and Spring Boot for persistent employee data management.',
    description:
      'Engineered a robust backend service using Java and Spring Boot framework to manage employee records. Implemented comprehensive RESTful endpoints for full CRUD operations, paired with MySQL relational database integration for persistent and transactional data integrity.',
    keyFeatures: [
      'Engineered RESTful APIs following standard HTTP methods',
      'Create, Retrieve, Update, and Delete (CRUD) employee records',
      'MySQL database integration with relational schema mapping',
      'Persistent data management with validation checks',
      'Systematic API functionality testing and verification',
      'Clean separation of Controller, Service, and Repository layers'
    ],
    technologies: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'RESTful Web Services'],
    githubUrl: 'https://github.com/anubamam2003',
    badges: ['Java', 'Spring Boot', 'REST APIs', 'MySQL']
  },
  {
    id: 'timer-website',
    title: 'Interactive Timer Web Application',
    year: '2025',
    category: 'Web Application',
    featured: false,
    shortDescription: 'Precision web-based countdown and timing application built with modern JavaScript and responsive styling.',
    description:
      'Designed and built a sleek web application providing accurate timer and countdown capabilities. Utilizes native JavaScript timing events, modular code structure, and responsive layout for desktop and mobile usability.',
    keyFeatures: [
      'Precise interval-based timing algorithms',
      'Interactive controls for start, pause, reset, and custom durations',
      'Responsive design ensuring crisp display on all screen sizes',
      'Clean UI with fluid visual feedback'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    githubUrl: 'https://github.com/anubamam2003/timer-website',
    badges: ['JavaScript', 'DOM Manipulation', 'UI/UX']
  },
  {
    id: 'icecream-store',
    title: 'Ice Cream Parlour Showcase UI',
    year: '2025',
    category: 'Frontend',
    featured: false,
    shortDescription: 'Vibrant and responsive storefront web interface showcasing menu offerings with interactive cards.',
    description:
      'Crafted a modern promotional web storefront interface highlighting specialty dessert menus. Built with clean semantic HTML5, modern CSS styling, and interactive JavaScript features for intuitive customer browsing.',
    keyFeatures: [
      'Visually engaging product category presentation',
      'Responsive layout optimized for mobile browsing',
      'Smooth micro-interactions and hover effects',
      'Structured catalog layout'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    githubUrl: 'https://github.com/anubamam2003/icecream',
    badges: ['Frontend', 'Responsive Design', 'CSS3']
  },
  {
    id: 'pet-portal',
    title: 'Pet Care & Adoption Web Portal',
    year: '2025',
    category: 'Frontend',
    featured: false,
    shortDescription: 'User-centric web portal interface designed for pet care information and adoption browsing.',
    description:
      'Developed a responsive web interface focused on pet care resources and adoption profile presentation. Features structured layout cards, accessible navigation, and interactive form elements.',
    keyFeatures: [
      'Structured pet profile cards with category highlights',
      'Responsive navigation tailored for touch and desktop',
      'User-friendly information architecture',
      'Accessible semantic structure'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    githubUrl: 'https://github.com/anubamam2003/pet',
    badges: ['Web Portal', 'JavaScript', 'UI Design']
  }
];

export const educationData: Education[] = [
  {
    degree: 'Bachelor of Technology (B.Tech) – Biotechnology',
    institution: 'Kalasalingam Academy of Research and Education',
    duration: '2021 – 2025',
    status: 'Graduated'
  }
];

export const certificationsData: Certification[] = [
  {
    title: 'Java Full Stack Development',
    location: 'Chennai',
    year: '2026',
    category: 'Full Stack Engineering',
    skillsCovered: ['Java', 'Spring Boot', 'React.js', 'REST APIs', 'MySQL', 'Full Stack Architecture']
  },
  {
    title: 'Python Programming Language',
    location: 'Viruthunagar',
    year: '2024',
    category: 'Programming & Logic',
    skillsCovered: ['Python Core', 'Data Structures', 'Algorithmic Problem Solving', 'Modular Programming']
  }
];
