'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '../../../../lib/prisma'

export async function deleteLesson(formData: FormData) {
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    throw new Error('Нужно войти')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  if (!user || user.role !== 'admin') {
    throw new Error('Нет доступа')
  }

  const lessonId = formData.get('lessonId')?.toString() || ''
  const courseSlug = formData.get('courseSlug')?.toString() || ''

  if (!lessonId) {
    throw new Error('Урок не найден')
  }

  await prisma.lesson.delete({
    where: { id: lessonId },
  })

  redirect(`/courses/${courseSlug}`)
}