'use client'

import { useState } from 'react'
import { generateComponent } from '@/generators/component'
import { Framework } from '@/types'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  componentName: string
  code: string
  props?: Record<string, any>
}

export function ExportModal({ isOpen, onClose, componentName, code, props = {} }: ExportModalProps) {
  const [framework, setFramework] = useState<Framework>('react')
  const [copied, setCopied] = useState(false)

  const generatedCode = generateComponent({
    name: componentName,
    code,
    props,
    framework,
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const ext = framework === 'react' ? 'tsx' : framework === 'vue' ? 'vue' : 'svelte'
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${componentName}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">Export Component</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Framework
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFramework('react')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                framework === 'react'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              React
            </button>
            <button
              onClick={() => setFramework('vue')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                framework === 'vue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vue
            </button>
            <button
              onClick={() => setFramework('svelte')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                framework === 'svelte'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Svelte
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <pre className="rounded-lg bg-gray-900 p-4 text-sm text-white overflow-x-auto">
            <code>{generatedCode}</code>
          </pre>
        </div>

        <div className="flex justify-between border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 transition"
          >
            Close
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 transition"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
