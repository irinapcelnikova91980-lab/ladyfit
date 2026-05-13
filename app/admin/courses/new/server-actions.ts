'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../../../lib/prisma'
import { requireAdmin } from '../../../lib/auth'

export async function createCourse(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title')?.toString().trim() || ''
  const slug = formData.get('slug')?.toString().trim() || ''
  const description = formData.get('description')?.toString().trim() || ''
  const price = Number(formData.get('price')?.toString() || '0')
  const isPublished = formData.get('isPublished') === 'on'

  if (!title || !slug || Number.isNaN(price) || price < 0) {
    throw new Error('Заполни обязательные поля')
  }

  await prisma.course.create({
    data: {
      title,
      slug,
      description: description || null,
      price,
      imageUrl: null,
      isPublished,
    },
  })

  redirect('/admin')
}