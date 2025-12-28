'use client'

import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ExportThemeModal } from '@/components/export-theme-modal'

interface ColorShade {
  [key: string]: string
}

interface ColorPalette {
  [category: string]: ColorShade
}

export default function ThemeEditorPage() {
  const params = useParams()
  const router = useRouter()
  const themeId = params.themeId as string
  const projectSlug = params.slug as string

  const { data: theme, isLoading } = trpc.theme.getByProject.useQuery({ 
    projectId: params.slug as string 
  })
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'other'>('colors')
  const [colors, setColors] = useState<ColorPalette>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const updateTheme = trpc.theme.update.useMutation()

  useEffect(() => {
    if (theme && theme.length > 0) {
      const currentTheme = theme.find(t => t.id === themeId) || theme[0]
      if (currentTheme.colors && typeof currentTheme.colors === 'object') {
        setColors(currentTheme.colors as ColorPalette)
      }
    }
  }, [theme, themeId])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateTheme.mutateAsync({
        id: themeId,
        colors,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateColor = (category: string, shade: string, value: string) => {
    setColors(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [shade]: value,
      },
    }))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading theme...</p>
        </div>
      </div>
    )
  }

  const currentTheme = theme?.find(t => t.id === themeId)

  if (!currentTheme) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Theme Not Found</h1>
          <Link
            href={`/projects/${projectSlug}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition inline-block"
          >
            Back to Project
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectSlug}`}
            className="rounded-lg p-2 hover:bg-gray-100 transition"
            title="Back to Project"
          >
            ←
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{currentTheme.name}</h1>
            <p className="text-sm text-gray-600">
              Theme Editor {currentTheme.isDefault && '• Default'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition"
          >
            Export Theme
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-4">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('colors')}
            className={`border-b-2 px-1 py-3 text-sm font-medium transition ${
              activeTab === 'colors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Colors
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`border-b-2 px-1 py-3 text-sm font-medium transition ${
              activeTab === 'typography'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Typography
          </button>
          <button
            onClick={() => setActiveTab('spacing')}
            className={`border-b-2 px-1 py-3 text-sm font-medium transition ${
              activeTab === 'spacing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Spacing
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`border-b-2 px-1 py-3 text-sm font-medium transition ${
              activeTab === 'other'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Other
          </button>
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {Object.entries(colors).map(([category, shades]) => (
              <div key={category} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(shades as ColorShade).map(([shade, value]) => (
                    <div key={shade}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {shade}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => updateColor(category, shade, e.target.value)}
                          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateColor(category, shade, e.target.value)}
                          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm font-mono"
                        />
                      </div>
                      <div
                        className="mt-2 h-12 rounded border border-gray-200"
                        style={{ backgroundColor: value }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Families</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sans Serif</label>
                  <input
                    type="text"
                    defaultValue={(currentTheme.typography as any)?.fontFamily?.sans || 'system-ui, sans-serif'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serif</label>
                  <input
                    type="text"
                    defaultValue={(currentTheme.typography as any)?.fontFamily?.serif || 'Georgia, serif'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monospace</label>
                  <input
                    type="text"
                    defaultValue={(currentTheme.typography as any)?.fontFamily?.mono || 'monospace'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Sizes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['xs', 'sm', 'base', 'lg', 'xl', '2xl'].map((size) => (
                  <div key={size}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{size}</label>
                    <input
                      type="text"
                      defaultValue={(currentTheme.typography as any)?.fontSize?.[size] || '1rem'}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spacing Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['0', '1', '2', '4', '8', '12', '16', '20', '24'].map((scale) => (
                <div key={scale}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{scale}</label>
                  <input
                    type="text"
                    defaultValue={(currentTheme.spacing as any)?.scale?.[scale] || '0'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="e.g., 0.5rem"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'other' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Border Radius</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['none', 'sm', 'md', 'lg', 'full'].map((size) => (
                  <div key={size}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{size}</label>
                    <input
                      type="text"
                      defaultValue={(currentTheme.borderRadius as any)?.[size] || '0'}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shadows</h3>
              <div className="space-y-4">
                {['sm', 'md', 'lg', 'xl'].map((size) => (
                  <div key={size}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{size}</label>
                    <input
                      type="text"
                      defaultValue={(currentTheme.shadows as any)?.[size] || ''}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="e.g., 0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <ExportThemeModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={{
          name: currentTheme.name,
          colors: colors,
          typography: currentTheme.typography as Record<string, any>,
          spacing: currentTheme.spacing as Record<string, any>,
          borderRadius: currentTheme.borderRadius as Record<string, any>,
          shadows: currentTheme.shadows as Record<string, any>,
        }}
      />
    </div>
  )
}
