import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Demo',
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Enter any name" }
      },
      async authorize(credentials) {
        if (!credentials?.name) return null
        
        // Find or create user
        let user = await prisma.user.findFirst({
          where: { name: credentials.name }
        })
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: credentials.name,
              email: `${credentials.name.toLowerCase().replace(/\s+/g, '')}@demo.com`,
            }
          })
        }
        
        return user
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
}
