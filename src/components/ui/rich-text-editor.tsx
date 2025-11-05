"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image as ImageIcon, 
  Link, 
  Eye, 
  Edit3 
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Viết nội dung blog của bạn..." }: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const wrapSelection = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const wrappedText = before + selectedText + after;
    
    const newValue = value.substring(0, start) + wrappedText + value.substring(end);
    onChange(newValue);
    
    // Restore selection
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  };

  const insertImage = (imageUrl: string, altText: string) => {
    const imageMarkdown = `![${altText || 'Ảnh'}](${imageUrl})`;
    insertAtCursor(imageMarkdown);
    setShowImageModal(false);
  };

  const insertLink = () => {
    const url = prompt("Nhập URL:");
    const text = prompt("Nhập text hiển thị:") || url;
    if (url) {
      insertAtCursor(`[${text}](${url})`);
    }
  };

  // Convert markdown to HTML for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded">$1</code>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul class="list-disc pl-6 my-2">$1</ul>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  const toolbarButtons = [
    { icon: Bold, action: () => wrapSelection('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => wrapSelection('*', '*'), title: 'Italic' },
    { icon: Quote, action: () => insertAtCursor('> '), title: 'Quote' },
    { icon: Code, action: () => wrapSelection('`', '`'), title: 'Code' },
    { icon: List, action: () => insertAtCursor('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertAtCursor('1. '), title: 'Numbered List' },
    { icon: Link, action: insertLink, title: 'Link' },
    { icon: ImageIcon, action: () => setShowImageModal(true), title: 'Image' },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        <div className="flex items-center gap-1 mr-4">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.title}
              className="h-8 w-8 p-0"
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-1 ml-auto">
          <Button
            type="button"
            variant={showPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? "Chỉnh sửa" : "Xem trước"}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {showPreview ? (
          <div 
            className="p-4 min-h-[300px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-80 p-4 resize-none border-0 outline-none bg-background"
            style={{ minHeight: '300px' }}
          />
        )}
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thêm hình ảnh</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowImageModal(false)}
              >
                ✕
              </Button>
            </div>
            
            <ImageUpload
              onChange={(imageUrl, altText) => insertImage(imageUrl, altText || '')}
              onRemove={() => {}}
              placeholder="Chọn hình ảnh để chèn vào nội dung blog"
            />
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="p-2 bg-muted/20 border-t text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <span>**bold** <em>italic</em></span>
          <span>[link](url)</span>
          <span>![image](url)</span>
          <span>`code`</span>
          <span>&gt; quote</span>
          <span>- list</span>
        </div>
      </div>
    </div>
  );
}