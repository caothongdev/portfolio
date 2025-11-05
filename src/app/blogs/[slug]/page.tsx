"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag, Eye, BookOpen } from "lucide-react";
import { BlogManager } from "@/lib/blog-manager";
import { BlogData } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { viewCounter, getReadingTime, formatViewCount } from "@/lib/reading-time";
import { logActivity } from "@/lib/activity-logger";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");
  const [views, setViews] = useState(0);
  const [readingTime, setReadingTime] = useState("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const loadBlog = () => {
      try {
        const blogManager = BlogManager.getInstance();
        const blogs = blogManager.getBlogs();
        
        // Decode slug to get blog title
        const title = decodeURIComponent(slug);
        
        if (blogs[title]) {
          setBlog(blogs[title]);
          
          // Increment view counter
          viewCounter.increment(slug);
          
          // Log blog view activity
          logActivity.blogViewed(title);
          
          // Get view count
          setViews(viewCounter.get(slug));
          
          // Calculate reading time
          const content = blogs[title].CONTENT || blogs[title].DESCRIPTION || "";
          const { formatted } = getReadingTime(content);
          setReadingTime(formatted);
        } else {
          // Try to find by LINK
          const foundBlog = Object.entries(blogs).find(
            ([, data]) => data.LINK === slug
          );
          
          if (foundBlog) {
            setBlog(foundBlog[1]);
            
            // Increment view counter
            viewCounter.increment(slug);
            
            // Log blog view activity
            logActivity.blogViewed(foundBlog[0]);
            
            // Get view count
            setViews(viewCounter.get(slug));
            
            // Calculate reading time
            const content = foundBlog[1].CONTENT || foundBlog[1].DESCRIPTION || "";
            const { formatted } = getReadingTime(content);
            setReadingTime(formatted);
          }
        }
      } catch (error) {
        console.error("Error loading blog:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Blog không tìm thấy</h1>
        <p className="text-muted-foreground">
          Blog bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => router.push("/#blogs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/#blogs")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <Card className="p-8">
          {/* Header */}
          <header className="mb-8 border-b pb-6">
            <h1 className="text-4xl font-bold mb-4">
              {slug ? decodeURIComponent(slug) : "Loading..."}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{blog.DATE}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{blog.TIME}</span>
              </div>

              {readingTime && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{readingTime}</span>
                </div>
              )}

              {views > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{formatViewCount(views)}</span>
                </div>
              )}

              {blog.CATEGORY && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{blog.CATEGORY}</span>
                </div>
              )}

              {blog.AUTHOR && (
                <div className="flex items-center gap-2">
                  <span>Tác giả: {blog.AUTHOR}</span>
                </div>
              )}
            </div>

            {blog.TAGS && blog.TAGS.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {blog.IMAGE && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={blog.IMAGE}
                alt={blog.IMAGE_ALT || "Blog image"}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {blog.DESCRIPTION}
            </p>
          </div>

          {/* Content */}
          {blog.CONTENT && (
            <div 
              className="prose prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.CONTENT }}
            />
          )}

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {blog.CREATED_AT && (
                  <p>
                    Tạo ngày:{" "}
                    {new Date(blog.CREATED_AT).toLocaleDateString("vi-VN")}
                  </p>
                )}
                {blog.UPDATED_AT && (
                  <p>
                    Cập nhật:{" "}
                    {new Date(blog.UPDATED_AT).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>

              {blog.LINK && (
                <Button
                  variant="outline"
                  onClick={() => window.open(blog.LINK, "_blank")}
                >
                  Xem bài viết gốc
                </Button>
              )}
            </div>
          </footer>
        </Card>
      </div>
    </div>
  );
}
