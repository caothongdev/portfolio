export interface BlogData {
  DATE: string;
  TIME: string;
  LINK: string;
  DESCRIPTION: string;
  CONTENT?: string;
  TAGS?: string[];
  STATUS?: 'draft' | 'published';
  AUTHOR?: string;
  CREATED_AT?: string;
  UPDATED_AT?: string;
  IMAGE?: string;
  IMAGE_ALT?: string;
  CATEGORY?: string;
  VIEWS?: number;
  LIKES?: number;
}

export interface BlogsData {
  [key: string]: BlogData;
}

export interface BlogFormData {
  title: string;
  date: string;
  time: string;
  link: string;
  description: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  category: string;
  image?: string;
  imageAlt?: string;
}

export interface BlogFilters {
  category?: string;
  status?: 'draft' | 'published';
  tags?: string[];
  search?: string;
}

export interface BlogApiResponse {
  success: boolean;
  message?: string;
  data?: BlogsData | BlogData;
  error?: string;
}
