'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../../lib/prisma'
import { requireAdmin } from '../../lib/auth'
import { isOwner } from '../../lib/owner'

export async function changeUserRole(formData: FormData) {
  await requireAdmin()

  const userId = formData.get('userId')?.toString() || ''
  const role = formData.get('role')?.toString() || ''

  if (!userId || !['user', 'admin'].includes(role)) throw new Error('Неверные данные')

  const target = await prisma.user.findUnique({ where: { id: userId } })
  if (!target) throw new Error('Пользователь не найден')

  // Allow role change even for owner (owner access is always guaranteed by isOwner() check, not DB role)
  await prisma.user.update({ where: { id: userId }, data: { role } })

  revalidatePath('/admin/users')
}

export async function deleteUser(formData: FormData) {
  await requireAdmin()

  const userId = formData.get('userId')?.toString() || ''
  if (!userId) throw new Error('Неверные данные')

  const target = await prisma.user.findUnique({ where: { id: userId } })
  if (!target) throw new Error('Пользователь не найден')

  // Owner is protected from deletion
  if (isOwner(target.clerkId)) throw new Error('Нельзя удалить владельца сайта')

  await prisma.user.delete({ where: { id: userId } })

  revalidatePath('/admin/users')
}
