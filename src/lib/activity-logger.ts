/**
 * Activity Logger
 * Tracks user activities in real-time using localStorage
 */

export interface Activity {
  id: string;
  type: 'blog_created' | 'blog_updated' | 'blog_deleted' | 'blog_viewed' | 'contact_sent' | 'export' | 'import' | 'login' | 'logout';
  title: string;
  description?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const ACTIVITY_STORAGE_KEY = 'portfolio_activities';
const MAX_ACTIVITIES = 50; // Keep last 50 activities

export class ActivityLogger {
  private static instance: ActivityLogger;

  static getInstance(): ActivityLogger {
    if (!this.instance) {
      this.instance = new ActivityLogger();
    }
    return this.instance;
  }

  /**
   * Log a new activity
   */
  log(activity: Omit<Activity, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    try {
      const activities = this.getAll();
      
      const newActivity: Activity = {
        ...activity,
        id: this.generateId(),
        timestamp: new Date().toISOString(),
      };

      // Add to beginning of array (most recent first)
      activities.unshift(newActivity);

      // Keep only MAX_ACTIVITIES
      const trimmedActivities = activities.slice(0, MAX_ACTIVITIES);

      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmedActivities));

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('activity-logged', { 
        detail: newActivity 
      }));
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Get all activities
   */
  getAll(): Activity[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  }

  /**
   * Get recent activities (limit)
   */
  getRecent(limit: number = 10): Activity[] {
    return this.getAll().slice(0, limit);
  }

  /**
   * Get activities by type
   */
  getByType(type: Activity['type']): Activity[] {
    return this.getAll().filter(activity => activity.type === type);
  }

  /**
   * Get activities from last N days
   */
  getFromLastDays(days: number): Activity[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.getAll().filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= cutoff;
    });
  }

  /**
   * Clear all activities
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('activities-cleared'));
    } catch (error) {
      console.error('Error clearing activities:', error);
    }
  }

  /**
   * Delete specific activity
   */
  delete(id: string): void {
    if (typeof window === 'undefined') return;

    try {
      const activities = this.getAll().filter(activity => activity.id !== id);
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
      window.dispatchEvent(new CustomEvent('activity-deleted', { detail: id }));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Helper functions for common activities
 */

export const logActivity = {
  blogCreated: (title: string) => {
    ActivityLogger.getInstance().log({
      type: 'blog_created',
      title: `Blog "${title}" đã được tạo`,
      description: 'Tạo blog mới',
      metadata: { blogTitle: title },
    });
  },

  blogUpdated: (title: string) => {
    ActivityLogger.getInstance().log({
      type: 'blog_updated',
      title: `Blog "${title}" đã được cập nhật`,
      description: 'Cập nhật blog',
      metadata: { blogTitle: title },
    });
  },

  blogDeleted: (title: string) => {
    ActivityLogger.getInstance().log({
      type: 'blog_deleted',
      title: `Blog "${title}" đã bị xóa`,
      description: 'Xóa blog',
      metadata: { blogTitle: title },
    });
  },

  blogViewed: (title: string) => {
    ActivityLogger.getInstance().log({
      type: 'blog_viewed',
      title: `Blog "${title}" đã được xem`,
      description: 'Xem blog',
      metadata: { blogTitle: title },
    });
  },

  contactSent: (name: string, email: string) => {
    ActivityLogger.getInstance().log({
      type: 'contact_sent',
      title: `${name} đã gửi tin nhắn`,
      description: 'Nhận tin nhắn liên hệ mới',
      metadata: { name, email },
    });
  },

  dataExported: () => {
    ActivityLogger.getInstance().log({
      type: 'export',
      title: 'Đã xuất dữ liệu backup',
      description: 'Xuất file backup',
    });
  },

  dataImported: () => {
    ActivityLogger.getInstance().log({
      type: 'import',
      title: 'Đã nhập dữ liệu từ backup',
      description: 'Nhập file backup',
    });
  },

  adminLogin: () => {
    ActivityLogger.getInstance().log({
      type: 'login',
      title: 'Đăng nhập admin panel',
      description: 'Đăng nhập thành công',
    });
  },

  adminLogout: () => {
    ActivityLogger.getInstance().log({
      type: 'logout',
      title: 'Đăng xuất admin panel',
      description: 'Đăng xuất',
    });
  },
};

/**
 * Format activity timestamp for display
 */
export function formatActivityTime(timestamp: string): string {
  const now = new Date();
  const activityDate = new Date(timestamp);
  const diffMs = now.getTime() - activityDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  return activityDate.toLocaleDateString('vi-VN');
}

/**
 * Get activity icon based on type
 */
export function getActivityIcon(type: Activity['type']): string {
  const icons = {
    blog_created: '📝',
    blog_updated: '✏️',
    blog_deleted: '🗑️',
    blog_viewed: '👁️',
    contact_sent: '📧',
    export: '💾',
    import: '📥',
    login: '🔐',
    logout: '🚪',
  };

  return icons[type] || '📌';
}

/**
 * Get activity color based on type
 */
export function getActivityColor(type: Activity['type']): string {
  const colors = {
    blog_created: 'text-green-600',
    blog_updated: 'text-blue-600',
    blog_deleted: 'text-red-600',
    blog_viewed: 'text-purple-600',
    contact_sent: 'text-yellow-600',
    export: 'text-indigo-600',
    import: 'text-cyan-600',
    login: 'text-emerald-600',
    logout: 'text-gray-600',
  };

  return colors[type] || 'text-gray-600';
}
