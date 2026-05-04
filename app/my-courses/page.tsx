import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import { getCurrentUser } from '../lib/auth'
import MyCoursesClient from './MyCoursesClient'

export default async function MyCoursesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const accesses = await prisma.courseAccess.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: { lessons: { select: { id: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const courses = accesses.map((a) => a.course)

  return <MyCoursesClient courses={courses} />
}
