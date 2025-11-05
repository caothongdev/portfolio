import { StaticImageData } from "next/image";

export interface ProjectData {
  LIVE_PREVIEW?: string;
  GITHUB?: string;
  DESCRIPTION: string[];
  NOTE?: string;
  TECH_STACK: string[];
  IMAGE: StaticImageData | string;
  CATEGORY?: string;
  FEATURED?: boolean;
  STATUS?: 'completed' | 'in-progress' | 'planned';
  START_DATE?: string;
  END_DATE?: string;
  TEAM_SIZE?: number;
  ROLE?: string;
}

export interface ProjectsData {
  [key: string]: ProjectData;
}

export interface ProjectFilters {
  category?: string;
  status?: string;
  techStack?: string[];
  featured?: boolean;
}
