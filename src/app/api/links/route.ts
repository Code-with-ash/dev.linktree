import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Link } from "@/models/Link"
import { ApiResponse, ILink } from "@/types"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    await connectDB()
    const links = await Link.find({ userId: session.user.id })
      .sort({ order: 1 })
      .lean()

    return NextResponse.json<ApiResponse<ILink[]>>({
      success: true,
      data: links as unknown as ILink[],
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch links" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    await connectDB()
    const body = await req.json()
    const { title, url, icon } = body

    if (!title || !url) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Title and URL are required" },
        { status: 400 }
      )
    }

    const count = await Link.countDocuments({ userId: session.user.id })

    const link = await Link.create({
      userId: session.user.id,
      title,
      url,
      icon: icon || "globe",
      order: count,
    })

    return NextResponse.json<ApiResponse<ILink>>({
      success: true,
      data: link as unknown as ILink,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to create link" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    await connectDB()
    const { searchParams } = new URL(req.url)
    const linkId = searchParams.get("id")

    if (!linkId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Link ID is required" },
        { status: 400 }
      )
    }

    await Link.findOneAndDelete({ _id: linkId, userId: session.user.id })

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Failed to delete link" },
        { status: 500 }
    )
  }
}