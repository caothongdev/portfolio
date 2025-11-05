// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  error?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ToastMessage {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}
