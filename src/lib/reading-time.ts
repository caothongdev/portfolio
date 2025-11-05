/**
 * View Counter Utility
 * Uses localStorage to track blog post views
 */

export const viewCounter = {
  /**
   * Increment view count for a blog post
   */
  increment: (slug: string): void => {
    if (typeof window === "undefined") return;
    
    try {
      const views = JSON.parse(localStorage.getItem("blog-views") || "{}");
      views[slug] = (views[slug] || 0) + 1;
      localStorage.setItem("blog-views", JSON.stringify(views));
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  },

  /**
   * Get view count for a specific blog post
   */
  get: (slug: string): number => {
    if (typeof window === "undefined") return 0;
    
    try {
      const views = JSON.parse(localStorage.getItem("blog-views") || "{}");
      return views[slug] || 0;
    } catch (error) {
      console.error("Error getting view count:", error);
      return 0;
    }
  },

  /**
   * Get all view counts
   */
  getAll: (): Record<string, number> => {
    if (typeof window === "undefined") return {};
    
    try {
      return JSON.parse(localStorage.getItem("blog-views") || "{}");
    } catch (error) {
      console.error("Error getting all view counts:", error);
      return {};
    }
  },

  /**
   * Reset view count for a specific blog post
   */
  reset: (slug: string): void => {
    if (typeof window === "undefined") return;
    
    try {
      const views = JSON.parse(localStorage.getItem("blog-views") || "{}");
      delete views[slug];
      localStorage.setItem("blog-views", JSON.stringify(views));
    } catch (error) {
      console.error("Error resetting view count:", error);
    }
  },

  /**
   * Reset all view counts
   */
  resetAll: (): void => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.removeItem("blog-views");
    } catch (error) {
      console.error("Error resetting all view counts:", error);
    }
  },
};

/**
 * Reading Time Calculator
 */

/**
 * Calculate reading time in minutes based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  
  // Remove HTML tags if present
  const cleanText = text.replace(/<[^>]*>/g, " ");
  
  // Split by whitespace and count words
  const words = cleanText.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // Calculate minutes (minimum 1 minute)
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  
  return minutes;
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return "1 phút đọc";
  }
  
  if (minutes < 60) {
    return `${minutes} phút đọc`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return hours === 1 ? "1 giờ đọc" : `${hours} giờ đọc`;
  }
  
  return `${hours} giờ ${remainingMinutes} phút đọc`;
}

/**
 * Get reading time from content
 */
export function getReadingTime(content: string): {
  minutes: number;
  formatted: string;
} {
  const minutes = calculateReadingTime(content);
  return {
    minutes,
    formatted: formatReadingTime(minutes),
  };
}

/**
 * Format view count for display
 */
export function formatViewCount(count: number): string {
  if (count === 0) return "Chưa có lượt xem";
  if (count === 1) return "1 lượt xem";
  
  if (count < 1000) {
    return `${count} lượt xem`;
  }
  
  if (count < 1000000) {
    const thousands = (count / 1000).toFixed(1);
    return `${thousands}K lượt xem`;
  }
  
  const millions = (count / 1000000).toFixed(1);
  return `${millions}M lượt xem`;
}
