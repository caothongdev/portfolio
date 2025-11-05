"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ArrowLeft, Save, Tag, Globe, Clock, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { BlogManager, BlogData } from "@/lib/blog-manager";
import { logActivity } from "@/lib/activity-logger";

export default function EditBlog() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [originalTitle, setOriginalTitle] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "5",
    link: "",
    description: "",
    content: "",
    tags: "",
    status: "published" as "published" | "draft",
    author: "Hoàng Cao Thống",
    image: "",
    imageAlt: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const blogManager = BlogManager.getInstance();

  useEffect(() => {
    if (params.slug) {
      const title = decodeURIComponent(params.slug as string);
      setOriginalTitle(title);
      loadBlog(title);
    }
  }, [params.slug]);

  const loadBlog = (title: string) => {
    setIsLoadingBlog(true);
    try {
      const blogs = blogManager.getBlogs();
      const blog = blogs[title];
      
      if (!blog) {
        alert("Không tìm thấy blog!");
        router.push('/admin/blogs');
        return;
      }

      setFormData({
        title: title,
        date: blog.DATE,
        time: blog.TIME,
        link: blog.LINK,
        description: blog.DESCRIPTION,
        content: blog.CONTENT || "",
        tags: blog.TAGS ? blog.TAGS.join(", ") : "",
        status: blog.STATUS || "published",
        author: blog.AUTHOR || "Hoàng Cao Thống",
        image: blog.IMAGE || "",
        imageAlt: blog.IMAGE_ALT || ""
      });
    } catch (error) {
      console.error("Error loading blog:", error);
      alert("Lỗi khi tải blog!");
      router.push('/admin/blogs');
    } finally {
      setIsLoadingBlog(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }

    if (!formData.link.trim()) {
      newErrors.link = "Link bài viết không được để trống";
    } else if (!formData.link.match(/^https?:\/\/.+/)) {
      newErrors.link = "Link phải bắt đầu bằng http:// hoặc https://";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    } else if (formData.description.length < 50) {
      newErrors.description = "Mô tả phải có ít nhất 50 ký tự";
    }

    if (!formData.time || parseInt(formData.time) < 1) {
      newErrors.time = "Thời gian đọc phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const blogData: Omit<BlogData, 'CREATED_AT' | 'UPDATED_AT'> = {
        DATE: formData.date,
        TIME: formData.time,
        LINK: formData.link,
        DESCRIPTION: formData.description,
        CONTENT: formData.content,
        TAGS: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [],
        STATUS: formData.status,
        AUTHOR: formData.author,
        IMAGE: formData.image,
        IMAGE_ALT: formData.imageAlt
      };

      // Cập nhật blog (hàm updateBlog xử lý cả việc đổi tên)
      blogManager.updateBlog(originalTitle, formData.title, blogData);
      logActivity.blogUpdated(formData.title);
      
      alert("Blog đã được cập nhật thành công!");
      router.push("/admin/blogs");
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const generateSlug = () => {
    if (formData.title) {
      const baseUrl = "https://caothong.is-a.dev/blog/";
      const slug = formData.title
        .toLowerCase()
        .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[íìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        link: baseUrl + slug
      }));
    }
  };

  if (isLoadingBlog) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tải blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa blog</h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin bài blog: {originalTitle}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Thông tin cơ bản
            </CardTitle>
            <CardDescription>
              Thông tin chính của bài blog
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tiêu đề blog *</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`flex-1 px-3 py-2 border rounded-md bg-background ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Ví dụ: Hành trình học React từ cơ bản đến nâng cao"
                />
                <Button type="button" variant="outline" onClick={generateSlug} disabled={!formData.title}>
                  Tạo link
                </Button>
              </div>
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              {formData.title !== originalTitle && (
                <p className="text-yellow-600 text-xs mt-1">
                  ⚠️ Thay đổi tiêu đề sẽ tạo blog mới và xóa blog cũ
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Mô tả *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 mt-1 border rounded-md bg-background resize-none ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Mô tả chi tiết về nội dung bài blog (tối thiểu 50 ký tự)..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                <p className="text-xs text-muted-foreground ml-auto">
                  {formData.description.length}/50 ký tự tối thiểu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Nội dung blog</CardTitle>
            <CardDescription>
              Viết nội dung chi tiết với hình ảnh, format text và links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => {
                setFormData(prev => ({
                  ...prev,
                  content: content
                }));
              }}
              placeholder="Bắt đầu viết nội dung blog của bạn... Sử dụng Markdown để format text và thêm hình ảnh!"
            />
          </CardContent>
        </Card>

        {/* Cover Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>🖼️ Hình ảnh cover</CardTitle>
            <CardDescription>
              Thêm hình ảnh cover để thu hút người đọc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={formData.image}
              altText={formData.imageAlt}
              onChange={(imageUrl, altText) => {
                setFormData(prev => ({
                  ...prev,
                  image: imageUrl,
                  imageAlt: altText || ""
                }));
              }}
              onAltTextChange={(altText) => {
                setFormData(prev => ({
                  ...prev,
                  imageAlt: altText
                }));
              }}
              onRemove={() => {
                setFormData(prev => ({
                  ...prev,
                  image: "",
                  imageAlt: ""
                }));
              }}
              placeholder="Thêm ảnh cover cho blog của bạn"
            />
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Metadata
            </CardTitle>
            <CardDescription>
              Thông tin bổ sung và phân loại
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Thời gian đọc (phút) *
                </label>
                <input
                  type="number"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  min="1"
                  max="60"
                  className={`w-full px-3 py-2 mt-1 border rounded-md bg-background ${errors.time ? 'border-red-500' : ''}`}
                  placeholder="5"
                />
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Ngày đăng</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-background"
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-background"
                >
                  <option value="published">Xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Tags (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-md bg-background"
                placeholder="programming, react, javascript, tutorial"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ví dụ: programming, react, javascript, tutorial
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Tác giả</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-md bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Liên kết
            </CardTitle>
            <CardDescription>
              URL đến bài viết thực tế
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div>
              <label className="text-sm font-medium">Link bài viết *</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border rounded-md bg-background ${errors.link ? 'border-red-500' : ''}`}
                placeholder="https://caothong.is-a.dev/blog/..."
              />
              {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                Link này sẽ được sử dụng khi người dùng click "Read more"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Đang cập nhật..." : "Cập nhật blog"}
              </Button>
              
              <Link href="/admin/blogs">
                <Button variant="outline" type="button" disabled={isLoading}>
                  Hủy
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
