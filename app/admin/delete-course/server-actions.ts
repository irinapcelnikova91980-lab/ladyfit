'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '../../lib/prisma'
import { isOwner } from '../../lib/owner'

export async function deleteCourse(formData: FormData) {
  const { userId: clerkId } = await auth()
  const courseId = formData.get('courseId')?.toString() || ''

  if (!clerkId) throw new Error('Нужно войти')

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user || (user.role !== 'admin' && !isOwner(clerkId))) {
    throw new Error('Нет доступа')
  }

  if (!courseId) throw new Error('Курс не найден')

  await prisma.course.delete({ where: { id: courseId } })

  redirect('/admin')
}
