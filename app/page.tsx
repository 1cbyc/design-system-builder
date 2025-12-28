'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { trpc } from '@/lib/trpc'
import { ProjectCard } from '@/components/project-card'
import { CreateProjectModal } from '@/components/create-project-modal'
import { useState } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { data: projects, isLoading } = trpc.project.getAll.useQuery(undefined, {
    enabled: !!session,
  })

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Design System Builder
          </h1>
          <p className="mb-8 text-xl text-gray-600 max-w-2xl">
            Create, document, and maintain component libraries with live preview, 
            theme management, and multi-framework code generation
          </p>
          <button
            onClick={() => signIn()}
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Sign In to Get Started
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold mb-2">Visual Builder</h3>
            <p className="text-gray-600">
              Create components visually with live preview
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Code Generation</h3>
            <p className="text-gray-600">
              Export to React, Vue, or Svelte
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <p className="text-gray-600">
              Auto-generate docs site with Storybook
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Design System Builder</h1>
              <p className="text-sm text-gray-600">Welcome back, {session.user?.name || session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Your Projects</h2>
            <p className="text-gray-600 mt-1">
              {projects?.length === 0
                ? 'Create your first design system project to get started'
                : `Managing ${projects?.length} design system${projects?.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition shadow hover:shadow-md flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            New Project
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first design system project</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </main>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
