'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../../lib/prisma'

export async function createCourse(formData: FormData) {
  const title = formData.get('title')?.toString() || ''
  const slug = formData.get('slug')?.toString() || ''
  const description = formData.get('description')?.toString() || ''
  const price = Number(formData.get('price')?.toString() || '0')
  const imageUrl = formData.get('imageUrl')?.toString() || ''
  const isPublished = formData.get('isPublished') === 'on'

  if (!title || !slug || !price) {
    throw new Error('Заполни обязательные поля')
  }

  await prisma.course.create({
    data: {
      title,
      slug,
      description,
      price,
      imageUrl,
      isPublished,
    },
  })

  redirect('/courses')
}