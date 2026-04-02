import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { Link } from "@/models/Link"
import { PublicProfile } from "@/types"
import { PublicProfileView } from "@/components/PublicProfileView"
import { notFound } from "next/navigation"

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.username} | DevLinks`,
  }
}

export default async function UserProfilePage({ params }: Props) {
  await connectDB()

  const user = await User.findOne({ username: params.username }).lean()

  if (!user) {
    notFound()
  }

  const links = await Link.find({ userId: user._id.toString() })
    .sort({ order: 1 })
    .lean()

  const profile: PublicProfile = {
    user: {
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
    },
    links: links.map((l) => ({
      _id: l._id.toString(),
      title: l.title,
      url: l.url,
      icon: l.icon,
      clicks: l.clicks,
    })),
  }

  return <PublicProfileView profile={profile} />
}