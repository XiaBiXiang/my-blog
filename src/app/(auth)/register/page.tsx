import Link from 'next/link'
import { RegisterFormFinal } from '@/components/features/RegisterFormFinal'
import { PageTransition } from '@/components/animations/PageTransition'

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              创建账户
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              开始您的作品集之旅
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800/80 sm:p-8">
            <RegisterFormFinal />

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">已有账户？</span>{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                立即登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
