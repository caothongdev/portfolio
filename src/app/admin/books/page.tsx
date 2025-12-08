'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { SearchBar } from '@/components/ui/search-bar';
import { Pagination } from '@/components/ui/pagination';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { Book } from '@/types';

const ITEMS_PER_PAGE = 10;

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
    setCurrentPage(1);
  }, [books, searchQuery, statusFilter]);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.summary && book.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(book =>
        statusFilter === 'published' ? book.published : !book.published
      );
    }

    setFilteredBooks(filtered);
  };

  const handleDelete = (slug: string) => {
    setBookToDelete(slug);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      const response = await fetch(`/api/books?slug=${bookToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadBooks();
        setDeleteDialogOpen(false);
        setBookToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const togglePublish = async (slug: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/books?slug=${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        await loadBooks();
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = {
    total: books.length,
    published: books.filter(b => b.published).length,
    draft: books.filter(b => !b.published).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Sách</h1>
          <p className="text-muted-foreground">Quản lý tóm tắt sách của bạn</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadBooks}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Link href="/admin/books/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Sách Mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số sách</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nháp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Tìm kiếm theo tên sách, tác giả..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                Tất cả
              </Button>
              <Button
                variant={statusFilter === 'published' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('published')}
              >
                Đã xuất bản
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('draft')}
              >
                Nháp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sách ({filteredBooks.length})</CardTitle>
          <CardDescription>
            Hiển thị {paginatedBooks.length} / {filteredBooks.length} sách
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : paginatedBooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy sách nào.
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition"
                >
                  {book.cover_image && (
                    <div className="w-16 h-24 flex-shrink-0 relative rounded overflow-hidden border">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                        {book.category && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-secondary">
                            {book.category}
                          </span>
                        )}
                        {book.rating && (
                          <div className="mt-1 flex gap-1">
                            {[...Array(book.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-500">★</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href={`/books/${book.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/books/edit/${book.slug}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublish(book.slug, book.published)}
                          className={book.published ? 'text-green-600' : 'text-orange-600'}
                        >
                          {book.published ? 'Công khai' : 'Nháp'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(book.slug)}
                        >
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    {book.summary && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {book.summary}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Xóa sách?"
        description="Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
