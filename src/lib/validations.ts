import { z } from 'zod';

// Blog Validation Schemas
export const blogSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(500, 'Title must be less than 500 characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(500, 'Slug must be less than 500 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  image_alt: z.string().max(255, 'Image alt text must be less than 255 characters').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]),
  category: z.string().max(100, 'Category must be less than 100 characters').optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  date: z.string().min(1, 'Date is required'),
});

export const blogUpdateSchema = blogSchema.partial();

export type BlogInput = z.infer<typeof blogSchema>;
export type BlogUpdateInput = z.infer<typeof blogUpdateSchema>;

// Contact Form Validation Schema
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Authentication Validation Schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const passwordSetupSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PasswordSetupInput = z.infer<typeof passwordSetupSchema>;

// Activity Validation Schema
export const activitySchema = z.object({
  type: z.string().max(100),
  title: z.string().max(500),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).default({}),
  timestamp: z.string().or(z.date()),
});

export type ActivityInput = z.infer<typeof activitySchema>;
