# Authentication System

This authentication system is built with Supabase Auth and includes the following features:

## Features Implemented

1. **User Registration** - Users can create accounts with email and password
2. **Email Verification** - Email verification flow with callback handling
3. **User Login** - Secure login with email and password
4. **Session Management** - Automatic session refresh and persistence
5. **Logout** - Clean logout with session clearing
6. **Protected Routes** - Utility component for protecting routes
7. **Auth State Management** - Global auth state with Zustand

## Components

### Core Components

- `AuthProvider` - Wraps the app and initializes auth state
- `LoginForm` - Login form with validation
- `RegisterForm` - Registration form with validation
- `ProtectedRoute` - HOC for protecting routes

### Hooks

- `useAuth()` - Access auth state and methods anywhere in the app

### Store

- `authStore` - Zustand store for global auth state

## Usage

### Setup Environment Variables

Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Using the Auth Hook

```tsx
'use client'

import { useAuth } from '@/lib/hooks/useAuth'

export function MyComponent() {
  const { user, loading, signOut, isAdmin } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {user ? (
        <>
          <p>Welcome {user.email}</p>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  )
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/components/providers/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  )
}

// For admin-only routes
export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div>Admin only content</div>
    </ProtectedRoute>
  )
}
```

## Validation

Password requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Routes

- `/login` - Login page
- `/register` - Registration page
- `/auth/callback` - Email verification callback

## Next Steps

To complete the authentication setup:

1. Configure your Supabase project
2. Set up email templates in Supabase Dashboard
3. Add your actual credentials to `.env.local`
4. Test the registration and login flows
5. Implement password reset functionality (optional)
