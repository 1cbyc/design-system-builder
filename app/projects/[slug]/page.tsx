'use client'

import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { CreateComponentModal } from '@/components/create-component-modal'
import { CreateThemeModal } from '@/components/create-theme-modal'

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState<'components' | 'themes' | 'pages'>('components')
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false)
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)

  const { data: project, isLoading } = trpc.project.getBySlug.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="rounded-lg p-2 hover:bg-gray-100 transition"
                title="Back to Dashboard"
              >
                ← 
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <div className="flex gap-2">
                    <div
                      className="h-6 w-6 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: project.primaryColor }}
                      title="Primary Color"
                    />
                    <div
                      className="h-6 w-6 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: project.secondaryColor }}
                      title="Secondary Color"
                    />
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{session?.user?.name || session?.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('components')}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition ${
                activeTab === 'components'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Components ({project.components.length})
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition ${
                activeTab === 'themes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Themes ({project.themes.length})
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition ${
                activeTab === 'pages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Pages ({project.pages.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'components' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Components</h2>
              <button 
                onClick={() => setIsComponentModalOpen(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
              >
                + New Component
              </button>
            </div>
            {project.components.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No components yet</h3>
                <p className="text-gray-600 mb-6">Start building your component library</p>
                <button 
                  onClick={() => setIsComponentModalOpen(true)}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
                >
                  Create First Component
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.components.map((component) => (
                  <Link
                    key={component.id}
                    href={`/projects/${slug}/components/${component.id}`}
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{component.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        component.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {component.status}
                      </span>
                    </div>
                    {component.description && (
                      <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">{component.category}</span>
                      <span>v{component.version}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'themes' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Themes</h2>
              <button 
                onClick={() => setIsThemeModalOpen(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
              >
                + New Theme
              </button>
            </div>
            {project.themes.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No themes yet</h3>
                <p className="text-gray-600 mb-6">Create your first theme configuration</p>
                <button 
                  onClick={() => setIsThemeModalOpen(true)}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
                >
                  Create First Theme
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.themes.map((theme) => (
                  <Link
                    key={theme.id}
                    href={`/projects/${slug}/themes/${theme.id}`}
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                      {theme.isDefault && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pages' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Documentation Pages</h2>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
                + New Page
              </button>
            </div>
            {project.pages.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages yet</h3>
                <p className="text-gray-600 mb-6">Start documenting your design system</p>
                <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition">
                  Create First Page
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {project.pages.map((page) => (
                  <div
                    key={page.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{page.title}</h3>
                        {page.category && (
                          <span className="text-sm text-gray-500">{page.category}</span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        page.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <CreateComponentModal 
        isOpen={isComponentModalOpen} 
        onClose={() => setIsComponentModalOpen(false)}
        projectId={project.id}
      />
      <CreateThemeModal 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)}
        projectId={project.id}
      />
    </div>
  )
}
