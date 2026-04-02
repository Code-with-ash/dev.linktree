"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ILink } from "@/types"
import { AddLinkForm } from "@/components/AddLinkForm"
import { LinkCard } from "@/components/LinkCard"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [links, setLinks] = useState<ILink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchLinks()
    }
  }, [session])

  async function fetchLinks() {
    try {
      const res = await fetch("/api/links")
      const data = await res.json()
      if (data.success) {
        setLinks(data.data)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(linkId: string) {
    const res = await fetch(`/api/links?id=${linkId}`, { method: "DELETE" })
    const data = await res.json()
    if (data.success) {
      setLinks((prev) => prev.filter((l) => l._id !== linkId))
    }
  }

  function handleLinkAdded(newLink: ILink) {
    setLinks((prev) => [...prev, newLink])
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900">DevLinks</h1>
          <p className="text-xs text-gray-400">
            yourapp.com/{session?.user?.username}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/${session?.user?.username}`}
            target="_blank"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            View profile
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-10">
        <AddLinkForm onLinkAdded={handleLinkAdded} />

        <div className="mt-8 space-y-3">
          {links.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              No links yet. Add your first one above.
            </p>
          ) : (
            links.map((link) => (
              <LinkCard
                key={link._id}
                link={link}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}