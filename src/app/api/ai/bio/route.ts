import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { ApiResponse } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { username } = body

    if (!username) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "GitHub username is required" },
        { status: 400 }
      )
    }

    const githubRes = await fetch(`https://api.github.com/users/${username}`)
    const githubData = await githubRes.json()

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      Write a short, professional bio (2-3 sentences max) for a developer profile page.
      Use this GitHub data:
      - Name: ${githubData.name || username}
      - Public repos: ${githubData.public_repos}
      - Followers: ${githubData.followers}
      - GitHub bio: ${githubData.bio || "not provided"}
      - Location: ${githubData.location || "not provided"}
      
      Make it friendly, concise and suitable for a developer link tree page.
      Return only the bio text, no extra commentary.
    `

    const result = await model.generateContent(prompt)
    const bio = result.response.text()

    return NextResponse.json<ApiResponse<{ bio: string }>>({
      success: true,
      data: { bio },
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to generate bio" },
      { status: 500 }
    )
  }
}