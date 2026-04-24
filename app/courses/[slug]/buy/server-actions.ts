'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export async function buyCourse(formData: FormData) {
  const user = await requireAuth()

  const courseId = formData.get('courseId')?.toString() || ''
  const slug = formData.get('slug')?.toString() || ''

  if (!courseId || !slug) {
    throw new Error('Курс не найден')
  }

  await prisma.courseAccess.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      courseId,
    },
  })

  revalidatePath(`/courses/${slug}`)
  revalidatePath('/my-courses')

  redirect(`/courses/${slug}`)
}