'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold">Design System Builder</h1>
          <p className="mb-8 text-xl text-gray-600">
            Create, document, and maintain component libraries
          </p>
          <button
            onClick={() => signIn()}
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700 transition"
          >
            Sign In to Get Started
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold mb-2">Visual Builder</h3>
            <p className="text-gray-600">
              Create components visually with live preview
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Code Generation</h3>
            <p className="text-gray-600">
              Export to React, Vue, or Svelte
            </p>
          </div>
          <div className="text-center p-6">
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
    <div className="min-h-screen p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Design System Builder</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            {session.user?.name || session.user?.email}
          </span>
          <button
            onClick={() => signOut()}
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
          <p className="text-gray-600 mb-4">
            Get started by creating your first design system project.
          </p>
          <button className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition">
            + New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project cards will go here */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">No projects yet</p>
          </div>
        </div>
      </main>
    </div>
  )
}
