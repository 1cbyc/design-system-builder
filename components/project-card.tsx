'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  primaryColor: string
  secondaryColor: string
  createdAt: Date
  updatedAt: Date
  _count: {
    components: number
    themes: number
    pages: number
  }
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
            {project.name}
          </h3>
          {project.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        <div className="ml-4 flex gap-2">
          <div
            className="h-6 w-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: project.primaryColor }}
            title="Primary Color"
          />
          <div
            className="h-6 w-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: project.secondaryColor }}
            title="Secondary Color"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex gap-4">
          <span title="Components">
            📦 {project._count.components}
          </span>
          <span title="Themes">
            🎨 {project._count.themes}
          </span>
          <span title="Pages">
            📄 {project._count.pages}
          </span>
        </div>
        <span title={new Date(project.updatedAt).toLocaleString()}>
          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </Link>
  )
}
