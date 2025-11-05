"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Link, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string, altText?: string) => void;
  onRemove: () => void;
  placeholder?: string;
  altText?: string;
  onAltTextChange?: (altText: string) => void;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  placeholder = "Tải lên ảnh cover cho blog",
  altText = "",
  onAltTextChange
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
      return;
    }

    setIsUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result, altText || file.name);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Lỗi khi đọc file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      alert('Vui lòng nhập URL hình ảnh');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
      onChange(imageUrl, altText);
      setImageUrl("");
      setShowUrlInput(false);
    } catch {
      alert('URL không hợp lệ');
    }
  };

  const suggestedImages = [
    {
      url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
      alt: "Code trên màn hình laptop",
      category: "Programming"
    },
    {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop", 
      alt: "Business charts và laptop",
      category: "Business"
    },
    {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      alt: "Code editor với nhiều màu sắc",
      category: "Development"
    },
    {
      url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop",
      alt: "Laptop và sách lập trình", 
      category: "Learning"
    },
    {
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
      alt: "Tech workspace với multiple screens",
      category: "Tech"
    },
    {
      url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop",
      alt: "Mobile app development",
      category: "Mobile Dev"
    }
  ];

  if (value) {
    return (
      <div className="space-y-4">
        <div className="relative group">
          <img
            src={value}
            alt={altText || "Blog cover"}
            className="w-full h-48 object-cover rounded-lg border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNzUgMTc1SDQyNVYyMjVIMzc1VjE3NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTM1MCAyMDBMMzc1IDE3NUg0MjVMMzUwIDI1MEwyNzUgMTc1SDMyNUwzNTAgMjAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4=";
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {onAltTextChange && (
          <div>
            <label className="text-sm font-medium">Alt text (mô tả ảnh) *</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => onAltTextChange(e.target.value)}
              placeholder="Mô tả ngắn gọn về hình ảnh cho accessibility"
              className="w-full px-3 py-2 mt-1 border rounded-md bg-background text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Alt text giúp người khiếm thị hiểu nội dung ảnh và cải thiện SEO
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium">{placeholder}</h3>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, GIF tới 5MB. Kích thước đề xuất: 800x400px
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Tải lên file
            </Button>
            
            <Button
              type="button" 
              variant="outline"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex items-center gap-2"
            >
              <Link className="w-4 h-4" />
              Dùng URL
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border rounded-md bg-background"
            />
            <Button type="button" onClick={handleUrlSubmit}>
              Thêm
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Nhập URL của hình ảnh từ internet
          </p>
        </div>
      )}

      {/* Suggested Images */}
      <div>
        <h4 className="text-sm font-medium mb-3">Hoặc chọn từ ảnh gợi ý:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {suggestedImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange(img.url, img.alt)}
              className="relative group overflow-hidden rounded-lg border hover:border-primary transition-colors"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium text-center px-2">
                  {img.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}