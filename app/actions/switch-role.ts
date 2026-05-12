'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '../lib/prisma'
import { getCurrentUser } from '../lib/auth'
import { isOwner } from '../lib/owner'

export async function switchMyRole() {
  const { userId: clerkId } = await auth()
  if (!isOwner(clerkId)) throw new Error('Только владелец может переключать роли')

  const user = await getCurrentUser()
  if (!user) throw new Error('Нужно войти')

  const newRole = user.role === 'admin' ? 'user' : 'admin'
  await prisma.user.update({ where: { id: user.id }, data: { role: newRole } })

  revalidatePath('/', 'layout')
}
