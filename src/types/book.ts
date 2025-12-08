export interface Book {
  id: string;
  title: string;
  author: string;
  cover_image?: string;
  slug: string;
  summary?: string;
  content?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  key_takeaways?: string[];
  reading_date?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookFormData {
  title: string;
  author: string;
  cover_image?: string;
  summary?: string;
  content?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  key_takeaways?: string[];
  reading_date?: string;
  published?: boolean;
}
