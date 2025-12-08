import { supabase } from './supabase';
import type { Book, BookFormData } from '@/types';

export class BookManager {
  private static instance: BookManager;

  static getInstance(): BookManager {
    if (!this.instance) {
      this.instance = new BookManager();
    }
    return this.instance;
  }

  // Get all books (with optional filter for published only)
  async getBooks(publishedOnly: boolean = false): Promise<Book[]> {
    try {
      let query = supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (publishedOnly) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  // Get a single book by slug
  async getBookBySlug(slug: string): Promise<Book | null> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
  }

  // Get books by category
  async getBooksByCategory(category: string): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('category', category)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching books by category:', error);
      return [];
    }
  }

  // Get books by tag
  async getBooksByTag(tag: string): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .contains('tags', [tag])
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching books by tag:', error);
      return [];
    }
  }

  // Create a new book
  async createBook(bookData: BookFormData): Promise<Book | null> {
    try {
      // Generate slug from title
      const slug = this.generateSlug(bookData.title);

      // Check if slug already exists
      const existing = await this.getBookBySlug(slug);
      if (existing) {
        throw new Error('A book with this title already exists!');
      }

      const { data, error } = await supabase
        .from('books')
        .insert([{ ...bookData, slug }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  // Update an existing book
  async updateBook(slug: string, bookData: Partial<BookFormData>): Promise<Book | null> {
    try {
      // If title is being updated, generate new slug
      let updateData: any = { ...bookData };
      if (bookData.title) {
        const newSlug = this.generateSlug(bookData.title);
        if (newSlug !== slug) {
          // Check if new slug already exists
          const existing = await this.getBookBySlug(newSlug);
          if (existing) {
            throw new Error('A book with this title already exists!');
          }
          updateData.slug = newSlug;
        }
      }

      const { data, error } = await supabase
        .from('books')
        .update(updateData)
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  // Delete a book
  async deleteBook(slug: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('slug', slug);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  }

  // Search books
  async searchBooks(query: string): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%,summary.ilike.%${query}%`)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  // Get all unique categories
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;
      
      const categories = [...new Set(data.map(book => book.category).filter(Boolean))];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get all unique tags
  async getTags(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('tags');

      if (error) throw error;
      
      const allTags = data.flatMap(book => book.tags || []);
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags.sort();
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  // Toggle publish status
  async togglePublish(slug: string): Promise<Book | null> {
    try {
      const book = await this.getBookBySlug(slug);
      if (!book) throw new Error('Book not found');

      const { data, error } = await supabase
        .from('books')
        .update({ published: !book.published })
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling publish status:', error);
      return null;
    }
  }

  // Helper function to generate URL-friendly slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD') // Normalize Vietnamese characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  }
}
