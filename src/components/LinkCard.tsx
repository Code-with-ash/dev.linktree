"use client"

import { useState } from "react"
import { ILink } from "@/types"

interface Props {
  link: ILink
  onDelete: (linkId: string) => void
}

export function LinkCard({ link, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Delete this link?")) return
    setDeleting(true)
    await onDelete(link._id)
    setDeleting(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{link.title}</p>
        <p className="text-xs text-gray-400 truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{link.clicks}</p>
          <p className="text-xs text-gray-400">clicks</p>
        </div>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg transition-colors"
        >
          Visit
        </a>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? "..." : "Delete"}
        </button>
      </div>
    </div>
  )
}