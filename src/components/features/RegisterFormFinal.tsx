'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/utils/validators'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { createClient } from '@/lib/supabase/client'

export function RegisterFormFinal() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      console.log('=== 开始注册 ===')
      const username = data.username?.trim() || data.email.split('@')[0]

      // 步骤 1: 创建账户
      setLoadingMessage('✨ 正在创建您的账户...')

      const { data: result, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { username },
        },
      })

      if (signUpError) {
        // 处理 Supabase 错误
        if (signUpError.message.includes('already registered')) {
          throw new Error('该邮箱已被注册，请直接登录')
        }
        throw signUpError
      }

      if (!result?.user) {
        throw new Error('注册失败：没有返回用户数据')
      }

      console.log('注册成功！用户ID:', result.user.id)

      // 步骤 2: 创建 profile
      setLoadingMessage('👤 正在设置个人资料...')

      const { error: profileError } = await supabase.from('profiles').insert({
        id: result.user.id,
        email: data.email,
        username,
        role: 'user',
      })

      if (profileError) {
        // 检查是否是用户名重复
        if (profileError.message.includes('duplicate') || profileError.message.includes('unique')) {
          throw new Error('该用户名已被使用，请选择其他用户名')
        }
        console.warn('创建 profile 警告:', profileError)
      }

      // 步骤 3: 完成
      setLoadingMessage('🎉 账户创建成功！')
      await new Promise((resolve) => setTimeout(resolve, 800))

      setSuccess('🎊 欢迎加入！正在跳转到登录页面...')
      await new Promise((resolve) => setTimeout(resolve, 1200))

      router.push('/login')
    } catch (err: unknown) {
      console.error('=== 注册失败 ===', err)
      const errorMessage = err instanceof Error ? err.message : '注册失败，请重试'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <ErrorMessage error={error} />}
      {success && (
        <div className="flex items-center space-x-2 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <svg
            className="h-5 w-5 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-green-700 dark:text-green-300">{success}</span>
        </div>
      )}

      <Input
        label="邮箱"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="用户名"
        type="text"
        placeholder="支持中文、字母、数字"
        error={errors.username?.message}
        {...register('username')}
      />

      <Input
        label="密码"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="确认密码"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div className="text-xs text-gray-600 dark:text-gray-400">
        密码要求：至少 8 个字符，包含大小写字母和数字
      </div>

      {isLoading && loadingMessage && (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-blue-700 dark:text-blue-300">
              {loadingMessage}
            </p>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              请稍候，这可能需要几秒钟...
            </p>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>处理中...</span>
          </span>
        ) : (
          '创建账户'
        )}
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        注册后请使用邮箱和密码登录
      </div>
    </form>
  )
}
