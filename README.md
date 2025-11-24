# Portfolio Site

Modern portfolio website built with Next.js 14, featuring Glassmorphism and Bento Grid design.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Supabase (Auth, Database, Realtime, Storage)
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **3D Graphics**: Three.js + React Three Fiber

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
portfolio-site/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   │   ├── ui/                 # Basic UI components
│   │   ├── layout/             # Layout components
│   │   ├── features/           # Feature components
│   │   └── animations/         # Animation components
│   ├── lib/                    # Utilities and libraries
│   │   ├── supabase/           # Supabase client configuration
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   └── types/              # TypeScript types
│   └── stores/                 # Zustand state management
├── public/                     # Static assets
└── supabase/                   # Supabase migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size

## Features

- 🔐 User authentication with Supabase Auth
- 💬 Real-time guestbook with Supabase Realtime
- ⏰ Time capsule (admin-only microblog)
- ⌨️ Command palette (CMD+K / CTRL+K)
- 🎨 Glassmorphism UI design
- 📦 Bento Grid layout system
- 🎮 Interactive 3D skill tree
- 📱 Fully responsive design
- 🌙 Dark/Light theme support
- ⚡ Optimized performance with Next.js

## Deployment

This project is optimized for deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/portfolio-site)

### Environment Variables

Required environment variables for deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=your_site_url
```

## Performance

- ✅ Lighthouse Score: 90+
- ✅ First Load JS: < 90KB
- ✅ LCP: < 2.5s
- ✅ FID: < 100ms
- ✅ CLS: < 0.1

See [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) for details.

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md) - Performance optimization details
- [Error Handling](./ERROR_HANDLING_IMPLEMENTATION.md) - Error handling implementation
- [Project Management](./PROJECT_MANAGEMENT_IMPLEMENTATION.md) - Project management features
- [Storage Setup](./STORAGE_SETUP.md) - Supabase storage configuration

## License

MIT
