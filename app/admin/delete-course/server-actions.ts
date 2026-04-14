'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '../../lib/prisma'

export async function deleteCourse(formData: FormData) {
  const { userId: clerkUserId } = await auth()
  const courseId = formData.get('courseId')?.toString() || ''

  if (!clerkUserId) {
    throw new Error('Нужно войти')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  if (!user || user.role !== 'admin') {
    throw new Error('Нет доступа')
  }

  if (!courseId) {
    throw new Error('Курс не найден')
  }

  await prisma.course.delete({
    where: { id: courseId },
  })

  redirect('/admin')
}