import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          DevLinks
        </h1>
        <p className="text-gray-500 mb-8">
          One link for all your developer profiles. Share your GitHub,
          portfolio, LinkedIn and more — all in one place.
        </p>
        <Link
          href="/auth/login"
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
        >
          Get started free
        </Link>
      </div>
    </div>
  )
}