import { PrismaClient } from '@prisma/client'

const g = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  g.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'info', 'warn'] : ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

export async function connectDatabase() {
  try {
    await prisma.$connect()
    await prisma.$runCommandRaw({ ping: 1 })
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
}

export async function checkDatabaseHealth() {
  try {
    await prisma.$runCommandRaw({ ping: 1 })
    return { status: 'healthy', timestamp: new Date().toISOString() }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}

if (process.env.NODE_ENV !== 'production') g.prisma = prisma
