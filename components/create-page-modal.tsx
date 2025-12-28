'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

interface CreatePageModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export function CreatePageModal({ isOpen, onClose, projectId }: CreatePageModalProps) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')

  const utils = trpc.useUtils()
  const createPage = trpc.page.create.useMutation({
    onSuccess: () => {
      utils.page.getByProject.invalidate({ projectId })
      setTitle('')
      setSlug('')
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-')
    createPage.mutate({
      projectId,
      title,
      slug: finalSlug,
      content: `# ${title}\n\nStart writing your documentation here...`,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">Create New Page</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="e.g., Getting Started"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug (optional)
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Auto-generated from title"
            />
            <p className="mt-1 text-sm text-gray-500">
              Will be: {slug || title.toLowerCase().replace(/\s+/g, '-')}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPage.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {createPage.isPending ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
