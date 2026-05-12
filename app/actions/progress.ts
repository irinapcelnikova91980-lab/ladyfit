'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../lib/prisma'
import { getCurrentUser } from '../lib/auth'

export async function markLessonComplete(lessonId: string, courseSlug: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: {},
    create: { userId: user.id, lessonId },
  })

  revalidatePath(`/courses/${courseSlug}/lessons/${lessonId}`)
  revalidatePath(`/courses/${courseSlug}`)
  revalidatePath('/my-courses')
}
