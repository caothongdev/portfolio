// Blog data management utilities
export interface BlogData {
  DATE: string;
  TIME: string;
  LINK: string;
  DESCRIPTION: string;
  CONTENT?: string; // Nội dung chi tiết blog với HTML/Markdown
  TAGS?: string[];
  STATUS?: 'draft' | 'published';
  AUTHOR?: string;
  CREATED_AT?: string;
  UPDATED_AT?: string;
  IMAGE?: string; // URL hoặc base64
  IMAGE_ALT?: string; // Alt text cho accessibility
  CATEGORY?: string; // Phân loại blog
}

export interface BlogsData {
  [key: string]: BlogData;
}

// Local storage keys
const BLOGS_STORAGE_KEY = 'portfolio_blogs';
const BLOG_BACKUP_KEY = 'portfolio_blogs_backup';

export class BlogManager {
  private static instance: BlogManager;
  
  static getInstance(): BlogManager {
    if (!this.instance) {
      this.instance = new BlogManager();
    }
    return this.instance;
  }

  // Get all blogs from localStorage or fallback to default data
  getBlogs(): BlogsData {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem(BLOGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
    
    // Fallback to default data from data.ts
    return this.getDefaultBlogs();
  }

  // Save blogs to localStorage
  saveBlogs(blogs: BlogsData): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      // Create backup before saving
      const current = localStorage.getItem(BLOGS_STORAGE_KEY);
      if (current) {
        localStorage.setItem(BLOG_BACKUP_KEY, current);
      }
      
      // Add timestamps
      const blogsWithTimestamp = { ...blogs };
      Object.keys(blogsWithTimestamp).forEach(key => {
        if (!blogsWithTimestamp[key].UPDATED_AT) {
          blogsWithTimestamp[key].UPDATED_AT = new Date().toISOString();
        }
      });
      
      localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogsWithTimestamp));
      return true;
    } catch (error) {
      console.error('Error saving blogs:', error);
      return false;
    }
  }

  // Add new blog
  addBlog(title: string, blogData: Omit<BlogData, 'CREATED_AT' | 'UPDATED_AT'>): boolean {
    const blogs = this.getBlogs();
    
    // Check if title already exists
    if (blogs[title]) {
      throw new Error('Blog với tiêu đề này đã tồn tại!');
    }
    
    const newBlog: BlogData = {
      ...blogData,
      CREATED_AT: new Date().toISOString(),
      UPDATED_AT: new Date().toISOString(),
      STATUS: blogData.STATUS || 'published'
    };
    
    blogs[title] = newBlog;
    return this.saveBlogs(blogs);
  }

  // Update existing blog
  updateBlog(oldTitle: string, newTitle: string, blogData: Omit<BlogData, 'CREATED_AT' | 'UPDATED_AT'>): boolean {
    const blogs = this.getBlogs();
    
    if (!blogs[oldTitle]) {
      throw new Error('Không tìm thấy blog để cập nhật!');
    }
    
    // If title changed, check for conflicts
    if (oldTitle !== newTitle && blogs[newTitle]) {
      throw new Error('Tiêu đề mới đã tồn tại!');
    }
    
    const updatedBlog: BlogData = {
      ...blogData,
      CREATED_AT: blogs[oldTitle].CREATED_AT || new Date().toISOString(),
      UPDATED_AT: new Date().toISOString(),
      STATUS: blogData.STATUS || 'published'
    };
    
    // Remove old entry if title changed
    if (oldTitle !== newTitle) {
      delete blogs[oldTitle];
    }
    
    blogs[newTitle] = updatedBlog;
    return this.saveBlogs(blogs);
  }

  // Delete blog
  deleteBlog(title: string): boolean {
    const blogs = this.getBlogs();
    
    if (!blogs[title]) {
      throw new Error('Không tìm thấy blog để xóa!');
    }
    
    delete blogs[title];
    return this.saveBlogs(blogs);
  }

  // Search blogs
  searchBlogs(query: string): BlogsData {
    const blogs = this.getBlogs();
    const searchTerm = query.toLowerCase();
    const filtered: BlogsData = {};
    
    Object.entries(blogs).forEach(([title, blog]) => {
      const titleMatch = title.toLowerCase().includes(searchTerm);
      const descMatch = blog.DESCRIPTION.toLowerCase().includes(searchTerm);
      const tagMatch = blog.TAGS?.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (titleMatch || descMatch || tagMatch) {
        filtered[title] = blog;
      }
    });
    
    return filtered;
  }

  // Get blogs by status
  getBlogsByStatus(status: 'draft' | 'published'): BlogsData {
    const blogs = this.getBlogs();
    const filtered: BlogsData = {};
    
    Object.entries(blogs).forEach(([title, blog]) => {
      if ((blog.STATUS || 'published') === status) {
        filtered[title] = blog;
      }
    });
    
    return filtered;
  }

  // Restore from backup
  restoreFromBackup(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const backup = localStorage.getItem(BLOG_BACKUP_KEY);
      if (backup) {
        localStorage.setItem(BLOGS_STORAGE_KEY, backup);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  // Export blogs as JSON
  exportBlogs(): string {
    const blogs = this.getBlogs();
    return JSON.stringify(blogs, null, 2);
  }

  // Import blogs from JSON
  importBlogs(jsonString: string): boolean {
    try {
      const importedBlogs = JSON.parse(jsonString) as BlogsData;
      return this.saveBlogs(importedBlogs);
    } catch (error) {
      console.error('Error importing blogs:', error);
      throw new Error('File JSON không hợp lệ!');
    }
  }

  // Get default blogs from data.ts
  private getDefaultBlogs(): BlogsData {
    return {
      "Hành trình lập trình của một developer 16 tuổi": {
        DATE: "Sắp ra mắt",
        TIME: "5",
        LINK: "https://caothong.is-a.dev/blog/hanh-trinh-lap-trinh",
        DESCRIPTION: "Chia sẻ câu chuyện cá nhân về hành trình học lập trình từ sớm, những khó khăn gặp phải và cách vượt qua. Bài viết sẽ truyền cảm hứng cho các bạn trẻ muốn bắt đầu sự nghiệp lập trình từ tuổi học sinh.",
        CONTENT: `# Chào mừng đến với hành trình lập trình của tôi!

Xin chào! Tôi là **Hoàng Cao Thống**, một developer 16 tuổi đang đam mê với việc tạo ra những sản phẩm công nghệ có ích.

![Workspace của một developer trẻ](https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop)

## Khởi đầu từ con số 0

Hành trình của tôi bắt đầu từ khi tôi 14 tuổi. Lúc đó, tôi chỉ biết sử dụng máy tính cơ bản và chẳng hiểu gì về lập trình.

### Những ngày đầu khó khăn

- **Tháng 1/2023**: Bắt đầu học HTML/CSS đầu tiên
- **Tháng 3/2023**: Tiếp cận JavaScript và cảm thấy choáng ngợp
- **Tháng 6/2023**: Hoàn thành project đầu tiên - một website portfolio đơn giản

> "Mọi chuyên gia đều từng là người mới bắt đầu" - Đây là câu nói luôn động viên tôi trong những lúc khó khăn nhất.

## Tech Stack hiện tại

Sau 2 năm học hỏi không ngừng, đây là những công nghệ tôi đang sử dụng:

![Tech stack modern](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop)

### Frontend
- **Next.js 15** - Framework React mạnh mẽ
- **TypeScript** - Type safety cho code chất lượng cao
- **Tailwind CSS** - Styling hiệu quả và responsive
- **Framer Motion** - Animation mượt mà

### Backend & Tools
- **Node.js** - Server-side JavaScript
- **Git & GitHub** - Version control
- **Vercel** - Deployment platform
- **VS Code** - Editor yêu thích

## Những dự án đáng nhớ

### 1. Portfolio Website
Đây là dự án đầu tiên tôi hoàn thiện hoàn toàn. Website này được build bằng **Next.js** và **Tailwind CSS**.

**Điều học được:**
- Responsive design
- Performance optimization
- SEO basics

![Laptop và code editor](https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop)

### 2. Blog Management System
Một hệ thống quản lý blog đơn giản với các tính năng:
- CRUD operations
- Image upload
- Rich text editor
- Local storage persistence

## Kế hoạch tương lai

Tôi đang hướng tới việc trở thành một **Full-stack Developer** chuyên nghiệp với những mục tiêu cụ thể:

1. **2024**: Học sâu về Backend development (Node.js, databases)
2. **2025**: Tham gia các dự án thực tế, internship
3. **2026**: Trở thành Senior Developer

![Tech workspace với multiple screens](https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop)

## Lời khuyên cho các bạn mới bắt đầu

Nếu bạn cũng đang muốn bắt đầu học lập trình, đây là những điều tôi muốn chia sẻ:

### 🎯 Bắt đầu với HTML/CSS
Đây là foundation cơ bản nhất. Đừng vội vàng nhảy sang JavaScript nếu chưa thành thạo HTML/CSS.

### 💪 Thực hành mỗi ngày
**Consistency** quan trọng hơn intensity. Tốt hơn code 1 tiếng/ngày thay vì 10 tiếng/tuần.

### 🌐 Tham gia cộng đồng
- Join Discord servers về lập trình
- Follow các developers trên Twitter
- Đặt câu hỏi trên StackOverflow

### 📚 Tài nguyên học tập
- **freeCodeCamp** - Free và chất lượng cao
- **MDN Web Docs** - Documentation tốt nhất cho web dev
- **YouTube** - Có rất nhiều tutorial hay

![Mobile app development](https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop)

## Kết luận

Hành trình lập trình của tôi vẫn đang tiếp tục. Mỗi ngày tôi đều học được điều gì đó mới, gặp phải những thử thách mới.

**Điều quan trọng nhất** tôi học được là: Đừng sợ thất bại, hãy sợ việc không thử.

Nếu bạn có câu hỏi gì hoặc muốn chia sẻ hành trình của mình, hãy liên hệ với tôi qua:
- **Email**: [contact@caothong.is-a.dev](mailto:contact@caothong.is-a.dev)
- **GitHub**: [@caothongdev](https://github.com/caothongdev)
- **LinkedIn**: [Hoàng Cao Thống](https://linkedin.com/in/caothong)

---

*Cảm ơn bạn đã đọc đến cuối bài viết! Chúc bạn thành công trên con đường lập trình của mình! 🚀*`,
        TAGS: ["personal", "programming", "journey"],
        STATUS: "published",
        AUTHOR: "Hoàng Cao Thống",
        IMAGE: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
        IMAGE_ALT: "Code trên màn hình laptop",
        CATEGORY: "Personal Story"
      },
      "Tư duy kinh doanh trong lập trình: Marketing + Code = Success": {
        DATE: "Ý tưởng",
        TIME: "6",
        LINK: "https://caothong.is-a.dev/blog/tu-duy-kinh-doanh",
        DESCRIPTION: "Khám phá cách kết hợp kỹ năng lập trình với tư duy kinh doanh để tạo ra những sản phẩm có thể bán được. Từ việc nghiên cứu thị trường đến product development và customer acquisition.",
        CONTENT: `# Marketing + Code = Success 🚀

Là một developer trẻ, tôi nhận ra rằng **chỉ biết code thôi là chưa đủ**. Để tạo ra những sản phẩm thành công, bạn cần kết hợp kỹ năng lập trình với tư duy kinh doanh.

![Business charts và laptop](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop)

## Tại sao Developer cần hiểu về Business?

### 1. Tạo ra sản phẩm có giá trị thực
Nhiều developer tạo ra những sản phẩm kỹ thuật tuyệt vời nhưng... không ai sử dụng. Tại sao?

> **Vì họ build những thứ họ nghĩ mọi người cần, chứ không phải những thứ mọi người thực sự cần.**

### 2. Hiểu được pain points của khách hàng
Khi bạn hiểu business, bạn sẽ:
- Biết được khách hàng đang gặp vấn đề gì
- Tạo ra giải pháp phù hợp
- Định giá sản phẩm hợp lý

![Startup workspace](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop)

## Framework: From Idea to Revenue

### Phase 1: Market Research 📊
Trước khi viết dòng code nào, hãy nghiên cứu thị trường:

**Tools cho Market Research:**
- **Google Trends** - Xem trend tìm kiếm
- **Reddit** - Tìm hiểu pain points thực tế
- **Product Hunt** - Nghiên cứu competitors
- **Surveys** - Hỏi trực tiếp target audience

\`\`\`javascript
// Ví dụ: Validate idea trước khi code
const validateIdea = async (idea) => {
  const marketSize = await getMarketSize(idea);
  const competition = await analyzeCompetition(idea);
  const demandLevel = await checkDemand(idea);
  
  return {
    isViable: marketSize > 1000000 && competition < 5,
    confidence: calculateConfidence(demandLevel)
  };
};
\`\`\`

### Phase 2: MVP Development 🛠️
**Minimum Viable Product** - Phiên bản đơn giản nhất có thể bán được.

**Nguyên tắc MVP:**
1. **Core features only** - Chỉ làm những tính năng cốt lõi
2. **Ship early** - Ra mắt sớm để nhận feedback
3. **Iterate fast** - Cải thiện dựa trên phản hồi

![Code editor với nhiều màu sắc](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop)

### Phase 3: Customer Acquisition 🎯
Đây là phần khó nhất - làm sao để có khách hàng?

**Content Marketing:**
- Viết blog về vấn đề bạn giải quyết
- Tạo video tutorials
- Chia sẻ trên social media

**SEO Strategy:**
- Research keywords
- Optimize landing pages
- Build backlinks

**Community Building:**
- Join relevant Discord/Slack communities
- Contribute to open source
- Speak at meetups/conferences

## Case Study: My SaaS Journey

### The Problem
Nhiều developer muốn tạo portfolio đẹp nhưng không có thời gian design.

### The Solution
**Portfolio Builder for Developers** - Một tool giúp developers tạo portfolio professional trong 5 phút.

![Tool development workspace](https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=400&fit=crop)

### Tech Stack
- **Frontend**: Next.js + TypeScript
- **Backend**: Node.js + PostgreSQL
- **Payments**: Stripe
- **Hosting**: Vercel

### Marketing Strategy
1. **Content**: Blog về career tips cho developers
2. **SEO**: Target "developer portfolio" keywords
3. **Community**: Share trên r/webdev, dev.to
4. **Partnerships**: Collaborate với tech YouTubers

### Results (6 tháng)
- **200+ users**
- **$500 MRR** (Monthly Recurring Revenue)
- **15% conversion rate** từ free trial

## Tools cho Developer-Entrepreneur

### Development
- **Next.js** - Full-stack framework
- **Supabase** - Backend as a Service
- **Vercel** - Deployment platform
- **Stripe** - Payment processing

### Analytics & Marketing
- **Google Analytics** - User behavior tracking
- **Hotjar** - Heatmaps và user recordings
- **Mailchimp** - Email marketing
- **Buffer** - Social media management

![Analytics dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop)

### Customer Support
- **Intercom** - Live chat
- **Notion** - Knowledge base
- **Discord** - Community building

## Pricing Strategy cho Developers

### Freemium Model
- **Free tier**: Basic features
- **Pro tier**: Advanced features ($9/month)
- **Enterprise**: Custom solutions ($99/month)

### Value-based Pricing
Đừng pricing based on cost, hãy pricing based on **value** bạn mang lại.

**Ví dụ:**
- Tool giúp save 5 hours/week
- 5 hours × $50/hour = $250 value/week
- $250 × 4 weeks = $1000 value/month
- Price: $50/month = 95% discount!

## Metrics quan trọng cần track

### Product Metrics
- **MAU** (Monthly Active Users)
- **Churn rate** - Tỷ lệ khách hàng bỏ đi
- **Feature adoption** - Tính năng nào được dùng nhiều

### Business Metrics
- **MRR** (Monthly Recurring Revenue)
- **CAC** (Customer Acquisition Cost)
- **LTV** (Customer Lifetime Value)
- **CAC/LTV ratio** (should be < 1:3)

\`\`\`javascript
// Example: Calculate key metrics
const calculateMetrics = (data) => {
  const mrr = calculateMRR(data.subscriptions);
  const cac = calculateCAC(data.marketing, data.newCustomers);
  const ltv = calculateLTV(data.revenue, data.churn);
  
  return {
    mrr,
    cac,
    ltv,
    healthScore: ltv / cac // Should be > 3
  };
};
\`\`\`

## Mistakes tôi đã mắc phải

### 1. Over-engineering từ đầu
Ban đầu tôi cố gắng build "perfect product" với tất cả features. Result: mất 6 tháng mà chưa launch.

**Lesson**: Ship early, iterate based on feedback.

### 2. Không validate idea
Tôi build một tool mà chỉ tôi thấy hữu ích. Không ai sử dụng.

**Lesson**: Always validate with real users first.

### 3. Ignore marketing
Tôi nghĩ "good product will market itself". Sai bét!

**Lesson**: Marketing is as important as development.

![Team collaboration](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop)

## Next Steps: Your Action Plan

### Week 1-2: Market Research
- [ ] Identify 3 problems you personally face
- [ ] Survey 10 people about these problems
- [ ] Choose the most common pain point

### Week 3-4: MVP Planning
- [ ] List core features (max 3-5)
- [ ] Create wireframes
- [ ] Choose tech stack

### Week 5-8: Development
- [ ] Build MVP
- [ ] Set up analytics
- [ ] Create landing page

### Week 9-12: Launch & Iterate
- [ ] Get first 10 users
- [ ] Collect feedback
- [ ] Iterate based on feedback

## Resources để học thêm

### Books
- **"The Lean Startup"** by Eric Ries
- **"Zero to One"** by Peter Thiel
- **"Hooked"** by Nir Eyal

### Courses
- **Y Combinator Startup School** (free)
- **Indie Hackers** community
- **Product Hunt** for inspiration

### Podcasts
- **Indie Hackers Podcast**
- **Masters of Scale**
- **The Tim Ferriss Show**

## Kết luận

Việc kết hợp **coding skills** với **business mindset** sẽ giúp bạn:
- Tạo ra products có impact thực sự
- Hiểu được customer needs
- Build sustainable business

Remember: **Great code + Great business = Great success** 🚀

---

*Bạn đang build project gì? Hãy chia sẻ với tôi qua [contact@caothong.is-a.dev](mailto:contact@caothong.is-a.dev)!*`,
        TAGS: ["business", "marketing", "entrepreneurship"],
        STATUS: "draft",
        AUTHOR: "Hoàng Cao Thống",
        IMAGE: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        IMAGE_ALT: "Biểu đồ business và laptop",
        CATEGORY: "Business & Tech"
      }
    };
  }
}