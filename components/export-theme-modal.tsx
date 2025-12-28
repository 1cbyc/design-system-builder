'use client'

import { useState } from 'react'
import { generateThemeCSS, generateThemeTailwind, generateThemeJSON } from '@/generators/theme'

type ExportFormat = 'css' | 'tailwind' | 'json'

interface ExportThemeModalProps {
  isOpen: boolean
  onClose: () => void
  theme: {
    name: string
    colors: Record<string, any>
    typography?: Record<string, any>
    spacing?: Record<string, any>
    borderRadius?: Record<string, any>
    shadows?: Record<string, any>
  }
}

export function ExportThemeModal({ isOpen, onClose, theme }: ExportThemeModalProps) {
  const [format, setFormat] = useState<ExportFormat>('css')
  const [copied, setCopied] = useState(false)

  const generatedCode = format === 'css' 
    ? generateThemeCSS(theme as any)
    : format === 'tailwind'
    ? generateThemeTailwind(theme as any)
    : generateThemeJSON(theme as any)

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const ext = format === 'json' ? 'json' : format === 'tailwind' ? 'js' : 'css'
    const filename = format === 'tailwind' ? 'tailwind.config' : `theme.${ext}`
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">Export Theme</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('css')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                format === 'css'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              CSS Variables
            </button>
            <button
              onClick={() => setFormat('tailwind')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                format === 'tailwind'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tailwind Config
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                format === 'json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              JSON
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
