'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../../../lib/prisma'
import { requireAdmin } from '../../../lib/auth'

export async function updateCourse(formData: FormData) {
  await requireAdmin()

  const courseId = formData.get('courseId')?.toString().trim() || ''
  const title = formData.get('title')?.toString().trim() || ''
  const slug = formData.get('slug')?.toString().trim() || ''
  const description = formData.get('description')?.toString().trim() || ''
  const price = Number(formData.get('price')?.toString() || '0')
  const isPublished = formData.get('isPublished') === 'on'

  if (!courseId || !title || !slug || Number.isNaN(price) || price < 0) {
    throw new Error('Заполни обязательные поля')
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title,
      slug,
      description: description || null,
      price,
      isPublished,
    },
  })

  redirect(`/admin/courses/${courseId}`)
}

export async function createLesson(formData: FormData) {
  await requireAdmin()

  const courseId = formData.get('courseId')?.toString().trim() || ''
  const title = formData.get('title')?.toString().trim() || ''
  const content = formData.get('content')?.toString().trim() || ''
  const videoUrl = formData.get('videoUrl')?.toString().trim() || ''
  const order = Number(formData.get('order')?.toString() || '1')
  const isFree = formData.get('isFree') === 'on'

  if (!courseId || !title || Number.isNaN(order) || order < 1) {
    throw new Error('Заполни обязательные поля урока')
  }

  await prisma.lesson.create({
    data: {
      courseId,
      title,
      content: content || null,
      videoUrl: videoUrl || null,
      order,
      isFree,
    },
  })

  redirect(`/admin/courses/${courseId}`)
}

export async function deleteLesson(formData: FormData) {
  await requireAdmin()

  const courseId = formData.get('courseId')?.toString().trim() || ''
  const lessonId = formData.get('lessonId')?.toString().trim() || ''

  if (!courseId || !lessonId) {
    throw new Error('Неверные данные урока')
  }

  await prisma.lesson.delete({
    where: { id: lessonId },
  })

  redirect(`/admin/courses/${courseId}`)
}