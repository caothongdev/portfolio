'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/types';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books?published=true');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const data: Book[] = await response.json();
        const uniqueCategories = [...new Set(data.map(book => book.category).filter(Boolean))];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400 text-xl">
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white border-b-4 border-black">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-yellow-300 border-2 border-black px-3 py-1 font-bold text-sm mb-4 rotate-2 transform">
              📚 BOOK SUMMARIES
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Sách Đã Đọc <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800" style={{ WebkitTextStroke: '2px black', color: 'black' }}>
                & Tóm Tắt
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-['Patrick_Hand',_cursive]">
              Những cuốn sách tôi đã đọc, tóm tắt lại và chia sẻ những bài học quý giá.
            </p>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 font-bold border-2 border-black transition ${
                selectedCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 font-bold border-2 border-black transition ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="border-4 border-black border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-bold">Chưa có sách nào trong danh mục này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.slug}`}
                  className="group block"
                >
                  <div className="bg-white border-4 border-black p-6 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {/* Cover Image */}
                    {book.cover_image && (
                      <div className="relative h-64 mb-4 border-2 border-black overflow-hidden">
                        <Image
                          src={book.cover_image}
                          alt={book.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Category Badge */}
                    {book.category && (
                      <span className="inline-block bg-yellow-100 border-2 border-black px-3 py-1 text-xs font-bold mb-3">
                        {book.category}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl font-black mb-2 group-hover:underline decoration-4 decoration-yellow-400 underline-offset-4">
                      {book.title}
                    </h2>

                    {/* Author */}
                    <p className="text-gray-600 font-bold mb-3">by {book.author}</p>

                    {/* Rating */}
                    {renderStars(book.rating)}

                    {/* Summary */}
                    {book.summary && (
                      <p className="text-gray-700 mt-4 line-clamp-3 font-['Patrick_Hand',_cursive] text-lg">
                        {book.summary}
                      </p>
                    )}

                    {/* Tags */}
                    {book.tags && book.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {book.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 border border-black px-2 py-1"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read More Button */}
                    <div className="mt-6 flex items-center font-bold text-black group-hover:text-gray-700">
                      Đọc tóm tắt
                      <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white border-t-4 border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6 uppercase text-yellow-300">
            Gợi Ý Cho Tôi?
          </h2>
          <p className="text-xl mb-8 font-['Patrick_Hand',_cursive]">
            Bạn có cuốn sách hay muốn giới thiệu? Hãy cho tôi biết!
          </p>
          <Link
            href="/#contact"
            className="inline-block bg-yellow-300 text-black font-bold py-4 px-8 border-2 border-white hover:bg-yellow-400 transition shadow-[4px_4px_0px_0px_#fff]"
          >
            Liên Hệ Ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
