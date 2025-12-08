'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/ui/rich-text-editor';
import ImageUpload from '@/components/ui/image-upload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover_image: '',
    summary: '',
    content: '',
    category: '',
    tags: [] as string[],
    rating: 0,
    key_takeaways: [] as string[],
    reading_date: '',
    published: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [takeawayInput, setTakeawayInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/books');
      } else {
        const error = await response.json();
        alert(error.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      alert('Có lỗi xảy ra khi tạo sách');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addTakeaway = () => {
    if (takeawayInput.trim()) {
      setFormData({ ...formData, key_takeaways: [...formData.key_takeaways, takeawayInput.trim()] });
      setTakeawayInput('');
    }
  };

  const removeTakeaway = (index: number) => {
    setFormData({ 
      ...formData, 
      key_takeaways: formData.key_takeaways.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/books">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Thêm Sách Mới</h1>
          <p className="text-muted-foreground">Tạo tóm tắt sách mới</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Sách</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tên sách <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Show Your Work!"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tác giả <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Austin Kleon"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Ảnh bìa</label>
              <ImageUpload
                value={formData.cover_image}
                onChange={(url) => setFormData({ ...formData, cover_image: url })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Thể loại</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Self-help, Business, Fiction..."
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Đánh giá (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-3xl"
                  >
                    {star <= formData.rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="Nhập tag và nhấn Enter"
                />
                <Button type="button" onClick={addTag}>Thêm</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-secondary rounded-md flex items-center gap-2"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium mb-2">Tóm tắt ngắn</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Tóm tắt ngắn gọn về cuốn sách..."
              />
            </div>

            {/* Key Takeaways */}
            <div>
              <label className="block text-sm font-medium mb-2">Những điểm chính rút ra</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={takeawayInput}
                  onChange={(e) => setTakeawayInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTakeaway())}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="Nhập bài học và nhấn Enter"
                />
                <Button type="button" onClick={addTakeaway}>Thêm</Button>
              </div>
              <div className="space-y-2">
                {formData.key_takeaways.map((takeaway, index) => (
                  <div key={index} className="p-3 bg-secondary rounded-md flex justify-between items-start">
                    <span>{takeaway}</span>
                    <button type="button" onClick={() => removeTakeaway(index)} className="text-red-500 ml-2">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Nội dung chi tiết</label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Viết tóm tắt chi tiết về cuốn sách..."
              />
            </div>

            {/* Reading Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Ngày đọc</label>
              <input
                type="date"
                value={formData.reading_date}
                onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })}
                className="px-3 py-2 border rounded-md"
              />
            </div>

            {/* Published */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Xuất bản ngay
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Tạo Sách'}
              </Button>
              <Link href="/admin/books">
                <Button type="button" variant="outline">Hủy</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
