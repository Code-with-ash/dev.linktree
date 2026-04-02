import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { connectDB } from "./db"
import { User } from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        await connectDB()

        const existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          const username = (profile?.email as string) || user.email!.split("@")[0]
          await User.create({
            name: user.name,
            email: user.email,
            username: username.toLowerCase(),
            image: user.image,
            bio: "",
          })
        }

        return true
      } catch (error) {
        console.error("SignIn error:", error)
        return false
      }
    },

    async session({ session }) {
      try {
        await connectDB()
        const dbUser = await User.findOne({ email: session.user?.email })
        if (dbUser) {
          session.user.username = dbUser.username
          session.user.id = dbUser._id.toString()
        }
        return session
      } catch (error) {
        console.error("Session error:", error)
        return session
      }
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
}