'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/lib/hooks/useAuth'
import { registerSchema, type RegisterFormData } from '@/lib/utils/validators'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { classifyError } from '@/lib/utils/errors'

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter()
  const { signUp, signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

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

      console.log('开始注册流程...')
      setLoadingMessage('正在创建账户...')

      const result = await signUp(data.email, data.password, data.username)
      console.log('注册结果:', result)

      if (!result || !result.user) {
        throw new Error('注册失败，请重试')
      }

      // 检查是否有 session
      if (result.session) {
        console.log('注册成功，已有 session')
        setLoadingMessage('注册成功！')
        // 等待一下让用户看到成功消息
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/')
          router.refresh()
        }
      } else {
        console.log('注册成功，但没有 session，尝试登录...')
        setLoadingMessage('正在登录...')

        // 等待一下让触发器完成
        await new Promise((resolve) => setTimeout(resolve, 1000))

        try {
          const loginResult = await signIn(data.email, data.password)
          console.log('登录结果:', loginResult)

          setLoadingMessage('登录成功！')
          await new Promise((resolve) => setTimeout(resolve, 500))

          if (onSuccess) {
            onSuccess()
          } else {
            router.push('/')
            router.refresh()
          }
        } catch (loginError) {
          console.error('自动登录失败:', loginError)
          setError('注册成功！请手动登录')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }
      }
    } catch (err) {
      console.error('注册错误:', err)
      const appError = classifyError(err)
      setError(appError.message || '注册失败，请重试')
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <ErrorMessage error={error} />}

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
        <div className="flex items-center justify-center space-x-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm text-blue-700 dark:text-blue-300">{loadingMessage}</span>
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {isLoading ? '注册中...' : '注册'}
      </Button>
    </form>
  )
}
