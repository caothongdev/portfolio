import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content: string;
          image: string;
          image_alt: string;
          tags: string[];
          category: string;
          status: 'draft' | 'published';
          reading_time: number;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blogs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blogs']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string;
          role: 'admin' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      activities: {
        Row: {
          id: string;
          type: string;
          title: string;
          description: string;
          metadata: Record<string, any>;
          timestamp: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['activities']['Insert']>;
      };
      views: {
        Row: {
          id: string;
          blog_slug: string;
          count: number;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['views']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['views']['Insert']>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          status: 'active' | 'unsubscribed';
          source: string;
          subscribed_at: string;
          unsubscribed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'created_at' | 'subscribed_at'>;
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>;
      };
    };
  };
}
