'use client'

import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import Split from 'react-split'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function PageEditorPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.pageId as string
  const projectSlug = params.slug as string

  const { data: page, isLoading } = trpc.page.getById.useQuery({ id: pageId })
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const updatePage = trpc.page.update.useMutation()

  useEffect(() => {
    if (page) {
      setContent(page.content || '')
    }
  }, [page])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updatePage.mutateAsync({
        id: pageId,
        content,
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
          <p className="mt-4 text-gray-600">Loading page...</p>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
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
            <h1 className="text-lg font-bold text-gray-900">{page.title}</h1>
            <p className="text-sm text-gray-600">Documentation Page</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
          {/* Markdown Editor */}
          <div className="flex flex-col border-r border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-700">Markdown Editor</h3>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={content}
                onChange={(value) => setContent(value || '')}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {/* Markdown Preview */}
          <div className="flex flex-col">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
            </div>
            <div className="flex-1 overflow-auto bg-white p-8">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </Split>
      </div>
    </div>
  )
}
