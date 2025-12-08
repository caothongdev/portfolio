'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/types';

interface ModalData {
  title: string;
  desc: string;
  action: string;
  icon: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchBook(params.slug as string);
    }
  }, [params.slug]);

  const fetchBook = async (slug: string) => {
    try {
      const response = await fetch(`/api/books?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setBook(data);
      } else {
        router.push('/books');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      router.push('/books');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (data: ModalData) => {
    setModalData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400 text-3xl">
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="border-4 border-black border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white border-b-4 border-black">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <Link
            href="/books"
            className="inline-flex items-center font-bold mb-6 hover:underline decoration-4 decoration-yellow-400 underline-offset-4"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Quay lại danh sách
          </Link>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Book Cover */}
            {book.cover_image && (
              <div className="md:w-1/3">
                <div className="border-4 border-black p-2 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:rotate-0 transition duration-500">
                  <div className="relative h-[400px]">
                    <Image
                      src={book.cover_image}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Book Info */}
            <div className="md:w-2/3">
              {book.category && (
                <span className="inline-block bg-yellow-300 border-2 border-black px-3 py-1 font-bold text-sm mb-4 rotate-2 transform">
                  {book.category}
                </span>
              )}
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
                {book.title}
              </h1>
              
              <p className="text-2xl text-gray-600 font-bold mb-4">
                Tác giả: {book.author}
              </p>

              {renderStars(book.rating)}

              {book.summary && (
                <p className="text-xl text-gray-700 mt-6 font-['Patrick_Hand',_cursive]">
                  {book.summary}
                </p>
              )}

              {book.tags && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {book.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 border-2 border-black px-4 py-2 font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Key Takeaways Section */}
      {book.key_takeaways && book.key_takeaways.length > 0 && (
        <section className="py-20 bg-[#fdfbf7]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4 uppercase tracking-wide">
                Điểm Chính Rút Ra
              </h2>
              <p className="text-xl font-['Patrick_Hand',_cursive] max-w-2xl mx-auto">
                Những bài học quý giá từ cuốn sách này
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {book.key_takeaways.map((takeaway, index) => (
                <div
                  key={index}
                  className="bg-white border-4 border-black p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group"
                  onClick={() => openModal({
                    title: `Bài học ${index + 1}`,
                    desc: takeaway,
                    action: 'Áp dụng ngay bài học này vào công việc hoặc cuộc sống của bạn!',
                    icon: 'lightbulb'
                  })}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-5xl font-black text-gray-200 group-hover:text-yellow-300 transition">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="material-symbols-outlined text-4xl">lightbulb</span>
                  </div>
                  <p className="text-gray-700 font-['Patrick_Hand',_cursive] text-lg">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      {book.content && (
        <section className="py-20 border-t-4 border-black bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black mb-8 uppercase">Tóm Tắt Chi Tiết</h2>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: book.content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Modal */}
      {modalOpen && modalData && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">​</span>
            <div className="inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-4 border-black">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10 border-2 border-black">
                    <span className="material-symbols-outlined text-black">
                      {modalData.icon}
                    </span>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-2xl leading-6 font-black text-gray-900 uppercase">
                      {modalData.title}
                    </h3>
                    <div className="mt-4">
                      <p className="text-gray-600 text-lg font-['Patrick_Hand',_cursive]">
                        {modalData.desc}
                      </p>
                      <div className="mt-4 p-4 bg-gray-100 border-l-4 border-black">
                        <p className="font-bold text-sm uppercase mb-1">Hành động:</p>
                        <p className="text-sm text-gray-800">{modalData.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t-2 border-black">
                <button
                  type="button"
                  className="w-full inline-flex justify-center border-2 border-black shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-black text-white border-t-4 border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6 uppercase text-yellow-300">
            Khám Phá Thêm Sách
          </h2>
          <p className="text-xl mb-8 font-['Patrick_Hand',_cursive]">
            Xem thêm những cuốn sách khác tôi đã đọc và tóm tắt
          </p>
          <Link
            href="/books"
            className="inline-block bg-yellow-300 text-black font-bold py-4 px-8 border-2 border-white hover:bg-yellow-400 transition shadow-[4px_4px_0px_0px_#fff]"
          >
            Quay Lại Thư Viện
          </Link>
        </div>
      </section>
    </div>
  );
}
