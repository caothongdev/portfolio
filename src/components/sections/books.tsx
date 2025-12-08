'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Book } from '@/types';

function BooksSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books?published=true');
      if (response.ok) {
        const data = await response.json();
        // Get latest 3 books
        setBooks(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div id="books" className="py-10">
      <h2 className="font-medium text-primary/90 text-base">books i've read.</h2>
      <ul className="flex flex-col gap-12 mt-4 font-normal text-primary/90 text-base">
        {books.length === 0 ? (
          <li className="text-muted-foreground text-sm">No books available yet.</li>
        ) : (
          books.map((book) => (
            <li key={book.id} className="cursor-target">
              <div className="pl-4 border-muted-foreground hover:border-primary border-l size-full transition-all duration-300">
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <p className="text-primary/90 text-lg">
                      {book.title}
                      {book.category && (
                        <span className="inline-block bg-secondary max-sm:mb-2 ml-2 px-2 py-1 rounded text-xs">
                          {book.category}
                        </span>
                      )}
                    </p>
                    <p className="flex items-center gap-1 text-sm">
                      <Link
                        href={`/books/${book.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Read summary{' '}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-up-right"
                        >
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </Link>
                      {book.rating && (
                        <span className="px-1 py-px text-xs">
                          {'★'.repeat(book.rating)} {book.rating}/5
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">by {book.author}</p>
                    <p className="mt-1 text-muted-foreground text-sm text-justify line-clamp-3">
                      {book.summary}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export { BooksSection as Books };
export default BooksSection;
