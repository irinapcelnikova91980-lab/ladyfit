'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '../../../lib/prisma'

export async function grantAccess(formData: FormData) {
  const { userId: clerkUserId } = await auth()
  const slug = formData.get('slug')?.toString() || ''

  if (!clerkUserId) {
    throw new Error('Нужно войти')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  const course = await prisma.course.findUnique({
    where: { slug },
  })

  if (!user || !course) {
    throw new Error('Ошибка данных')
  }

  await prisma.courseAccess.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      courseId: course.id,
    },
  })

  redirect(`/courses/${slug}`)
}