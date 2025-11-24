'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'
import { classifyError, logError } from '@/lib/utils/errors'
import type { User } from '@supabase/supabase-js'

// Extended user type with profile data
interface ExtendedUser extends User {
  username?: string
  role?: string
}

export function useAuth() {
  const router = useRouter()
  const { user, session, loading, setUser, setSession, setLoading, reset } = useAuthStore()
  const [authError, setAuthError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    // Helper function to enrich user with profile data
    const enrichUser = async (authUser: User): Promise<ExtendedUser> => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, role')
          .eq('id', authUser.id)
          .single()

        return {
          ...authUser,
          username: profile?.username,
          role: profile?.role,
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        return authUser
      }
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (session?.user) {
          const enrichedUser = await enrichUser(session.user)
          setUser(enrichedUser)
        } else {
          setUser(null)
        }

        setSession(session)
        setAuthError(null)
      } catch (error) {
        if (!mounted) return
        const appError = classifyError(error)
        logError(appError, 'Auth initialization')
        setAuthError(appError.message)
        console.error('Error getting session:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (session?.user) {
        const enrichedUser = await enrichUser(session.user)
        setUser(enrichedUser)
      } else {
        setUser(null)
      }

      setSession(session)
      setLoading(false)

      // Handle session expiration
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          setAuthError('会话已过期，请重新登录')
        }
      }

      // Clear error on successful sign in
      if (event === 'SIGNED_IN') {
        setAuthError(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signIn = async (identifier: string, password: string) => {
    try {
      setAuthError(null)
      console.log('=== 登录开始 ===')
      console.log('输入的标识符:', identifier)

      // 判断是邮箱还是用户名
      const isEmail = identifier.includes('@')
      let email = identifier

      // 如果是用户名，先查询对应的邮箱
      if (!isEmail) {
        console.log('检测到用户名，查询对应邮箱...')
        console.log('查询条件: username =', identifier)

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .maybeSingle()

        console.log('查询结果:', { profile, profileError })

        if (profileError) {
          console.error('数据库查询错误:', profileError)
          throw new Error('数据库操作失败，请稍后重试')
        }

        if (!profile) {
          console.log('未找到用户名对应的记录')
          throw new Error('用户名或密码错误')
        }

        email = profile.email
        console.log('找到对应邮箱:', email)
      } else {
        console.log('检测到邮箱，直接登录')
      }

      console.log('使用邮箱登录:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('登录响应:', {
        hasData: !!data,
        hasUser: !!data?.user,
        error: error,
      })

      if (error) {
        console.error('登录失败:', error)
        const appError = classifyError(error)
        logError(appError, 'Sign in')
        setAuthError(appError.message)
        throw error
      }

      console.log('=== 登录成功 ===')
      return data
    } catch (error) {
      console.error('=== 登录异常 ===', error)
      const appError = classifyError(error)
      setAuthError(appError.message)
      throw error
    }
  }

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      setAuthError(null)
      console.log('signUp 开始:', { email, username })

      // 检查用户名是否已存在
      if (username) {
        console.log('检查用户名是否存在...')
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .maybeSingle()

        if (checkError) {
          console.warn('检查用户名时出错:', checkError)
          // 继续注册，让数据库约束处理重复
        }

        if (existingProfile) {
          throw new Error('用户名已被使用')
        }
      }

      console.log('调用 Supabase signUp...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username: username || email.split('@')[0],
          },
        },
      })

      console.log('signUp 响应:', { data, error })

      if (error) {
        const appError = classifyError(error)
        logError(appError, 'Sign up')
        setAuthError(appError.message)
        throw error
      }

      if (!data) {
        throw new Error('注册失败：没有返回数据')
      }

      return data
    } catch (error) {
      console.error('signUp 错误:', error)
      const appError = classifyError(error)
      setAuthError(appError.message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setAuthError(null)
      const { error } = await supabase.auth.signOut()

      if (error) {
        const appError = classifyError(error)
        logError(appError, 'Sign out')
        setAuthError(appError.message)
        throw error
      }

      reset()
      router.push('/login')
    } catch (error) {
      const appError = classifyError(error)
      setAuthError(appError.message)
      // Still reset and redirect even if sign out fails
      reset()
      router.push('/login')
    }
  }

  const extendedUser = user as ExtendedUser | null
  const isAdmin = extendedUser?.role === 'admin'

  return {
    user: extendedUser,
    session,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    isAdmin,
  }
}
