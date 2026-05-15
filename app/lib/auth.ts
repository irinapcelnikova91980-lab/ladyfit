import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'
import { isOwner } from './owner'

export async function getCurrentUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return null

  if (!user.name) {
    const clerkUser = await currentUser()
    const name = clerkUser?.firstName ?? null
    if (name) {
      return prisma.user.update({ where: { clerkId }, data: { name } })
    }
  }

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Нужно войти')
  return user
}

export async function requireAdmin() {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Нужно войти')
  const user = await getCurrentUser()
  if (!user) throw new Error('Нужно войти')
  if (!isOwner(clerkId) && user.role !== 'admin') throw new Error('Нет доступа')
  return user
}
