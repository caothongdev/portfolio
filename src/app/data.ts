import { portfolio } from "@/assets";
import { StaticImageData } from "next/image";



export interface IProjectData {
  LIVE_PREVIEW?: string;
  GITHUB?: string;
  DESCRIPTION: string[];
  NOTE?: string;
  TECH_STACK: string[];
  IMAGE: StaticImageData;
}

export const DATA = {
  HEADER: {
    NAME: "Hoang Cao Thong",
    AGE: "16",
    PRONOUN: "he/him",
    HEADLINE:
      "16yo Vietnamese dev • Building in public on X • Student → Tech Entrepreneur",
    RESUME: "https://caothong.is-a.dev",
    EMAIL: "mailto:caothongdev@gmail.com",
    GITHUB: "https://github.com/caothong",
    LINKEDIN: "https://www.linkedin.com/in/caothongdev",
    YOUTUBE: "https://youtube.com/@caothongdev",
    X: "https://x.com/caothongdev",
    TIKTOK: "https://tiktok.com/@caothongdev",
    FACEBOOK: "https://facebook.com/caothongdev",
    INSTAGRAM: "https://instagram.com/caothongdev",
  },

  ABOUT_ME: {
    INTRO:
      "Hello! I'm Hoang Cao Thong, 16 years old, from Can Tho, Vietnam. I'm a young developer building in public on X and LinkedIn, sharing my journey, lessons learned, and creating value for the community.",
    EXPERTISE:
      "I specialize in building websites, tools, and am passionate about System Design, Product Thinking, and Business Logic. My mission is to document my growth journey and share the most valuable insights I've learned with others.",
    BLOG: "I share my experiences, lessons learned from building projects, and valuable insights that can help others on their journey. Every post is about real problems, real solutions, and real growth.",
  },

  EXPERIENCE: {
    "Freelance Developer": {
      WEBSITE: "https://caothong.is-a.dev",
      POSITION: "Freelance Developer",
      LOCATION: "Can Tho, Vietnam",
      DURATION: "2025 - Present",
      DESCRIPTION: [
        "Building websites and providing services for clients.",
        "Creating tools and web applications to support learning.",
        "Researching and applying System Design and Security in projects.",
      ],
      TECH_STACK: [
        "Python",
        "Discord.py",
        "HTML/CSS",
        "JavaScript",
        "React.js",
        "Next.js",
        "Web Development",
        "Database Management",
        "Git & Github",
      ],
    },
    "Content Creator": {
      WEBSITE: "https://x.com/caothongdev",
      POSITION: "Content Creator",
      LOCATION: "Can Tho, Vietnam",
      DURATION: "2025 - Present",
      DESCRIPTION: [
        "Sharing knowledge about programming, business, and marketing.",
        "Building audience X in the technology field.",
        "Building a young developer community and connecting people with shared passion for technology and business.",
        "Documenting my build in public journey.",
      ],
      TECH_STACK: [
        "Content Creation",
        "Video Editing",
        "Marketing",
        "Personal Branding",
        "Build in Public",
      ],
    },
  },

  PROJECTS: {
    "Portfolio Website": {
      GITHUB: "https://github.com/caothongdev/portfolio",
      DESCRIPTION: [
        "Personal portfolio website designed with responsive layout, modern interface, and optimized user experience.",
        "Built with Next.js 15 and TypeScript, integrated with Tailwind CSS for fast and consistent styling.",
        "Using Framer Motion to create smooth animations and natural transitions.",
        "SEO optimized, supporting dark/light mode and mobile-first design for all devices.",
        "Showcasing my build in public journey and audience X growth.",
      ],
      TECH_STACK: [
        "Next.js 15",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Lucide React",
        "ShadCN UI",
        "Responsive Design",
        "Build in Public",
      ],
      IMAGE: portfolio,
    },
  },

  BLOGS: {
    "Programming Journey of a 16-Year-Old Developer": {
      DATE: "Coming Soon",
      TIME: "5",
      LINK: "https://caothong.is-a.dev/blog/programming-journey",
      DESCRIPTION:
        "Sharing my personal story about starting programming early, challenges faced, and how to overcome them. This post will inspire young people who want to start a programming career from student age.",
    },
    "Build in Public: Growing Audience X as a Young Developer": {
      DATE: "Idea",
      TIME: "6",
      LINK: "https://caothong.is-a.dev/blog/build-in-public",
      DESCRIPTION:
        "Documenting my journey of building in public, sharing progress, failures, and lessons learned while growing audience X.",
    },
  },

  SKILLS: {
    "Programming Languages": ["Python", "JavaScript", "HTML", "CSS"],
    "Bot Development": [
      "Discord.py",
      "Bot Framework",
      "API Integration",
      "Payment Gateway",
      "Database Management",
    ],
    "Web Development": [
      "HTML/CSS",
      "JavaScript",
      "Responsive Design",
      "SEO Optimization",
      "User Experience",
    ],
    "Tools & Automation": [
      "Web Scraping",
      "Marketing Automation",
      "Data Analysis",
      "Task Automation",
      "System Integration",
    ],
    "Business & Marketing": [
      "Product Thinking",
      "Business Logic",
      "Digital Marketing",
      "Content Creation",
      "Personal Branding",
      "Build in Public",
    ],
    "Learning & Development": [
      "System Design",
      "Security",
      "Database Design",
      "Git & Github",
      "Problem Solving",
    ],
    "Content & Communication": [
      "YouTube Content",
      "Educational Content",
      "Technical Writing",
      "Video Editing",
      "English (Learning - Target: IELTS 7.0)",
      "Build in Public",
    ],
  },
};
