'use client'

import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import Split from 'react-split'
import { LiveProvider, LivePreview, LiveError } from 'react-live'
import { ExportModal } from '@/components/export-modal'

export default function ComponentEditorPage() {
  const params = useParams()
  const router = useRouter()
  const componentId = params.id as string
  const projectSlug = params.slug as string

  const { data: component, isLoading } = trpc.component.getById.useQuery({ id: componentId })
  const [code, setCode] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const updateComponent = trpc.component.update.useMutation()

  useEffect(() => {
    if (component) {
      setCode(component.code)
    }
  }, [component])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateComponent.mutateAsync({
        id: componentId,
        code,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading component...</p>
        </div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Component Not Found</h1>
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
            <h1 className="text-lg font-bold text-gray-900">{component.name}</h1>
            <p className="text-sm text-gray-600">
              {component.category} • v{component.version} • {component.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition"
          >
            Export
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Editor and Preview */}
      <div className="flex-1 overflow-hidden">
        <Split
          className="flex h-full"
          sizes={[50, 50]}
          minSize={300}
          gutterSize={8}
          cursor="col-resize"
        >
          {/* Code Editor */}
          <div className="flex flex-col border-r border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-700">Code Editor</h3>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex flex-col">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-700">Live Preview</h3>
            </div>
            <div className="flex-1 overflow-auto bg-white p-8">
              <LiveProvider code={code} noInline={false}>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8">
                  <LivePreview />
                </div>
                <LiveError className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800" />
              </LiveProvider>
            </div>
          </div>
        </Split>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        componentName={component.name}
        code={code}
        props={component.props as Record<string, any>}
      />
    </div>
  )
}
