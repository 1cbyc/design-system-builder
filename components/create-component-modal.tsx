'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

interface CreateComponentModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

const categories = [
  'Button',
  'Input',
  'Card',
  'Modal',
  'Navigation',
  'Layout',
  'Typography',
  'Form',
  'Feedback',
  'Other',
]

export function CreateComponentModal({ isOpen, onClose, projectId }: CreateComponentModalProps) {
  const utils = trpc.useUtils()
  const [formData, setFormData] = useState({
    name: '',
    category: 'Button',
    description: '',
  })

  const createComponent = trpc.component.create.useMutation({
    onSuccess: () => {
      utils.project.getBySlug.invalidate()
      onClose()
      setFormData({ name: '', category: 'Button', description: '' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createComponent.mutate({
      projectId,
      ...formData,
      code: `// ${formData.name} Component\nexport default function ${formData.name.replace(/\s+/g, '')}() {\n  return (\n    <div>\n      {/* Your component code here */}\n    </div>\n  )\n}`,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">Create New Component</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Button, Card, Modal..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="A brief description of this component..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createComponent.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {createComponent.isPending ? 'Creating...' : 'Create Component'}
            </button>
          </div>

          {createComponent.error && (
            <p className="text-sm text-red-600">
              Error: {createComponent.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
