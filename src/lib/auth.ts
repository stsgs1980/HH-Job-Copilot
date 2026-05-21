// ============================================================
// NextAuth Configuration — HH Job Copilot
// v4 API — JWT strategy with plan/id on token & session
// ============================================================

import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '@/lib/db'
import { isFeatureEnabled } from '@/lib/feature-flags'

/** Extended session type with custom fields */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      plan: string
    }
  }

  interface User {
    plan?: string
  }
}

/** Extended JWT type with custom fields */
declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    plan: string
  }
}

/**
 * Custom HH.ru OAuth provider.
 * HH.ru uses standard OAuth2 authorization code flow.
 * Docs: https://github.com/hhru/api/blob/master/docs/authorization.md
 */
function HHruProvider() {
  return {
    id: 'hh',
    name: 'HH.ru',
    type: 'oauth' as const,
    authorization: {
      url: 'https://hh.ru/oauth/authorize',
      params: {
        response_type: 'code',
      },
    },
    token: 'https://hh.ru/oauth/token',
    userinfo: 'https://api.hh.ru/me',
    clientId: process.env.HH_CLIENT_ID,
    clientSecret: process.env.HH_CLIENT_SECRET,
    profile: async (profile: Record<string, unknown>) => {
      return {
        id: String(profile.id ?? ''),
        email: String(profile.email ?? ''),
        name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'HH.ru User',
        image: null,
        plan: 'STARTER',
      }
    },
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Email + Password (Credentials)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email и пароль обязательны')
        }

        // Look up user in DB
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error('Пользователь не найден')
        }

        // For MVP: plain text password check
        // TODO: Replace with bcrypt/argon2 when implementing real auth
        // For now, any password >= 6 chars works for existing users
        if (credentials.password.length < 6) {
          throw new Error('Неверный пароль')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          plan: user.plan,
        }
      },
    }),

    // Google OAuth (only if credentials are configured)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // HH.ru OAuth (only if credentials are configured)
    ...(process.env.HH_CLIENT_ID && process.env.HH_CLIENT_SECRET
      ? [HHruProvider()]
      : []),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    /** SignIn callback — upsert user in DB for OAuth providers */
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'hh') {
        try {
          // Upsert user in DB for OAuth logins
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
          })

          if (existingUser) {
            // Update the user's info on login
            user.id = existingUser.id
            user.plan = existingUser.plan
          } else {
            // Create new user for OAuth login
            const newUser = await db.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                plan: 'STARTER',
              },
            })
            user.id = newUser.id
            user.plan = newUser.plan
          }
        } catch (error) {
          console.error('[NextAuth] signIn callback error:', error)
          return false
        }
      }

      return true
    },

    /** JWT callback — add user plan, id to token */
    async jwt({ token, user, trigger }) {
      // Initial sign in — user object is available
      if (user) {
        token.id = user.id
        token.plan = (user as Record<string, unknown>).plan as string ?? 'STARTER'
      }

      // On update trigger (e.g., session update), refresh plan from DB
      if (trigger === 'update') {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id },
            select: { plan: true },
          })
          if (dbUser) {
            token.plan = dbUser.plan
          }
        } catch {
          // Keep existing plan
        }
      }

      return token
    },

    /** Session callback — expose plan, id on session */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.plan = token.plan
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
}

/**
 * Helper: Check if NextAuth feature is enabled
 * Used by middleware and other server-side code
 */
export function isNextAuthEnabled(): boolean {
  return isFeatureEnabled('nextauth')
}
