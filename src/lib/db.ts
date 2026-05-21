// ============================================================
// Prisma Client — Neon PostgreSQL (serverless-ready)
// Uses pooled connection (DATABASE_URL) for queries,
// direct connection (DIRECT_URL) for migrations.
// ============================================================

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
