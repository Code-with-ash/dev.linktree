"use client"

import { useState } from "react"
import { PublicProfile } from "@/types"

interface Props {
  profile: PublicProfile
}

export function PublicProfileView({ profile }: Props) {
  const { user, links } = profile
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set())

  async function handleLinkClick(linkId: string, url: string) {
    if (!clickedLinks.has(linkId)) {
      setClickedLinks((prev) => new Set(prev).add(linkId))
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
      })
    }
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          {user.image && (
            <img
              src={user.image}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white shadow-sm"
            />
          )}
          <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-400">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-gray-600 mt-3 max-w-xs mx-auto leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {links.length === 0 ? (
            <p className="text-center text-gray-400 text-sm">
              No links added yet.
            </p>
          ) : (
            links.map((link) => (
              <button
                key={link._id}
                onClick={() => handleLinkClick(link._id, link.url)}
                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-left shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <span className="font-medium text-gray-900 group-hover:text-black transition-colors">
                  {link.title}
                </span>
              </button>
            ))
          )}
        </div>

        <p className="text-center text-xs text-gray-300 mt-12">
          Made with DevLinks
        </p>
      </div>
    </div>
  )
}