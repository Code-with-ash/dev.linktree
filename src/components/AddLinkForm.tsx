"use client"

import { useState } from "react"
import { ILink } from "@/types"

interface Props {
  onLinkAdded: (link: ILink) => void
}

export function AddLinkForm({ onLinkAdded }: Props) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url }),
      })

      const data = await res.json()

      if (data.success) {
        onLinkAdded(data.data)
        setTitle("")
        setUrl("")
      } else {
        setError(data.error)
      }
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      <h2 className="font-medium text-gray-900 mb-4">Add a new link</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Title — e.g. My Portfolio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
        />
        <input
          type="url"
          placeholder="URL — e.g. https://rahul.dev"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
        />

        {error && (
          <p className="text-red-500 text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add link"}
        </button>
      </div>
    </form>
  )
}