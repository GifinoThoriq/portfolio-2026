import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.tsx'
import ProjectPage from './pages/ProjectPage.tsx'
import BlogPostPage from './pages/BlogPostPage.tsx'
import { queryClient } from './lib/queryClient.ts'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/work/:slug', element: <ProjectPage /> },
  { path: '/blog/:slug', element: <BlogPostPage /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
