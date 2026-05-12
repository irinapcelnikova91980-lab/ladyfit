import { auth } from '@clerk/nextjs/server'
import { prisma } from './prisma'
import { isOwner } from './owner'

export async function getCurrentUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  const user = await prisma.user.findUnique({ where: { clerkId } })
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Нужно войти')
  return user
}

export async function requireAdmin() {
  const { userId: clerkId } = await auth()
  const user = await getCurrentUser()
  if (!user) throw new Error('Нужно войти')
  if (!isOwner(clerkId) && user.role !== 'admin') throw new Error('Нет доступа')
  return user
}
