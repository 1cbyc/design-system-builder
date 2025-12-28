'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

interface CreateThemeModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export function CreateThemeModal({ isOpen, onClose, projectId }: CreateThemeModalProps) {
  const utils = trpc.useUtils()
  const [formData, setFormData] = useState({
    name: '',
    isDefault: false,
  })

  const createTheme = trpc.theme.create.useMutation({
    onSuccess: () => {
      utils.project.getBySlug.invalidate()
      onClose()
      setFormData({ name: '', isDefault: false })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTheme.mutate({
      projectId,
      ...formData,
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 500: '#3b82f6', 900: '#1e3a8a' },
        secondary: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 500: '#a855f7', 900: '#581c87' },
        neutral: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 500: '#6b7280', 900: '#111827' },
        success: { 50: '#f0fdf4', 500: '#22c55e', 900: '#14532d' },
        warning: { 50: '#fffbeb', 500: '#f59e0b', 900: '#78350f' },
        error: { 50: '#fef2f2', 500: '#ef4444', 900: '#7f1d1d' },
      },
      typography: {
        fontFamily: { sans: 'system-ui, sans-serif', serif: 'Georgia, serif', mono: 'monospace' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' },
        fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
        letterSpacing: { tight: '-0.025em', normal: '0', wide: '0.025em' },
      },
      spacing: {
        scale: { 0: '0', 1: '0.25rem', 2: '0.5rem', 4: '1rem', 8: '2rem', 16: '4rem' },
      },
      borderRadius: { none: '0', sm: '0.125rem', md: '0.375rem', lg: '0.5rem', full: '9999px' },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">Create New Theme</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Default Theme, Dark Mode, Light..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Set as default theme
            </label>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              A new theme will be created with default values for colors, typography, spacing, and more. 
              You can customize it after creation.
            </p>
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
              disabled={createTheme.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {createTheme.isPending ? 'Creating...' : 'Create Theme'}
            </button>
          </div>

          {createTheme.error && (
            <p className="text-sm text-red-600">
              Error: {createTheme.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
