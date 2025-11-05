"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Tag, ExternalLink } from "lucide-react";
import Link from "next/link";
import { BlogManager, BlogData } from "@/lib/blog-manager";

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const blogManager = BlogManager.getInstance();

  useEffect(() => {
    if (params.slug) {
      const title = decodeURIComponent(params.slug as string);
      setBlogTitle(title);
      loadBlog(title);
    }
  }, [params.slug]);

  const loadBlog = (title: string) => {
    setIsLoading(true);
    try {
      const blogs = blogManager.getBlogs();
      const foundBlog = blogs[title];
      
      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        router.push('/admin/blogs');
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      router.push('/admin/blogs');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert markdown to HTML
  const markdownToHtml = (markdown: string) => {
    if (!markdown) return '';
    
    return markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-6">$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-6 shadow-lg" />')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li class="mb-1">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc pl-6 my-4 space-y-1">$1</ul>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">$1</blockquote>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, '</p>');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Blog không tồn tại</h2>
        <p className="text-muted-foreground mb-6">Không tìm thấy blog bạn đang tìm kiếm.</p>
        <Link href="/admin/blogs">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        
        <div className="flex gap-2">
          <Link href={`/admin/blogs/edit/${encodeURIComponent(blogTitle)}`}>
            <Button variant="outline" size="sm">
              Chỉnh sửa
            </Button>
          </Link>
          
          <Button variant="outline" size="sm" asChild>
            <a href={blog.LINK} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Xem bài gốc
            </a>
          </Button>
        </div>
      </div>

      {/* Blog Content */}
      <Card>
        <CardHeader>
          {/* Cover Image */}
          {blog.IMAGE && (
            <img
              src={blog.IMAGE}
              alt={blog.IMAGE_ALT || blogTitle}
              className="w-full h-64 object-cover rounded-lg mb-6"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          
          <CardTitle className="text-3xl font-bold">{blogTitle}</CardTitle>
          
          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {blog.DATE}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {blog.TIME} phút đọc
            </div>
            {blog.AUTHOR && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blog.AUTHOR}
              </div>
            )}
            {blog.STATUS && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                blog.STATUS === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {blog.STATUS === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              </span>
            )}
          </div>
          
          {/* Tags */}
          {blog.TAGS && blog.TAGS.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.TAGS.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <CardDescription className="text-base">
            {blog.DESCRIPTION}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {blog.CONTENT ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.CONTENT) }}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Chưa có nội dung chi tiết cho blog này.</p>
              <p className="text-sm mt-2">
                Hãy <Link href={`/admin/blogs/edit/${encodeURIComponent(blogTitle)}`} className="text-blue-600 underline">chỉnh sửa blog</Link> để thêm nội dung.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Updated timestamp */}
      {blog.UPDATED_AT && (
        <p className="text-xs text-muted-foreground text-center">
          Cập nhật lần cuối: {new Date(blog.UPDATED_AT).toLocaleString('vi-VN')}
        </p>
      )}
    </div>
  );
}