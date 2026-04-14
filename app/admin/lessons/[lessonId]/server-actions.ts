'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../../../lib/prisma'
import { requireAdmin } from '../../../lib/auth'

export async function updateLesson(formData: FormData) {
  await requireAdmin()

  const lessonId = formData.get('lessonId')?.toString() || ''
  const title = formData.get('title')?.toString() || ''
  const content = formData.get('content')?.toString() || ''
  const videoUrl = formData.get('videoUrl')?.toString() || ''
  const order = Number(formData.get('order')?.toString() || '0')
  const isFree = formData.get('isFree') === 'on'

  if (!lessonId || !title || !order) {
    throw new Error('Заполни обязательные поля')
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title,
      content,
      videoUrl,
      order,
      isFree,
    },
  })

  redirect('/admin')
}