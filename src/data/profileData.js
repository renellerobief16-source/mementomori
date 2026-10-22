export const profileData = {
  name: "Renelle Robie D. Lopez",
  tagline: "Full-Stack Web Developer & UI Engineer",
  bio: "Passionate full-stack developer crafting scalable, resilient web applications with modern architectures, fluid glassmorphism aesthetics, and real-time APIs.",
  location: "Philippines",
  status: "Available for Projects & Full-time Roles",
  email: "renellerobieF16@gmail.com",
  githubUsername: "renellerobief16-source",
  githubUrl: "https://github.com/renellerobief16-source",
  linkedinUrl: "https://www.linkedin.com/in/renelle-robie-lopez-a458b1267/?isSelfProfile=true",
  facebookUrl: "https://www.facebook.com/renellerobie.flordeliz",
  instagramUrl: "https://www.instagram.com/redmhor/?hl=en",
  onlinejobsUrl: "https://v2.onlinejobs.ph/jobseekers/info/5027504",
  resumeUrl: "#contact",

  stats: [
    { label: "Public Repositories", value: "23+", icon: "Code2" },
    { label: "Primary Focus", value: "Full-Stack Web", icon: "Layers" },
    { label: "Deployment", value: "Vercel & Cloud", icon: "Cloud" },
    { label: "Code Quality", value: "Modern & Clean", icon: "Sparkles" },
  ],

  skillCategories: [
    {
      title: "Frontend Engineering",
      color: "from-cyan-500 to-blue-500",
      skills: [
        { name: "React.js", level: 90, icon: "Atom" },
        { name: "JavaScript (ES6+)", level: 92, icon: "FileCode" },
        { name: "Tailwind CSS", level: 94, icon: "Palette" },
        { name: "HTML5 & Semantic UI", level: 95, icon: "Layout" },
        { name: "Responsive & Mobile UI", level: 90, icon: "Smartphone" },
      ],
    },
    {
      title: "Backend & APIs",
      color: "from-violet-500 to-purple-500",
      skills: [
        { name: "Node.js & Express", level: 85, icon: "Server" },
        { name: "RESTful API Design", level: 88, icon: "Network" },
        { name: "Authentication & JWT", level: 82, icon: "ShieldCheck" },
        { name: "CRUD Architectures", level: 90, icon: "Database" },
      ],
    },
    {
      title: "Databases & Cloud",
      color: "from-emerald-500 to-teal-500",
      skills: [
        { name: "MongoDB / NoSQL", level: 82, icon: "Database" },
        { name: "MySQL / Relational DB", level: 80, icon: "Table" },
        { name: "Vercel Deployment", level: 90, icon: "CloudLightning" },
        { name: "Git & Version Control", level: 88, icon: "GitBranch" },
      ],
    },
    {
      title: "Tools & Methodologies",
      color: "from-amber-500 to-rose-500",
      skills: [
        { name: "Vite & Modern Tooling", level: 90, icon: "Zap" },
        { name: "Figma to Code", level: 85, icon: "Figma" },
        { name: "API Debugging (Postman)", level: 88, icon: "Terminal" },
        { name: "Agile Problem Solving", level: 92, icon: "Brain" },
      ],
    },
  ],

  projects: [
    {
      id: "libralink",
      title: "Libralink — Digital Library & Catalog System",
      category: "Full-Stack",
      description: "A comprehensive digital library and book cataloging platform enabling catalog exploration, user borrowing, inventory tracking, and smooth search experiences.",
      fullDescription: "Libralink is a full-featured web platform engineered to modernize book lending, catalog searches, and library user interactions. Features an intuitive dashboard, categorized book indices, responsive navigation, and seamless state management.",
      tags: ["JavaScript", "React", "Tailwind CSS", "Vercel", "REST APIs"],
      image: "https://images.unsplash.com/photo-1507842229451-7973a987d609?auto=format&fit=crop&w=1200&q=80",
      liveUrl: "https://libralinkkk.vercel.app",
      githubUrl: "https://github.com/renellerobief16-source/Libralink",
      featured: true,
      metrics: {
        status: "Production Ready",
        architecture: "Component-driven SPA",
        highlight: "Real-time catalog search & responsive grid",
      },
      keyFeatures: [
        "Live responsive book catalog with category filters",
        "Interactive book card views with status indicators",
        "Streamlined search and sorting algorithms",
        "Vercel cloud production deployment with instant edge loading"
      ]
    },
    {
      id: "dayrit-clinic",
      title: "Dayrit Clinic — Healthcare & Patient Portal",
      category: "Full-Stack",
      description: "A patient appointment scheduling and clinical consultation portal designed for modern clinics with service overviews and booking workflows.",
      fullDescription: "Built to streamline patient-to-clinic communication, Dayrit Clinic provides patients with clear insight into clinical services, doctor availability, appointment requests, and location details with high-contrast accessibility.",
      tags: ["JavaScript", "HTML5", "CSS3 / Tailwind", "Vercel", "Medical UI"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      liveUrl: "https://dayrit-clinic.vercel.app",
      githubUrl: "https://github.com/renellerobief16-source/dayrit-clinic",
      featured: true,
      metrics: {
        status: "Deployed Live",
        architecture: "Responsive Web Portal",
        highlight: "Streamlined patient booking UI & doctor directory",
      },
      keyFeatures: [
        "Interactive consultation booking interface",
        "Clinical services breakdown with pricing & details",
        "Emergency hotline & instant clinic contact access",
        "Mobile-first responsive design tested on multiple viewports"
      ]
    },
    {
      id: "dev-hub",
      title: "DevPulse — Developer Portfolio & Code Hub",
      category: "Frontend",
      description: "An advanced portfolio web application integrating real-time GitHub REST APIs, glassmorphic UI, dynamic themes, and reactive interactive modules.",
      fullDescription: "Engineered with React 19, Tailwind CSS, and Framer Motion, DevPulse showcases live GitHub commits, star metrics, and repository analytics with ultra-smooth 60fps micro-animations.",
      tags: ["React", "Vite", "Tailwind CSS", "GitHub API", "Framer Motion"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      liveUrl: "#",
      githubUrl: "https://github.com/renellerobief16-source",
      featured: true,
      metrics: {
        status: "Active System",
        architecture: "Vite + React SPA",
        highlight: "Live GitHub API synchronization & glass aesthetic",
      },
      keyFeatures: [
        "Live synchronization with GitHub REST API endpoints",
        "Dark futuristic glassmorphism theme with GPU-accelerated motion",
        "Interactive project inspection modal with architectural breakdowns",
        "Direct email integration & interactive confetti celebrations"
      ]
    },
    {
      id: "partyneeds",
      title: "PartyNeeds — Event Logistics & Supply Hub",
      category: "Web Apps",
      description: "An inventory and catering supply portal for organizing celebrations, party rentals, packages, and logistics management.",
      fullDescription: "PartyNeeds allows event organizers to browse decoration packages, reserve party rental supplies, and calculate estimated costs for birthday, wedding, and corporate gatherings.",
      tags: ["JavaScript", "CSS3", "HTML5", "Event Management"],
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      liveUrl: "https://github.com/renellerobief16-source/partyneeds",
      githubUrl: "https://github.com/renellerobief16-source/partyneeds",
      featured: false,
      metrics: {
        status: "Repository Active",
        architecture: "Modular Web Application",
        highlight: "Event packaging & supply catalog",
      },
      keyFeatures: [
        "Event package selection and rental pricing lists",
        "Clean item gallery with booking inquiry form",
        "Fast responsive interface for on-the-go party planners"
      ]
    }
  ],

  experience: [
    {
      role: "Full-Stack Web Developer",
      organization: "Independent & Open Source Projects",
      period: "2024 — Present",
      description: "Designing, building, and deploying full-stack web applications using React, Node.js, Tailwind CSS, and Vercel. Developing real-time API integrations and cloud-hosted solutions.",
      highlights: [
        "Architected and deployed Libralink (digital library catalog) with live Vercel cloud hosting",
        "Developed Dayrit Clinic healthcare portal with responsive mobile-first UI",
        "Maintained 23+ active repositories on GitHub covering web apps, frontend templates, and APIs"
      ]
    },
    {
      role: "Web Application Specialist",
      organization: "Client & Freelance Solutions",
      period: "2023 — 2024",
      description: "Delivered responsive web interfaces, appointment booking portals, and custom web applications tailored to small business operational needs.",
      highlights: [
        "Implemented clean UI/UX prototypes and converted designs into high-performance code",
        "Integrated interactive forms and automated client notifications",
        "Optimized web page loading speeds and cross-device compatibility"
      ]
    }
  ]
};
