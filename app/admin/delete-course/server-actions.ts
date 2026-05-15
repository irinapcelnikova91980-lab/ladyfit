'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../../lib/prisma'
import { requireAdmin } from '../../lib/auth'

export async function deleteCourse(formData: FormData) {
  await requireAdmin()

  const courseId = formData.get('courseId')?.toString() || ''
  if (!courseId) throw new Error('Курс не найден')

  await prisma.course.delete({ where: { id: courseId } })

  redirect('/admin')
}
