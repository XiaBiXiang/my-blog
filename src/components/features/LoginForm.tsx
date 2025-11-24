'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/lib/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/lib/utils/validators'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { classifyError } from '@/lib/utils/errors'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const { signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('=== 登录表单提交 ===')
      console.log('输入:', data.identifier)

      // 移除超时限制，增加到60秒
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('登录超时，请检查网络连接')), 60000)
      )

      await Promise.race([signIn(data.identifier, data.password), timeoutPromise])

      console.log('登录成功，准备跳转')

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      console.error('登录失败:', err)
      const appError = classifyError(err)
      setError(appError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <ErrorMessage error={error} />}

      <Input
        label="邮箱或用户名"
        type="text"
        placeholder="your@email.com 或 username"
        error={errors.identifier?.message}
        {...register('identifier')}
      />

      <Input
        label="密码"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        登录
      </Button>
    </form>
  )
}
