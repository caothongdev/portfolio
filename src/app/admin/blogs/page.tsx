"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye, Filter, Download, Upload, RefreshCw } from "lucide-react";
import Link from "next/link";
import { BlogManager, BlogsData } from "@/lib/blog-manager";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity-logger";

const ITEMS_PER_PAGE = 10;

export default function BlogsManagement() {
  const [blogs, setBlogs] = useState<BlogsData>({});
  const [filteredBlogs, setFilteredBlogs] = useState<BlogsData>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const blogManager = BlogManager.getInstance();

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
    setCurrentPage(1); // Reset to first page when filters change
  }, [blogs, searchQuery, statusFilter]);

  const loadBlogs = () => {
    setIsLoading(true);
    try {
      const loadedBlogs = blogManager.getBlogs();
      setBlogs(loadedBlogs);
    } catch (error) {
      console.error("Error loading blogs:", error);
      toast.error("Lỗi khi tải blog!");
    } finally {
      setIsLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = { ...blogs };

    // Filter by search query
    if (searchQuery) {
      filtered = blogManager.searchBlogs(searchQuery);
    }

    // Filter by status
    if (statusFilter !== "all") {
      const statusFiltered: BlogsData = {};
      Object.entries(filtered).forEach(([title, blog]) => {
        if ((blog.STATUS || 'published') === statusFilter) {
          statusFiltered[title] = blog;
        }
      });
      filtered = statusFiltered;
    }

    setFilteredBlogs(filtered);
  };

  const handleDelete = (blogKey: string) => {
    setBlogToDelete(blogKey);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      blogManager.deleteBlog(blogToDelete);
      loadBlogs();
      toast.success("Blog đã được xóa thành công!");
      
      // Log activity
      logActivity.blogDeleted(blogToDelete);
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    } finally {
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const handleExport = () => {
    try {
      const exportData = blogManager.exportBlogs();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blogs-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Đã xuất file backup thành công!");
      
      // Log activity
      logActivity.dataExported();
    } catch (error) {
      toast.error("Lỗi khi xuất file!");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        blogManager.importBlogs(content);
        loadBlogs();
        alert("Import thành công!");
      } catch (error: any) {
        alert("Lỗi import: " + error.message);
      }
    };
    reader.readAsText(file);
  };

  const getStatusBadge = (status: string = "published") => {
    const statusStyles = {
      published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.published}`}>
        {status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tải blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Blog</h1>
          <p className="text-muted-foreground">
            Tạo, chỉnh sửa và quản lý các bài blog của bạn
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>📊 Tổng: {Object.keys(blogs).length}</span>
            <span>✅ Đã xuất bản: {Object.values(blogs).filter(b => (b.STATUS || 'published') === 'published').length}</span>
            <span>✏️ Bản nháp: {Object.values(blogs).filter(b => b.STATUS === 'draft').length}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Xuất file
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Nhập file
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <Link href="/admin/blogs/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo blog mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Tìm kiếm blog theo tiêu đề, nội dung hoặc tags..."
                defaultValue={searchQuery}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Tất cả</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog List */}
      <div className="grid gap-4">
        {Object.entries(filteredBlogs)
          .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
          .map(([key, blog]) => (
          <Card key={key} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                {/* Cover Image */}
                {blog.IMAGE && (
                  <div className="flex-shrink-0">
                    <img
                      src={blog.IMAGE}
                      alt={blog.IMAGE_ALT || key}
                      className="w-20 h-20 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{key}</CardTitle>
                    {getStatusBadge(blog.STATUS)}
                  </div>
                  
                  <CardDescription className="mb-3">
                    {blog.DESCRIPTION}
                  </CardDescription>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>📅 {blog.DATE}</span>
                    <span>⏱️ {blog.TIME} phút đọc</span>
                    {blog.AUTHOR && <span>👤 {blog.AUTHOR}</span>}
                    {blog.UPDATED_AT && (
                      <span>🔄 {new Date(blog.UPDATED_AT).toLocaleDateString('vi-VN')}</span>
                    )}
                  </div>
                  
                  {blog.TAGS && blog.TAGS.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {blog.TAGS.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted rounded-md text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/admin/blogs/${encodeURIComponent(key)}`}>
                    <Button variant="ghost" size="sm" title="Xem chi tiết blog">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Button variant="ghost" size="sm" asChild title="Xem bài gốc">
                    <a href={blog.LINK} target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </Button>
                  
                  <Link href={`/admin/blogs/edit/${encodeURIComponent(key)}`}>
                    <Button variant="ghost" size="sm" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(key)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(filteredBlogs).length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              {searchQuery || statusFilter !== "all" ? (
                <>
                  <h3 className="text-lg font-semibold">Không tìm thấy blog nào</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}>
                    Xóa bộ lọc
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">Chưa có blog nào</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Hãy tạo blog đầu tiên của bạn
                  </p>
                  <Link href="/admin/blogs/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo blog đầu tiên
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {Object.keys(filteredBlogs).length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(Object.keys(filteredBlogs).length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Xóa blog"
        description="Bạn có chắc muốn xóa blog này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </div>
  );
}