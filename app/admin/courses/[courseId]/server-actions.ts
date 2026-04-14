'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../../../lib/prisma'
import { requireAdmin } from '../../../lib/auth'

export async function updateCourse(formData: FormData) {
  await requireAdmin()

  const courseId = formData.get('courseId')?.toString() || ''
  const title = formData.get('title')?.toString() || ''
  const description = formData.get('description')?.toString() || ''
  const price = Number(formData.get('price') || 0)

  if (!courseId || !title || !price) {
    throw new Error('Заполни обязательные поля')
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title,
      description,
      price,
    },
  })

  redirect('/admin')
}