'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../../../../lib/prisma'

export async function createLesson(formData: FormData) {
  const slug = formData.get('slug')?.toString() || ''
  const title = formData.get('title')?.toString() || ''
  const content = formData.get('content')?.toString() || ''
  const videoUrl = formData.get('videoUrl')?.toString() || ''
  const order = Number(formData.get('order')?.toString() || '0')
  const isFree = formData.get('isFree') === 'on'

  if (!slug || !title || !order) {
    throw new Error('Заполни обязательные поля')
  }

  const course = await prisma.course.findUnique({
    where: { slug },
  })

  if (!course) {
    throw new Error('Курс не найден')
  }

  await prisma.lesson.create({
    data: {
      title,
      content,
      videoUrl,
      order,
      isFree,
      courseId: course.id,
    },
  })

  redirect(`/courses/${slug}`)
}