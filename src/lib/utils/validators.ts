import { z } from 'zod'

// Email validation schema
export const emailSchema = z.string().email('Invalid email address')

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Guestbook message validation schema
export const guestbookMessageSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(500, 'Message must be 500 characters or less')
  .refine((val) => val.trim().length > 0, {
    message: 'Message cannot be only whitespace',
  })

// Time capsule validation schema
export const timeCapsuleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

// Project validation schema
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  content: z.string().min(1, 'Content is required'),
  thumbnail_url: z.string().url('Invalid thumbnail URL'),
  tags: z.array(z.string()),
  github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  demo_url: z.string().url('Invalid demo URL').optional().or(z.literal('')),
  published: z.boolean().default(false),
})

// Username validation schema - 支持中文、字母、数字、下划线、连字符
export const usernameSchema = z
  .string()
  .min(2, '用户名至少需要 2 个字符')
  .max(30, '用户名最多 30 个字符')
  .regex(
    /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/,
    '用户名不能包含特殊符号（允许中文、字母、数字、下划线、连字符）'
  )

// Auth validation schemas
export const loginSchema = z.object({
  identifier: z.string().min(1, '请输入邮箱或用户名'),
  password: z.string().min(8, '密码至少需要 8 个字符'),
})

export const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
