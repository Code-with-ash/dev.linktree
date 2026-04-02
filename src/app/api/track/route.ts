import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Link } from "@/models/Link"
import { ClickEvent } from "@/models/ClickEvent"
import { ApiResponse } from "@/types"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const { linkId } = body

    if (!linkId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Link ID is required" },
        { status: 400 }
      )
    }

    const link = await Link.findById(linkId)
    if (!link) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Link not found" },
        { status: 404 }
      )
    }

    await Promise.all([
      Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }),
      ClickEvent.create({
        linkId,
        clickedAt: new Date(),
        userAgent: req.headers.get("user-agent") || "",
      }),
    ])

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to track click" },
      { status: 500 }
    )
  }
}