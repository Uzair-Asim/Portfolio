import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    GitHub({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      const allowedUsername = process.env.ADMIN_GITHUB_USERNAME
      return profile?.login === allowedUsername
    },

    async session({ session, token }) {
      if (session.user && token.login) {
        (session.user as any).username = token.login
      }
      return session
    },

    async jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as any).login
      }
      return token
    },
  },

  pages: {
    signIn: '/admin/login',
    error:  '/admin/login',
  },
})