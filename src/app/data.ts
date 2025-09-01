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
    NAME: "Hoàng Cao Thống",
    AGE: "16",
    PRONOUN: "he/him",
    HEADLINE:
      "Lập trình viên trẻ với tham vọng xây dựng thương hiệu cá nhân và tự do tài chính.",
    RESUME: "https://caothong.is-a.dev",
    EMAIL: "mailto:caothongdev@gmail.com",
    GITHUB: "https://github.com/caothong",
    LINKEDIN: "https://www.linkedin.com/in/caothongdev",
    YOUTUBE: "https://youtube.com/@caothongdev",
    TIKTOK: "https://tiktok.com/@caothongdev",
    FACEBOOK: "https://facebook.com/caothongdev",
    INSTAGRAM: "https://instagram.com/caothongdev",
  },

  ABOUT_ME: {
    INTRO:
      "Xin chào! Tôi là Hoàng Cao Thống, 16 tuổi, đến từ Hậu Giang & Cần Thơ. Tôi là một lập trình viên trẻ với quyết tâm và tham vọng lớn trong việc xây dựng thương hiệu cá nhân thông qua lập trình và kinh doanh.",
    EXPERTISE:
      "Tôi chuyên về xây dựng website, tools và quan tâm đến System Design, Product Thinking, Business Logic. Mục tiêu của tôi là trở thành entrepreneur technology và đạt được tự do tài chính từ sớm.",
    BLOG: "Tôi dự định xây dựng kênh YouTube dạy lập trình Python cho học sinh, sinh viên và những người muốn kiếm tiền từ lập trình.",
  },

  EXPERIENCE: {
    "Freelance Developer": {
      WEBSITE: "https://caothong.is-a.dev",
      POSITION: "Lập trình viên tự do",
      LOCATION: "Cần Thơ, Việt Nam",
      DURATION: "2025 - Present",
      DESCRIPTION: [
        "Xây dựng website và cung cấp dịch vụ cho khách hàng.",
        "Tạo ra các tools và ứng dụng web hỗ trợ học tập.",
        "Nghiên cứu và áp dụng System Design, Security trong các dự án.",
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
      WEBSITE: "https://youtube.com/@caothongdev",
      POSITION: "Nhà sáng tạo nội dung",
      LOCATION: "Cần Thơ, Việt Nam",
      DURATION: "2025 - Present",
      DESCRIPTION: [
        "Chia sẻ kiến thức về lập trình, kinh doanh và marketing.",
        "Xây dựng thương hiệu cá nhân trong lĩnh vực công nghệ.",
        "Xây dựng cộng đồng developer trẻ và kết nối những người có chung đam mê công nghệ, kinh doanh.",
      ],
      TECH_STACK: [
        "Content Creation",
        "Video Editing",
        "Marketing",
        "Personal Branding",
      ],
    },
  },

  PROJECTS: {
    "Portfolio Website": {
      GITHUB: "https://github.com/caothongdev/portfolio",
      DESCRIPTION: [
        "Website portfolio cá nhân được thiết kế responsive với giao diện hiện đại và trải nghiệm người dùng tối ưu.",
        "Xây dựng bằng Next.js 15 với TypeScript, tích hợp Tailwind CSS cho styling nhanh chóng và nhất quán.",
        "Sử dụng Framer Motion để tạo animations mượt mà và chuyển động tự nhiên.",
        "Tối ưu SEO, hỗ trợ dark/light mode và mobile-first design cho mọi thiết bị.",
      ],
      TECH_STACK: [
        "Next.js 15",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Lucide React",
        "ShadCN UI",
        "Responsive Design",
      ],
      IMAGE: portfolio,
    },
  },

  BLOGS: {
    "Hành trình lập trình của một developer 16 tuổi": {
      DATE: "Sắp ra mắt",
      TIME: "5",
      LINK: "https://caothong.is-a.dev/blog/hanh-trinh-lap-trinh",
      DESCRIPTION:
        "Chia sẻ câu chuyện cá nhân về hành trình học lập trình từ sớm, những khó khăn gặp phải và cách vượt qua. Bài viết sẽ truyền cảm hứng cho các bạn trẻ muốn bắt đầu sự nghiệp lập trình từ tuổi học sinh.",
    },
    "Tư duy kinh doanh trong lập trình: Marketing + Code = Success": {
      DATE: "Ý tưởng",
      TIME: "6",
      LINK: "https://caothong.is-a.dev/blog/tu-duy-kinh-doanh",
      DESCRIPTION:
        "Khám phá cách kết hợp kỹ năng lập trình với tư duy kinh doanh để tạo ra những sản phẩm có thể bán được. Từ việc nghiên cứu thị trường đến product development và customer acquisition.",
    },
  },

  SKILLS: {
    "Ngôn ngữ lập trình": ["Python", "JavaScript", "HTML", "CSS"],
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
    ],
    "Học tập & Phát triển": [
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
    ],
  },
};
