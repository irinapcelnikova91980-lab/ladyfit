import { auth } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const { userId: clerkId } = await auth()

  if (!clerkId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId },
  })

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Нужно войти')
  }

  return user
}

export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== 'admin') {
    throw new Error('Нет доступа')
  }

  return user
}